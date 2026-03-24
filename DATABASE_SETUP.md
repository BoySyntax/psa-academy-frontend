# Database Setup for PSA Academy

## Environment Variables

### Frontend (React/Vite)
```bash
# API Config
VITE_API_BASE_URL=http://localhost:3000

# MySQL Database Config
DATABASE_URL=mysql://root:rPJiqGBGLnbGexGTZxMcIBWFcGuVScfP@roundhouse.proxy.rlwy.net:41855/railway
MYSQL_URL=mysql://root:rPJiqGBGLnbGexGTZxMcIBWFcGuVScfP@roundhouse.proxy.rlwy.net:41855/railway
```

### Backend (PHP)
The database configuration is automatically handled in `config/database.php`:
- Host: `roundhouse.proxy.rlwy.net:41855`
- Database: `railway`
- Username: `root`
- Password: `rPJiqGBGLnbGexGTZxMcIBWFcGuVScfP`

## Railway Deployment

Add these environment variables in your Railway project:

1. **VITE_API_BASE_URL** - Your API base URL
2. **DATABASE_URL** - MySQL connection string
3. **MYSQL_URL** - Alternative MySQL connection string

## Database Connection

### Frontend
The frontend connects to your PHP API endpoints:
```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

### Backend
PHP files connect using the Database class:
```php
require_once '../config/database.php';
$database = new Database();
$db = $database->getConnection();
```

## Testing the Connection

1. **Frontend**: Check API calls to `VITE_API_BASE_URL`
2. **Backend**: Access any API endpoint to verify database connectivity
3. **Database**: Use MySQL client to connect directly:
   ```bash
   mysql -h roundhouse.proxy.rlwy.net -P 41855 -u root -p railway
   ```

## Important Notes

- The MySQL connection uses Railway's proxy system
- All credentials are stored in environment variables
- The `.env` file should not be committed to version control
- Railway automatically injects system variables like `RAILWAY_PROJECT_NAME`
- Frontend communicates with backend via REST API only
