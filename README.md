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

```
spring app/
├── CI-NextJS/          (Next.js frontend)
│   ├── src/
│   ├── package.json
│   └── ...
└── backend/            (Spring Boot backend)
    ├── src/
    ├── pom.xml
    └── ...
```

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
```

### 2. Start the Next.js Frontend
```bash
cd "c:\Users\Admin\Desktop\students\spring app\CI-NextJS"
npm install
npm run dev
```

### 3. Access the Application

* Frontend: [http://localhost:9002](http://localhost:9002)
* Backend API: [http://localhost:8080/api](http://localhost:8080/api)

---

## 🔧 Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> **Note:** Keep your Gemini API key secure and never expose it on the client-side.

---

## 📝 API Endpoints

### Pensioners

```
GET/POST/PUT/DELETE /api/pensioners
GET /api/pensioners/city/{city}
```

### Operations

```
GET/POST/PUT/DELETE /api/operations
GET /api/operations/pensioner/{id}
GET /api/operations/type/{type}
```

### Dashboard

```
GET /api/dashboard/stats
```

### Company Groups

```
GET/POST/PUT/DELETE /api/company-groups
GET /api/company-groups/city/{city}
GET /api/company-groups/sector/{sector}
```

### Banking Information

```
GET/POST/PUT/DELETE /api/banking
GET /api/banking/pensioner/{id}
```

### Pension Requests / Claims

```
GET/POST/PUT/DELETE /api/demandes
GET /api/demandes/pensioner/{id}
```

---

## 🎯 Key Benefits

### **For Developers**

* Single source of truth from backend
* Type-safe API integration
* Scalable and maintainable code
* Easier debugging with real API responses

### **For Users**

* Real-time updates
* Accurate and consistent data
* Optimized performance
* Reliable functionality with proper error handling

### **For System**

* Centralized data management
* Production-ready architecture
* Future-proof and extensible

---

## 🐛 Troubleshooting

### Common Issues

* **404 Errors:** Ensure backend is running and endpoints exist
* **CORS Errors:** Verify Spring Boot allows `http://localhost:9002`
* **Backend unavailable:** Check port 8080 and database connectivity

### Diagnostic Commands

```bash
# Test backend connectivity
curl http://localhost:8080/api/pensioners
```

---

## 🏆 Migration Notes

* All static JSON data replaced with live API calls
* 15+ components updated for backend integration
* 20+ new API functions implemented
* Loading states and error handling added
* Backward compatibility maintained with legacy transformers

---

## 📚 Next Steps / Enhancements

* Real-time updates via WebSockets
* Advanced filtering and search
* Bulk operations support
* Performance optimization and caching (React Query)
* Monitoring and analytics dashboard

---

## 📌 License

This project is **open source** and uses **Apache 2.0** for code samples and **Creative Commons Attribution 4.0** for documentation.
