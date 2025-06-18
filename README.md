# Facebook Auto Login System

A comprehensive automated Facebook login system with a modern Macbook-style dashboard UI, built with React, TypeScript, Node.js, and PostgreSQL.

## 🚀 Features

### Core Functionality
- **Automated Facebook Login**: Automated login process using Puppeteer
- **Multi-Profile Support**: Support for multiple Chrome profiles
- **Proxy Management**: Built-in proxy rotation and management
- **Captcha Handling**: Automatic and manual captcha solving options
- **2FA Support**: OTP handling for two-factor authentication
- **Session Management**: Real-time session tracking and management

### Dashboard Features
- **Real-time Monitoring**: Live status updates and progress tracking
- **Comprehensive Statistics**: Detailed analytics and success rates
- **History Management**: Complete login history with filtering and search
- **Bulk Operations**: Bulk delete, export, and management features
- **Notification System**: Real-time notifications and alerts
- **System Health Monitoring**: CPU, memory, and disk usage tracking

### Advanced Features
- **Error Recovery**: Automatic retry mechanisms
- **Rate Limiting**: Built-in rate limiting and protection
- **Security**: JWT authentication, password hashing, and input validation
- **Logging**: Comprehensive logging with Winston
- **Caching**: Redis-based caching for performance
- **Queue Management**: Bull queue for background processing

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
dashboard/src/
├── components/          # React components
│   ├── Dashboard/      # Main dashboard components
│   ├── AutoLogin/      # Auto login specific components
│   └── common/         # Shared components
├── contexts/           # React contexts for state management
├── services/           # API service layer
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

### Backend (Node.js + TypeScript)
```
backend-node/src/
├── controllers/        # API controllers
├── services/           # Business logic services
├── utils/              # Utility functions and middleware
├── types/              # TypeScript type definitions
└── database/           # Database schema and migrations
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI** for UI components
- **Styled Components** for styling
- **Axios** for API communication
- **React Context** for state management

### Backend
- **Node.js** with TypeScript
- **Express.js** for API framework
- **PostgreSQL** for database
- **Puppeteer** for browser automation
- **Redis** for caching and sessions
- **Bull** for job queues
- **Winston** for logging
- **JWT** for authentication

### DevOps
- **Docker** for containerization
- **Nginx** for reverse proxy
- **PM2** for process management

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Chrome/Chromium browser
- Docker (optional)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd macbook
```

### 2. Backend Setup

```bash
cd backend-node

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
# Edit .env file with your database and other settings

# Setup database
# Create PostgreSQL database and run schema
psql -U your_user -d your_database -f database/schema.sql

# Start the backend server
npm run dev
```

### 3. Frontend Setup

```bash
cd dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure API URL
# Edit .env file: REACT_APP_API_URL=http://localhost:3001

# Start the development server
npm start
```

### 4. Environment Configuration

#### Backend (.env)
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auto_login_db
DB_USER=your_user
DB_PASSWORD=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Chrome Configuration
CHROME_PATH=/usr/bin/google-chrome
CHROME_USER_DATA_DIR=/path/to/chrome/profiles

# Proxy Configuration
DEFAULT_PROXY=
PROXY_ROTATION_ENABLED=true

# Captcha Service
CAPTCHA_SERVICE_API_KEY=your_captcha_service_key

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001
REACT_APP_VERSION=1.0.0
```

## 🎯 Usage

### 1. Starting Auto Login

1. Open the dashboard in your browser
2. Click "Auto Login" button
3. Fill in the login form:
   - Email/Username
   - Password
   - OTP (if required)
   - Chrome Profile (optional)
   - Proxy (optional)
4. Click "Start Auto Login"

### 2. Monitoring Progress

- Real-time status updates in the dashboard
- Live notifications for login events
- Detailed progress tracking
- Error handling and recovery

### 3. Managing History

- View complete login history
- Filter by status, date, or email
- Export data in CSV or JSON format
- Bulk delete operations

### 4. System Management

- Monitor system health
- Manage Chrome profiles
- Configure proxy settings
- View system statistics

## 🔧 Configuration

### Chrome Profiles
Configure Chrome profiles in the database:
```sql
INSERT INTO chrome_profiles (profile_name, profile_path, user_data_dir)
VALUES ('Profile 1', 'chrome1', '/path/to/chrome1');
```

### Proxy Configuration
Add proxies to the system:
```sql
INSERT INTO proxy_list (proxy_string, proxy_type, country, city)
VALUES ('127.0.0.1:8080', 'http', 'Local', 'Local');
```

### System Settings
Modify system settings:
```sql
UPDATE system_settings
SET setting_value = 'true'
WHERE setting_key = 'auto_solve_captcha';
```

## 📊 API Endpoints

### Auto Login
- `POST /api/auto-login/start` - Start auto login process
- `GET /api/auto-login/status/:sessionId` - Check login status
- `POST /api/auto-login/save` - Save login result
- `GET /api/auto-login/history` - Get login history
- `GET /api/auto-login/statistics` - Get statistics
- `DELETE /api/auto-login/record/:id` - Delete record
- `DELETE /api/auto-login/history` - Clear history
- `GET /api/auto-login/export` - Export history

### Chrome Management
- `GET /api/chrome/profiles` - Get Chrome profiles
- `POST /api/chrome/launch` - Launch Chrome
- `POST /api/chrome/close/:sessionId` - Close Chrome

### System
- `GET /api/system/status` - Get system status
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings
- `GET /api/health` - Health check

## 🔒 Security Features

- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **Authentication**: JWT-based authentication
- **Password Hashing**: Secure password storage
- **CORS Protection**: Cross-origin request protection
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization

## 📈 Performance Optimization

- **Database Indexing**: Optimized database queries
- **Redis Caching**: Session and data caching
- **Connection Pooling**: Database connection management
- **Background Processing**: Queue-based job processing
- **Compression**: Response compression
- **CDN Ready**: Static asset optimization

## 🐛 Troubleshooting

### Common Issues

1. **Chrome not launching**
   - Check Chrome installation path
   - Verify Chrome executable permissions
   - Ensure Chrome is not already running

2. **Database connection errors**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

3. **Proxy connection issues**
   - Test proxy manually
   - Check proxy format (ip:port or user:pass@ip:port)
   - Verify proxy is active

4. **Captcha solving fails**
   - Check captcha service API key
   - Verify service credits
   - Test with manual solving

### Logs
Check logs for detailed error information:
```bash
# Backend logs
tail -f logs/app.log

# System logs
journalctl -u auto-login-service -f
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting section

## 🔄 Updates

Stay updated with the latest features and bug fixes:
```bash
git pull origin main
npm install
npm run build
```

## 📝 Changelog

### Version 1.0.0
- Initial release
- Basic auto login functionality
- Dashboard UI
- Database integration
- Real-time monitoring

---

**Note**: This system is for educational and legitimate automation purposes only. Please ensure compliance with Facebook's Terms of Service and applicable laws.