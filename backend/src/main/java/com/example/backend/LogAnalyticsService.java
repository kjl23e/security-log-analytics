package com.example.backend;

import org.springframework.stereotype.Service;
import java.sql.*;
import java.util.*;

@Service
public class LogAnalyticsService {

    private static final String DUCKDB_URL = "jdbc:duckdb:";

    public List<Map<String, Object>> getTopThreatSources() {
        String sql = """
            SELECT source_ip, COUNT(*) AS flagged_count, SUM(bytes_sent) AS total_bytes
            FROM '../security_logs.csv'
            WHERE action IN ('DENY', 'FLAGGED')
            GROUP BY source_ip
            ORDER BY flagged_count DESC
            LIMIT 10
        """;
        return executeQuery(sql, "sourceIp", "flaggedCount", "totalBytes");
    }

    public List<Map<String, Object>> getActionDistribution() {
        String sql = """
            SELECT action, COUNT(*) AS total
            FROM '../security_logs.csv'
            GROUP BY action
        """;
        return executeQuery(sql, "action", "total");
    }

    public List<Map<String, Object>> getHourlyAttackSpikes() {
        String sql = """
            SELECT date_trunc('hour', timestamp::TIMESTAMP) AS attack_hour, COUNT(*) AS event_count
            FROM '../security_logs.csv'
            WHERE action IN ('DENY', 'FLAGGED')
            GROUP BY attack_hour
            ORDER BY attack_hour ASC
        """;
        return executeQuery(sql, "attackHour", "eventCount");
    }

    private List<Map<String, Object>> executeQuery(String sql, String... keys) {
        List<Map<String, Object>> results = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(DUCKDB_URL);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                for (int i = 0; i < keys.length; i++) {
                    row.put(keys[i], rs.getObject(i + 1));
                }
                results.add(row);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return results;
    }
}
