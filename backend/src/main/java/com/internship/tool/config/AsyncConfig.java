package com.internship.tool.config;

// I am enabling Spring's @Async processing so my AI calls do not block my HTTP responses.
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Override
    public Executor getAsyncExecutor() {
        // I am configuring a thread pool for my async AI calls.
        // I've set it to 2 core threads and a max of 5, with a queue of 100 tasks.
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("ai-async-");
        executor.initialize();
        return executor;
    }
}

