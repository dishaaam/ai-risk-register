package com.internship.tool.service;

import com.internship.tool.config.AiServiceClient;
import com.internship.tool.entity.RiskItem;
import com.internship.tool.repository.RiskItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class RiskService {

    private static final Logger logger = LoggerFactory.getLogger(RiskService.class);

    private final AiServiceClient aiServiceClient;
    private final RiskItemRepository riskItemRepository;

    public RiskService(AiServiceClient aiServiceClient, RiskItemRepository riskItemRepository) {
        this.aiServiceClient = aiServiceClient;
        this.riskItemRepository = riskItemRepository;
    }

    @Transactional
    public RiskItem createRiskItem(RiskItem item) {
        RiskItem savedItem = riskItemRepository.save(item);
        
        // I am firing the async AI call immediately after saving so I don't delay the HTTP response.
        String textForAi = savedItem.getTitle() + ". " + savedItem.getDescription();
        attachAiDescriptionAsync(savedItem.getId(), textForAi);
        
        logger.info("I've created the risk item with id: {}. I've also fired the async AI description call.", savedItem.getId());
        return savedItem;
    }

    /**
     * I use this method to asynchronously call my AI service to generate a description for a new risk record.
     * I then update the entity's aiDescription field in the database after the AI responds.
     */
    @Async
    public void attachAiDescriptionAsync(Long riskItemId, String riskText) {
        logger.info("I'm starting the async AI description call for riskItemId: {}", riskItemId);
        try {
            Map<String, Object> aiResponse = aiServiceClient.describe(riskText);

            if (aiResponse == null) {
                logger.warn("My AI describe call returned null for riskItemId: {}. I'm skipping the update.", riskItemId);
                return;
            }

            String description = (String) aiResponse.get("description");
            if (description == null || description.isBlank()) {
                logger.warn("My AI describe call returned an empty description for riskItemId: {}. I'm skipping the update.", riskItemId);
                return;
            }

            // I'm reloading the entity here to avoid overwriting any concurrent changes.
            riskItemRepository.findById(riskItemId).ifPresentOrElse(
                item -> {
                    item.setAiDescription(description);
                    riskItemRepository.save(item);
                    logger.info("I've successfully attached the AI description to riskItemId: {}. Length: {} chars.", riskItemId, description.length());
                },
                () -> logger.warn("I couldn't find riskItemId: {} when trying to attach the AI description.", riskItemId)
            );

        } catch (Exception e) {
            logger.error("My async AI description call failed for riskItemId: {}: {}", riskItemId, e.getMessage());
        }
    }
}

