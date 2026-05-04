package com.internship.tool.config;

// I am verifying that AiServiceClient loads as a Spring bean and the RestTemplate is configured correctly.
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class AiServiceClientTest {

    @Autowired
    private AiServiceClient aiServiceClient;

    @Test
    void contextLoads_aiServiceClientBeanIsPresent() {
        // Verify the bean is in the Spring context — no NPE means RestTemplate built correctly
        assertThat(aiServiceClient).isNotNull();
    }

    @Test
    void describe_withBlankInput_returnsNull() {
        // Blank input must return null without making a network call
        assertThat(aiServiceClient.describe("")).isNull();
        assertThat(aiServiceClient.describe(null)).isNull();
        assertThat(aiServiceClient.describe("   ")).isNull();
    }
}
