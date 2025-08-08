# Troubleshooting Authentication Issues

## Error: "TypeError: Failed to fetch"

This error occurs when the frontend cannot connect to the Spring Boot backend. Here are the steps to resolve it:

### 1. Check Backend Status

First, verify your Spring Boot application is running:

```bash
# Check if Spring Boot is running on port 8080
curl http://localhost:8080/api/auth/login
# or visit in browser: http://localhost:8080/api/auth/login
```

If you get a connection error, your Spring Boot app is not running.

### 2. Start Spring Boot Application

Make sure your Spring Boot application is running with the authentication endpoints:

```bash
# In your Spring Boot project directory
./mvnw spring-boot:run
# or
mvn spring-boot:run
# or if using Gradle
./gradlew bootRun
```

### 3. Verify Endpoints

Test the authentication endpoints directly:

```bash
# Test login endpoint
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Should return: {"username":"admin","roles":["ROLE_ADMIN","ROLE_USER"]}
```

### 4. Check CORS Configuration

Your Next.js app is running on port 9002, so update your Spring Boot CORS configuration:

```java
@Bean
CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList(
        "http://localhost:9002",  // Default Next.js port
        "http://localhost:9002"   // Your current port
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

### 5. Network Debugging

Open browser developer tools (F12) and check:

1. **Network Tab**: Look for failed requests to `http://localhost:8080/api/auth/login`
2. **Console Tab**: Check for CORS errors or other JavaScript errors
3. **Application Tab**: Verify cookies are being set after login

### 6. Test with Simple HTML

Create a simple test file to verify the backend:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Auth Test</title>
</head>
<body>
    <button onclick="testLogin()">Test Login</button>
    <div id="result"></div>

    <script>
        async function testLogin() {
            try {
                const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: 'admin',
                        password: 'admin123'
                    }),
                    credentials: 'include'
                });
                
                const result = await response.text();
                document.getElementById('result').innerHTML = `Status: ${response.status}<br>Response: ${result}`;
            } catch (error) {
                document.getElementById('result').innerHTML = `Error: ${error.message}`;
            }
        }
    </script>
</body>
</html>
```

### 7. Common Solutions

#### Solution A: Backend Not Running
- Start your Spring Boot application
- Verify it's running on port 8080
- Check application logs for errors

#### Solution B: CORS Issues
- Update CORS configuration to include port 9002
- Restart Spring Boot application
- Clear browser cache

#### Solution C: Port Conflicts
- Change Next.js port to 9002: `npm run dev -- -p 9002`
- Or update `.env` file: `NEXT_PUBLIC_API_URL=http://localhost:YOUR_SPRING_BOOT_PORT`

#### Solution D: Firewall/Network Issues
- Disable firewall temporarily to test
- Check if localhost resolves correctly
- Try using 127.0.0.1 instead of localhost

### 8. Quick Fix Commands

```bash
# Check what's running on port 8080
netstat -an | grep 8080
# or
lsof -i :8080

# Kill process on port 8080 if needed (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Kill process on port 8080 (Mac/Linux)
lsof -ti:8080 | xargs kill -9
```

### 9. Environment Variables

Verify your environment variables:

```bash
# Check current API URL
echo $NEXT_PUBLIC_API_URL

# Or in Windows
echo %NEXT_PUBLIC_API_URL%
```

### 10. Alternative Testing

If the issue persists, try these alternatives:

1. **Use Postman or Insomnia** to test the Spring Boot endpoints
2. **Check Spring Boot actuator** endpoints if enabled: `http://localhost:8080/actuator/health`
3. **Enable Spring Boot debug logging** in `application.properties`:
   ```properties
   logging.level.org.springframework.security=DEBUG
   logging.level.org.springframework.web.cors=DEBUG
   ```

## Success Indicators

When everything is working correctly, you should see:

1. ✅ Spring Boot starts without errors
2. ✅ `curl http://localhost:8080/api/auth/login` returns a response (even if 405 Method Not Allowed)
3. ✅ Browser network tab shows successful OPTIONS preflight requests
4. ✅ Login request returns 200 with user data
5. ✅ `JSESSIONID` cookie is set in browser

## Still Having Issues?

If you're still experiencing problems:

1. Share your Spring Boot application logs
2. Share browser console errors
3. Share network tab screenshots
4. Confirm your Spring Boot project structure and dependencies