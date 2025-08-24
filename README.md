# 🏦 Pension Management System

> A modern, full-stack pension management application with real-time analytics and AI integration.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-blue.svg)](https://nextjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-yellow.svg)](https://opensource.org/licenses/Apache-2.0)

A comprehensive **full-stack pension management application** featuring a **Next.js frontend** integrated with a **Spring Boot backend**. The system provides real-time pensioner management, operations tracking, group administration, and advanced analytics. All static data has been replaced with dynamic API calls, making it **production-ready**, type-safe, and scalable.

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Key Benefits](#-key-benefits)
- [Troubleshooting](#-troubleshooting)
- [Migration Notes](#-migration-notes)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

## 🚀 Features

### **Dashboard**
- 📊 Real-time pensioner statistics and metrics
- 📈 Interactive payment trends and charts
- 🔔 Recent activity feed and notifications
- 🗺️ Dynamic city and payment method distributions

### **Pensioners Management**
- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- 🔍 Real-time search and advanced filtering
- 📋 Full operation history per pensioner
- 📱 Responsive UI with comprehensive error handling

### **Company Groups**
- 🏢 Complete CRUD for company groups management
- 🏙️ Sector and city-based filtering capabilities
- 👥 Real-time member counts and contributions tracking
- 🔎 Live search functionality

### **Operations & Refunds**
- 💰 Real deduction and refund operations processing
- 🔗 Proper pensioner linking and relationship management
- 📊 Full historical data with real backend integration

### **Analytics & AI**
- 🤖 Dynamic AI analysis using real operations data
- 📅 Customizable date filters and reporting periods
- 📝 Comprehensive pensioner record summaries

---

## 🏗️ Architecture
pension-management-system/
├── frontend/ # Next.js 15 Application
│ ├── src/
│ │ ├── components/ # Reusable React components
│ │ ├── pages/ # Next.js pages and routing
│ │ ├── services/ # API service layer
│ │ └── types/ # TypeScript type definitions
│ ├── public/ # Static assets
│ ├── package.json
│ └── next.config.js
└── backend/ # Spring Boot 3.2 Application
├── src/
│ ├── main/
│ │ ├── java/
│ │ │ └── com/
│ │ │ └── pension/
│ │ │ ├── controller/ # REST controllers
│ │ │ ├── service/ # Business logic
│ │ │ ├── repository/ # Data access layer
│ │ │ ├── model/ # Entity classes
│ │ │ └── config/ # Configuration
│ │ └── resources/
│ │ ├── application.properties
│ │ └── data.sql # Sample data
│ └── test/ # Test classes
├── pom.xml
└── Dockerfile
