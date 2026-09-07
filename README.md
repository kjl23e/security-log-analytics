# Autonomous Security Log Analytics Engine

A high-performance SIEM (Security Information and Event Management) telemetry analytics platform built to ingest, aggregate, and visualize real-time threat telemetry from massive network log streams using DuckDB in-memory OLAP SQL execution.

![Tech Stack](https://img.shields.io/badge/Stack-Spring%20Boot%203%20%7C%20DuckDB%20%7C%20React%20%7C%20Vite-blue)
![Java Version](https://img.shields.io/badge/Java-17-orange)

---

## Key Features

- **High-Speed OLAP Analytics**: Queries **100,000+ raw log records** directly in memory using embedded DuckDB over JDBC for sub-second analytical aggregations.
- **RESTful Telemetry Endpoints**: Spring Boot 3 service layer exposing top attack vectors, hourly threat velocity spikes, and firewall action distributions (`ALLOW`, `DENY`, `FLAGGED`).
- **Interactive SIEM UI**: Modern React + Vite dashboard powered by Recharts, featuring real-time IP threat search, attack timelines, and security metric KPIs.

---

## Architecture & Tech Stack

- **Backend**: Java 17, Spring Boot 3, DuckDB JDBC, Gradle
- **Frontend**: React 18, Vite, Recharts, Lucide React
- **Data Source**: Synthetic Security Logs CSV (`timestamp`, `source_ip`, `destination_ip`, `action`, `bytes_sent`)

---

## Quick Start

### 1. Prerequisites
- Java 17+
- Node.js v18+

### 2. Run Backend API
```bash
cd backend
./gradlew bootRun
```
*API running on `http://localhost:8080/api/analytics`*

### 3. Run Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
*UI running on `http://localhost:5173`*

---

## Analytical API Endpoints

| Endpoint | Method | Analytical Purpose & DuckDB Query Logic |
| :--- | :--- | :--- |
| `/api/analytics/top-threats` | `GET` | Aggregates top 10 offending source IPs filtered by `DENY` & `FLAGGED` counts. |
| `/api/analytics/action-distribution` | `GET` | Computes action category totals across the entire log stream. |
| `/api/analytics/hourly-spikes` | `GET` | Buckets events using `date_trunc('hour', ...)` to trace threat velocity. |
