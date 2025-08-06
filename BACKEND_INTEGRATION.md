# Spring Boot Backend Integration Guide

This Next.js application has been updated to consume the Spring Boot Pension Management backend. Here's what has been changed and how to use it.

## 🔄 Changes Made

### 1. API Configuration
- **Updated `.env`**: Changed `NEXT_PUBLIC_API_URL` to `http://localhost:8080`
- **New API Library**: Created comprehensive `src/lib/api.ts` with all backend endpoints

### 2. Data Models
The app now uses the Spring Boot data models:

#### Pensioner
```typescript
interface Pensioner {
  id?: number;
  name: string;
  city: string;
  monthlyPayment: number;
  paymentMethod: 'BANK_TRANSFER' | 'CHECK' | 'CASH' | 'DIGITAL_WALLET';
  lastPaymentDate?: string;
  birthDate?: string;
  phoneNumber?: string;
}
```

#### Operation
```typescript
interface Operation {
  id?: number;
  pensioner?: Pensioner;
  pensionerId?: number;
  amount: number;
  type: 'PAYMENT' | 'ADJUSTMENT' | 'BONUS' | 'DEDUCTION';
  timestamp: string;
  description?: string;
}
```

#### Group
```typescript
interface Group {
  id?: number;
  name: string;
  description?: string;
  pensioners?: Pensioner[];
}
```

### 3. Updated Components

#### Dashboard Components
- **StatsCards**: Now fetches data from `/api/dashboard/stats`
- **MonthlyPaymentsChart**: Displays real payment data from operations
- **RecentActivity**: Shows recent operations with proper pensioner information

#### Pensioners Page
- **Complete rewrite**: Now fetches pensioners from Spring Boot API
- **Real-time filtering**: By city, payment method, and search terms
- **Error handling**: Displays helpful messages when backend is unavailable

### 4. API Functions Available

#### Pensioner API
```typescript
pensionerApi.getAll()                    // GET /api/pensioners
pensionerApi.getById(id)                 // GET /api/pensioners/{id}
pensionerApi.create(pensioner)           // POST /api/pensioners
pensionerApi.update(id, pensioner)       // PUT /api/pensioners/{id}
pensionerApi.delete(id)                  // DELETE /api/pensioners/{id}
pensionerApi.getByCity(city)             // GET /api/pensioners/city/{city}
```

#### Operation API
```typescript
operationApi.getAll()                    // GET /api/operations
operationApi.getById(id)                 // GET /api/operations/{id}
operationApi.create(operation)           // POST /api/operations
operationApi.update(id, operation)       // PUT /api/operations/{id}
operationApi.delete(id)                  // DELETE /api/operations/{id}
operationApi.getByPensionerId(id)        // GET /api/operations/pensioner/{id}
```

#### Group API
```typescript
groupApi.getAll()                        // GET /api/groups
groupApi.getById(id)                     // GET /api/groups/{id}
groupApi.create(group)                   // POST /api/groups
groupApi.update(id, group)               // PUT /api/groups/{id}
groupApi.delete(id)                      // DELETE /api/groups/{id}
groupApi.addPensioner(groupId, pensionerId)     // POST /api/groups/{groupId}/pensioners/{pensionerId}
groupApi.removePensioner(groupId, pensionerId)  // DELETE /api/groups/{groupId}/pensioners/{pensionerId}
```

#### Dashboard API
```typescript
dashboardApi.getStats()                  // GET /api/dashboard/stats
```

## 🚀 How to Run

### Prerequisites
1. **Spring Boot Backend**: Must be running on `http://localhost:8080`
2. **MySQL Database**: With sample data loaded
3. **Node.js**: Version 18 or higher

### Steps

1. **Start the Spring Boot Backend**
   ```bash
   cd /path/to/pension-backend
   mvn spring-boot:run
   ```

2. **Start the Next.js Frontend**
   ```bash
   cd "c:\Users\Admin\Desktop\students\spring app\CI-NextJS"
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:9002
   - Backend API: http://localhost:8080/api

## 🔧 Configuration

### Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend Requirements
The Spring Boot backend must have these endpoints available:
- `/api/pensioners` - Pensioner CRUD operations
- `/api/operations` - Operation CRUD operations  
- `/api/groups` - Group CRUD operations
- `/api/dashboard/stats` - Dashboard statistics

## 🎯 Features

### Dashboard
- **Real-time Statistics**: Total pensioners, operations count, deductions
- **Monthly Payments Chart**: Visual representation of payment trends
- **Recent Activity**: Latest operations with pensioner details
- **Error Handling**: Graceful fallbacks when backend is unavailable

### Pensioners Management
- **Complete CRUD**: Create, read, update, delete pensioners
- **Advanced Filtering**: By city, payment method, search terms
- **Real-time Search**: Instant filtering as you type
- **Responsive Design**: Works on all device sizes

### Data Integrity
- **Type Safety**: Full TypeScript support for all API calls
- **Error Boundaries**: Proper error handling and user feedback
- **Loading States**: Skeleton loaders and progress indicators

## 🔄 Migration from Legacy Data

The API library includes transformer functions to convert legacy JSON data:

```typescript
// Convert legacy pensioner data
const newPensioner = transformers.legacyPensionerToNew(legacyPensioner);

// Convert legacy operation data  
const newOperation = transformers.legacyOperationToNew(legacyOperation);
```

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**
   - Ensure Spring Boot backend is running on port 8080
   - Check CORS configuration in Spring Boot
   - Verify database connection

2. **Empty dashboard**
   - Check if sample data is loaded in MySQL
   - Verify API endpoints are responding
   - Check browser console for errors

3. **Styling issues**
   - Ensure all Tailwind classes are available
   - Check if shadcn/ui components are properly installed

### Debug Mode
Enable detailed logging by opening browser console. All API calls are logged with their responses.

## 📚 Next Steps

1. **Add Authentication**: Implement user login/logout
2. **Real-time Updates**: Add WebSocket support for live data
3. **Advanced Reports**: Create detailed analytics pages
4. **Mobile App**: Consider React Native version
5. **Testing**: Add unit and integration tests

## �� Contributing

When adding new features:
1. Update the API types in `src/lib/api.ts`
2. Add corresponding API functions
3. Update components to use new endpoints
4. Add proper error handling
5. Update this documentation

---

**Note**: This integration maintains backward compatibility while providing a modern, type-safe interface to the Spring Boot backend. All legacy JSON files remain in place for reference but are no longer used by the application.