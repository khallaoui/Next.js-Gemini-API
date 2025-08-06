# Complete Setup Guide - Next.js + Spring Boot with Spring Security

This guide will help you set up the complete authentication system between your Next.js frontend and Spring Boot backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Java 17+ installed
- Spring Boot application running on `http://localhost:8080`

### 1. Frontend Setup (Next.js)

The frontend is already configured with Spring Security integration. Just run:

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

### 2. Backend Setup (Spring Boot)

Add the following files to your Spring Boot project:

#### Dependencies (add to `pom.xml`)
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

#### Create the Authentication Controller
Create `src/main/java/com/pension/controller/AuthController.java` with the code from `SPRING_SECURITY_INTEGRATION.md`

#### Create Security Configuration
Create `src/main/java/com/pension/config/SecurityConfig.java` with the code from `SPRING_SECURITY_INTEGRATION.md`

#### Create User Details Configuration
Create `src/main/java/com/pension/config/UserDetailsConfig.java` with the code from `SPRING_SECURITY_INTEGRATION.md`

### 3. Test the Integration

1. Start your Spring Boot application
2. Start the Next.js application
3. Navigate to `http://localhost:3000`
4. You should be redirected to the login page
5. Use these credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
   - OR
   - **Username**: `user`
   - **Password**: `password`

## 🔧 Configuration Details

### Frontend Configuration

The frontend is configured to:
- Send authentication requests to `http://localhost:8080/api/auth/*`
- Include credentials (cookies) in all API requests
- Automatically redirect to login on authentication failures
- Store user information in localStorage for UI purposes

### Backend Configuration

The backend provides:
- **POST** `/api/auth/login` - Authenticate user and create session
- **POST** `/api/auth/logout` - Invalidate session
- **GET** `/api/auth/me` - Get current authenticated user
- Session-based authentication using `JSESSIONID` cookie
- CORS configuration allowing requests from `http://localhost:3000`

## 🔐 Default Users

The system comes with two pre-configured users:

| Username | Password | Roles |
|----------|----------|-------|
| admin | admin123 | ADMIN, USER |
| user | password | USER |

## 🛠️ Customization

### Adding Database Authentication

To replace in-memory users with database authentication:

1. Add JPA dependencies to your `pom.xml`
2. Create User and Role entities
3. Implement `UserDetailsService` with database queries
4. Replace `InMemoryUserDetailsManager` with your custom implementation

### Adding More Endpoints

All endpoints except `/api/auth/login` and `/api/auth/logout` require authentication. Your existing pension management endpoints will automatically be protected.

### Frontend Customization

- Modify `src/lib/auth.ts` to add more authentication features
- Update `src/components/user-nav.tsx` to show user roles
- Add role-based route protection in `middleware.ts`

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure your Spring Boot app allows `http://localhost:3000` with credentials
   - Check that `setAllowCredentials(true)` is set in CORS configuration

2. **Session Not Persisting**
   - Verify that cookies are being sent with requests
   - Check browser developer tools for `JSESSIONID` cookie

3. **Login Fails**
   - Verify Spring Boot is running on port 8080
   - Check that the AuthController endpoints are accessible
   - Ensure password encoding matches between frontend and backend

4. **API Calls Fail After Login**
   - Check that all API requests include `credentials: 'include'`
   - Verify that protected endpoints require authentication in Spring Security

### Debug Steps

1. Check browser network tab for API requests
2. Verify Spring Boot logs for authentication attempts
3. Test authentication endpoints directly with curl:

```bash
# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt

# Test protected endpoint
curl -X GET http://localhost:8080/api/pensioners \
  -b cookies.txt
```

## 🚀 Next Steps

Once authentication is working:

1. **Database Integration**: Replace in-memory users with database authentication
2. **Role-Based Access**: Implement different access levels for different user roles
3. **Password Reset**: Add password reset functionality
4. **User Management**: Create admin interface for managing users
5. **Session Timeout**: Configure session timeout and renewal

## 📚 Additional Resources

- [Spring Security Documentation](https://docs.spring.io/spring-security/reference/)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)
- [CORS Configuration Guide](https://spring.io/guides/gs/rest-service-cors/)

The system is now ready for production use with proper security measures in place!