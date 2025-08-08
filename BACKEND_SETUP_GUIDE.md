# 🚀 Backend Setup Guide - Fix 404 Errors

You're getting 404 errors because your Spring Boot backend either isn't running or doesn't have the required API endpoints. Here's how to fix it:

## 🔍 Step 1: Check if Backend is Running

Run one of these diagnostic tools:

### Option A: Use the diagnostic script
```bash
node diagnose-backend.js
```

### Option B: Use the batch file (Windows)
```bash
check-backend.bat
```

### Option C: Manual check
```bash
# Check if anything is running on port 8080
netstat -an | findstr :8080

# Test basic connectivity
curl http://localhost:8080
```

## 🏗️ Step 2: Start Your Spring Boot Backend

If nothing is running on port 8080, you need to start your Spring Boot application:

### Find your Spring Boot project
Your Spring Boot project should be in a separate directory, likely:
- `c:\Users\Admin\Desktop\students\spring app\backend\`
- `c:\Users\Admin\Desktop\students\spring app\pension-backend\`
- Or similar

### Start the backend
```bash
# Navigate to your Spring Boot project directory
cd "c:\Users\Admin\Desktop\students\spring app\[YOUR_BACKEND_FOLDER]"

# Start with Maven
mvn spring-boot:run

# OR start with Maven Wrapper
./mvnw spring-boot:run

# OR start with Gradle
./gradlew bootRun
```

## 🛠️ Step 3: Create Missing API Endpoints

If your backend is running but you're still getting 404s, you need to create the missing controllers:

### Create PensionerController.java
```java
package com.pension.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/pensioners")
@CrossOrigin(origins = "http://localhost:9002", allowCredentials = "true")
public class PensionerController {

    @GetMapping
    public List<Map<String, Object>> getAllPensioners() {
        // Return sample data for now
        List<Map<String, Object>> pensioners = new ArrayList<>();
        
        Map<String, Object> pensioner1 = new HashMap<>();
        pensioner1.put("id", 1);
        pensioner1.put("name", "Ahmed Benali");
        pensioner1.put("city", "Casablanca");
        pensioner1.put("monthlyPayment", 2500.0);
        pensioner1.put("paymentMethod", "BANK_TRANSFER");
        pensioner1.put("phoneNumber", "0612345678");
        pensioners.add(pensioner1);
        
        Map<String, Object> pensioner2 = new HashMap<>();
        pensioner2.put("id", 2);
        pensioner2.put("name", "Fatima Zahra");
        pensioner2.put("city", "Rabat");
        pensioner2.put("monthlyPayment", 3000.0);
        pensioner2.put("paymentMethod", "CHECK");
        pensioner2.put("phoneNumber", "0687654321");
        pensioners.add(pensioner2);
        
        return pensioners;
    }

    @GetMapping("/{id}")
    public Map<String, Object> getPensionerById(@PathVariable Long id) {
        Map<String, Object> pensioner = new HashMap<>();
        pensioner.put("id", id);
        pensioner.put("name", "Sample Pensioner " + id);
        pensioner.put("city", "Sample City");
        pensioner.put("monthlyPayment", 2500.0);
        pensioner.put("paymentMethod", "BANK_TRANSFER");
        return pensioner;
    }
}
```

### Create AffilieController.java
```java
package com.pension.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/affilies")
@CrossOrigin(origins = "http://localhost:9002", allowCredentials = "true")
public class AffilieController {

    @GetMapping
    public List<Map<String, Object>> getAllAffilies() {
        List<Map<String, Object>> affilies = new ArrayList<>();
        
        Map<String, Object> affilie1 = new HashMap<>();
        affilie1.put("idAffilie", 1);
        affilie1.put("matricule", "AFF001");
        affilie1.put("nom", "Alami");
        affilie1.put("prenom", "Mohammed");
        affilie1.put("actif", true);
        affilie1.put("ayantDroit", true);
        affilie1.put("adherentId", 101);
        affilies.add(affilie1);
        
        Map<String, Object> affilie2 = new HashMap<>();
        affilie2.put("idAffilie", 2);
        affilie2.put("matricule", "AFF002");
        affilie2.put("nom", "Bennani");
        affilie2.put("prenom", "Aicha");
        affilie2.put("actif", true);
        affilie2.put("ayantDroit", false);
        affilie2.put("adherentId", 102);
        affilies.add(affilie2);
        
        return affilies;
    }

