# 🏦 Pension Management System

A **full-stack pension management application** with a **Next.js frontend** integrated with a **Spring Boot backend**. The system provides real-time pensioner, operations, group, and analytics management. All static data has been replaced with dynamic API calls from Spring Boot, making it **production-ready**, type-safe, and scalable.

---

## 🚀 Features

### **Dashboard**
- Real-time pensioner statistics
- Payment trends and charts
- Recent activity feed
- Dynamic city and payment method distributions

### **Pensioners Management**
- Complete CRUD operations (Create, Read, Update, Delete)
- Real-time search and filtering
- Full operation history per pensioner
- Responsive UI with error handling

### **Company Groups**
- Complete CRUD for company groups
- Sector and city-based filtering
- Real member counts and contributions
- Live search functionality

### **Operations & Refunds**
- Real deduction and refund operations
- Proper pensioner linking
- Full history with real backend data

### **Analytics & AI**
- Dynamic AI analysis using real operations data
- Customizable date filters
- Pensioner record summaries

---

## 📦 Project Structure

spring app/
├── CI-NextJS/ (Next.js frontend)
│ ├── src/
│ ├── package.json
│ └── ...
└── backend/ (Spring Boot backend)
├── src/
├── pom.xml
└── ...


---

## 🛠️ Prerequisites

- **Node.js** 18+
- **Java** 17+
- **Spring Boot** backend running on `http://localhost:8080`
- **MySQL Database** with sample data loaded
- CORS enabled for `http://localhost:9002`

---

## ⚡ Quick Start

### 1. Start the Spring Boot Backend
```bash
cd /path/to/pension-backend
mvn spring-boot:run

2. Start the Next.js Frontend
cd "c:\Users\Admin\Desktop\students\spring app\CI-NextJS"
npm install
npm run dev

3. Access the Application

Frontend: http://localhost:9002

Backend API: http://localhost:8080/api

🔧 Environment Variables
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_API_URL=http://localhost:8080

Note: Keep your Gemini API key secure and never expose it on the client-side.
