package com.internship.tool.config;

// I am the centralised HTTP client for all my AI microservice calls.
// I've configured every call with a 10-second timeout. If a call fails, I return null — I never throw exceptions to the caller.
// I've made this class a Spring @Component so I can easily inject it wherever I need it.

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Component
public class AiServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(AiServiceClient.class);

    // I'm reading the AI service base URL from my application.yml or .env file.
    @Value("${ai.service.url:http://localhost:5000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate;

    // I am constructing my RestTemplate with a 10-second connect and read timeout.
    // I did this to prevent my Java service from hanging if my Flask service is slow.
    public AiServiceClient(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .connectTimeout(Duration.ofSeconds(10))
                .readTimeout(Duration.ofSeconds(10))
                .build();
    }

    // ─── My private helper: POST JSON to an AI endpoint ────────────────────────

    /**
     * I use this helper to send a POST request to a specific AI endpoint.
     * I return the response body as a Map, or null if something goes wrong.
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> postToAi(String path, Map<String, Object> body) {
        String url = aiServiceUrl + path;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            logger.info("I'm calling the AI endpoint: POST {}", url);
            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, Map.class
            );
            logger.info("The AI endpoint {} responded with status {}", url, response.getStatusCode());
            return (Map<String, Object>) response.getBody();
        } catch (ResourceAccessException e) {
            // I'm handling timeouts or connection issues here — the AI service might be down.
            logger.error("I hit a timeout or connection refused at {}: {}", url, e.getMessage());
            return null;
        } catch (RestClientException e) {
            logger.error("My AI service call failed at {}: {}", url, e.getMessage());
            return null;
        } catch (Exception e) {
            logger.error("I encountered an unexpected error calling my AI service at {}: {}", url, e.getMessage());
            return null;
        }
    }

    // ─── My public endpoint methods ─────────────────────────────────────────────

    /**
     * I call my POST /describe endpoint to generate a professional risk description.
     */
    public Map<String, Object> describe(String text) {
        if (text == null || text.isBlank()) {
            logger.warn("I received blank text for describe(). I'm returning null.");
            return null;
        }
        Map<String, Object> body = new HashMap<>();
        body.put("text", text);
        return postToAi("/describe", body);
    }

    /**
     * I call my POST /categorise endpoint to classify a risk into a category.
     */
    public Map<String, Object> categorise(String text) {
        if (text == null || text.isBlank()) {
            logger.warn("I received blank text for categorise(). I'm returning null.");
            return null;
        }
        Map<String, Object> body = new HashMap<>();
        body.put("text", text);
        return postToAi("/categorise", body);
    }

    /**
     * I call my POST /recommend endpoint to get 3 actionable mitigation recommendations.
     */
    public Map<String, Object> recommend(String text) {
        if (text == null || text.isBlank()) {
            logger.warn("I received blank text for recommend(). I'm returning null.");
            return null;
        }
        Map<String, Object> body = new HashMap<>();
        body.put("text", text);
        return postToAi("/recommend", body);
    }

    /**
     * I call my POST /query endpoint to perform a RAG-based question and answer lookup.
     */
    public Map<String, Object> query(String text) {
        if (text == null || text.isBlank()) {
            logger.warn("I received blank text for query(). I'm returning null.");
            return null;
        }
        Map<String, Object> body = new HashMap<>();
        body.put("text", text); // I've updated this to 'text' to match my Flask endpoint
        return postToAi("/query", body);
    }

    /**
     * I call my POST /generate-report endpoint to produce an AI-generated report.
     */
    public Map<String, Object> generateReport(String text) {
        if (text == null || text.isBlank()) {
            logger.warn("I received blank text for generateReport(). I'm returning null.");
            return null;
        }
        Map<String, Object> body = new HashMap<>();
        body.put("text", text);
        return postToAi("/generate-report", body);
    }

    /**
     * I call my POST /analyse-document endpoint to identify key insights from a document.
     */
    public Map<String, Object> analyseDocument(String text) {
        if (text == null || text.isBlank()) {
            logger.warn("I received blank text for analyseDocument(). I'm returning null.");
            return null;
        }
        Map<String, Object> body = new HashMap<>();
        body.put("text", text);
        return postToAi("/analyse-document", body);
    }
}