    @GetMapping("/{id}")
    public Map<String, Object> getAffilieById(@PathVariable Long id) {
        Map<String, Object> affilie = new HashMap<>();
        affilie.put("idAffilie", id);
        affilie.put("matricule", "AFF" + String.format("%03d", id));
        affilie.put("nom", "Sample Nom " + id);
        affilie.put("prenom", "Sample Prenom");
        affilie.put("actif", true);
        affilie.put("ayantDroit", true);
        affilie.put("adherentId", 100 + id);
        return affilie;
    }
}
```

### Create AllocataireController.java
```java
package com.pension.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/allocataires")
@CrossOrigin(origins = "http://localhost:9002", allowCredentials = "true")
public class AllocataireController {

    @GetMapping
    public List<Map<String, Object>> getAllAllocataires() {
        List<Map<String, Object>> allocataires = new ArrayList<>();
        
        Map<String, Object> allocataire1 = new HashMap<>();
        allocataire1.put("idAllocataire", 1);
        allocataire1.put("numeroDossier", "DOS001");
        allocataire1.put("nom", "Tazi");
        allocataire1.put("prenom", "Youssef");
        allocataire1.put("affilieId", 1);
        allocataires.add(allocataire1);
        
        Map<String, Object> allocataire2 = new HashMap<>();
        allocataire2.put("idAllocataire", 2);
        allocataire2.put("numeroDossier", "DOS002");
        allocataire2.put("nom", "Idrissi");
        allocataire2.put("prenom", "Khadija");
        allocataire2.put("affilieId", 2);
        allocataires.add(allocataire2);
        
        return allocataires;
    }

    @GetMapping("/{id}")
    public Map<String, Object> getAllocataireById(@PathVariable Long id) {
        Map<String, Object> allocataire = new HashMap<>();
        allocataire.put("idAllocataire", id);
        allocataire.put("numeroDossier", "DOS" + String.format("%03d", id));
        allocataire.put("nom", "Sample Nom " + id);
        allocataire.put("prenom", "Sample Prenom");
        allocataire.put("affilieId", id);
        return allocataire;
    }
}
```

## 🔧 Step 4: Update CORS Configuration

Make sure your Spring Boot application allows requests from your Next.js frontend:

### Update SecurityConfig.java or create CorsConfig.java
```java
package com.pension.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:9002",  // Your Next.js frontend
            "http://localhost:3000"   // Alternative Next.js port
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## 🧪 Step 5: Test Your Backend

After starting your backend, test the endpoints:

### Using curl
```bash
# Test pensioners
curl http://localhost:8080/api/pensioners

# Test affilies
curl http://localhost:8080/api/affilies

# Test allocataires
curl http://localhost:8080/api/allocataires
```

### Using the test page
Open `test-api-endpoints.html` in your browser and test all endpoints.

## 🎯 Expected Results

After following these steps:

1. ✅ `node diagnose-backend.js` shows port 8080 is active
2. ✅ `curl http://localhost:8080/api/pensioners` returns JSON data
3. ✅ Your Next.js frontend loads data without 404 errors
4. ✅ All three pages (Adhérents, Affiliés, Allocataires) work

## 🆘 Still Having Issues?

### Common Problems:

1. **Port conflicts**: Check if another app is using port 8080
2. **Java not installed**: Make sure Java 11+ is installed
3. **Maven/Gradle not found**: Install Maven or use the wrapper scripts
4. **Wrong directory**: Make sure you're in the Spring Boot project directory

### Get Help:
1. Share your Spring Boot console output
2. Share the result of `node diagnose-backend.js`
3. Check if you have a `pom.xml` or `build.gradle` file in your backend directory

## 📁 Project Structure Should Look Like:
```
spring app/
├── CI-NextJS/          (Your Next.js frontend)
│   ├── src/
│   ├── package.json
│   └── ...
└── backend/            (Your Spring Boot backend)
    ├── src/
    ├── pom.xml
    └── ...
```