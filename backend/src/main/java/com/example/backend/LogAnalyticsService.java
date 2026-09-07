package com.example.backend;

import org.springframework.stereotype.Service;
import java.sql.*;
import java.util.*;

@Service
public class LogAnalyticsService {

    private static final String DUCKDB_URL = "jdbc:duckdb:";

    public List<Map<String, Object>> getTopThreatSources() {
        List<Map<String, Object>> results = new ArrayList<>();
        
        // DuckDB queries the CSV file located in the root project folder
        String sql = """
            SELECT source_ip, COUNT(*) AS flagged_count, SUM(bytes_sent) AS total_bytes
            FROM '../security_logs.csv'
            WHERE action IN ('DENY', 'FLAGGED')
            GROUP BY source_ip
            ORDER BY flagged_count DESC
            LIMIT 10
        """;

        try (Connection conn = DriverManager.getConnection(DUCKDB_URL);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                row.put("sourceIp", rs.getString("source_ip"));
                row.put("flaggedCount", rs.getLong("flagged_count"));
                row.put("totalBytes", rs.getLong("total_bytes"));
                results.add(row);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return results;
    }
}
