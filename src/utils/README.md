# Utils Directory

Centralized utilities and API calling configuration for the PartsQuote application.

## Structure

```
utils/
├── apicalling.ts         # Axios configuration with interceptors
├── apis/
│   ├── webapi.ts        # Public/guest APIs
│   ├── customerapi.ts   # Customer-specific APIs
│   ├── supplierapi.ts   # Supplier-specific APIs
│   ├── adminapi.ts      # Admin-specific APIs
│   └── index.ts         # API exports
├── index.ts             # Main exports
└── README.md            # This file
```

## API Configuration

The API layer is built on Axios with request/response interceptors for:
- Automatic authentication token injection
- Global error handling
- Request/response logging (development mode)
- Standardized error responses

### Base Configuration

```typescript
import { apiClient } from '@/utils';

// Base URL is configured from environment variable
// NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Usage Examples

### 1. Web API (Public)

```typescript
import { webAPI } from '@/utils/apis';

// Look up vehicle by registration
const { data, error } = await webAPI.lookupVehicle({
  registration: 'AB12CDE',
  postcode: 'SW1A1AA'
});

if (data) {
  console.log('Vehicle:', data);
} else {
  console.error('Error:', error?.message);
}

// Submit part request
const result = await webAPI.submitPartRequest({
  vehicleInfo: data,
  partCategory: 'Engine',
  partName: 'Oil Filter',
  description: 'Need replacement oil filter',
  condition: 'new',
  urgency: 'standard'
});
```

### 2. Customer API

```typescript
import { customerAPI } from '@/utils/apis';

// Get customer quotes
const { data, error } = await customerAPI.getQuotes();

if (data) {
  console.log('Quotes:', data);
}

// Accept a quote
await customerAPI.acceptQuote('quote-id', 'Delivery address');

// Send message to supplier
await customerAPI.sendMessage('conversation-id', 'Hello, is this still available?');
```

### 3. Supplier API

```typescript
import { supplierAPI } from '@/utils/apis';

// Get dashboard stats
const { data } = await supplierAPI.getDashboardStats();

// Get enquiries
const { data: enquiries } = await supplierAPI.getEnquiries({
  status: 'new',
  page: 1,
  limit: 10
});

// Submit a quote
await supplierAPI.submitQuote({
  enquiryId: 'enquiry-id',
  price: 89.99,
  condition: 'new',
  warranty: '12 months',
  deliveryTime: '2-3 days',
  deliveryFee: 5.99,
  description: 'Genuine part with warranty'
});
```

### 4. Admin API

```typescript
import { adminAPI } from '@/utils/apis';

// Get dashboard statistics
const { data } = await adminAPI.getDashboardStats();

// Get all users
const { data: users } = await adminAPI.getUsers({
  role: 'customer',
  status: 'active',
  page: 1,
  limit: 20
});

// Verify supplier
await adminAPI.verifySupplier('supplier-id', true, 'All documents verified');

// Get reports
const { data: report } = await adminAPI.getReports({
  type: 'revenue',
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  granularity: 'day'
});
```

## Error Handling

### Automatic Error Handling

The axios interceptor automatically handles common errors:
- **401 Unauthorized**: Clears auth and redirects to /auth
- **403 Forbidden**: Logs access denied
- **404 Not Found**: Logs resource not found
- **422 Validation Error**: Logs validation errors
- **500 Server Error**: Logs server error

### Manual Error Handling

```typescript
import { customerAPI, handleApiError } from '@/utils';

const result = await customerAPI.getQuotes();

if (result.error) {
  // Access standardized error
  console.error('Status:', result.error.status);
  console.error('Message:', result.error.message);
  console.error('Validation:', result.error.errors);
  
  // Show to user
  toast.error(result.error.message);
} else {
  // Success
  console.log('Quotes:', result.data);
}
```

## Authentication

### Setting Token

```typescript
// After successful login
localStorage.setItem('auth_token', token);
localStorage.setItem('user_role', 'customer');

// Token is automatically added to all requests
```

### Clearing Token

```typescript
// On logout
localStorage.removeItem('auth_token');
localStorage.removeItem('user_role');
```

## Custom API Requests

For endpoints not covered by the API classes:

```typescript
import { apiRequest } from '@/utils';

// GET request
const { data, error } = await apiRequest<ResponseType>(
  'get',
  '/custom/endpoint'
);

// POST request
const result = await apiRequest<ResponseType>(
  'post',
  '/custom/endpoint',
  { key: 'value' }
);

// With custom config
const result = await apiRequest<ResponseType>(
  'post',
  '/upload',
  formData,
  {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
);
```

## TypeScript Types

All API methods return a standardized response:

```typescript
{
  data?: T;           // Success data
  error?: {           // Error object
    message: string;
    status?: number;
    errors?: any;
  };
}
```

## Environment Variables

Required environment variables:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

For production:

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.partsquote.co.uk
```

## Development Mode

In development, all requests and responses are logged to console:

```
🚀 API Request: GET /customer/quotes
✅ API Response: 200 /customer/quotes
```

## Best Practices

1. **Always handle both success and error cases**
   ```typescript
   const { data, error } = await customerAPI.getQuotes();
   if (error) {
     // Handle error
   } else {
     // Use data
   }
   ```

2. **Use TypeScript types**
   ```typescript
   import type { Quote } from '@/utils/apis';
   const quotes: Quote[] = data;
   ```

3. **Centralize API calls in custom hooks**
   ```typescript
   // hooks/useQuotes.ts
   export function useQuotes() {
     const [quotes, setQuotes] = useState([]);
     const [loading, setLoading] = useState(true);
     
     useEffect(() => {
       async function loadQuotes() {
         const { data } = await customerAPI.getQuotes();
         if (data) setQuotes(data);
         setLoading(false);
       }
       loadQuotes();
     }, []);
     
     return { quotes, loading };
   }
   ```

4. **Show user-friendly errors**
   ```typescript
   import { toast } from 'sonner@2.0.3';
   
   const { error } = await customerAPI.acceptQuote(id, address);
   if (error) {
     toast.error(error.message);
   } else {
     toast.success('Quote accepted successfully!');
   }
   ```

## Next Steps

1. Implement actual API routes in `/app/api/`
2. Connect to database (PostgreSQL/Supabase)
3. Add real authentication (NextAuth.js)
4. Implement file upload handling
5. Add rate limiting and security measures
