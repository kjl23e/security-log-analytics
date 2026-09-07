package com.example.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5173") // Enables React dev server access
public class LogAnalyticsController {

    private final LogAnalyticsService analyticsService;

    public LogAnalyticsController(LogAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/top-threats")
    public List<Map<String, Object>> getTopThreats() {
        return analyticsService.getTopThreatSources();
    }
}
