# Auto Login Backend

Backend service for managing automatic Facebook login with proxy rotation and captcha handling.

## Features

- Multiple Chrome profile management
- Automatic login with form filling
- Proxy rotation and management
- Captcha detection and solving
- Real-time notifications via WebSocket
- Login history and statistics
- Database storage for results

## Prerequisites

- Node.js 14+
- PostgreSQL 12+
- Google Chrome browser
- Proxy list (optional)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=auto_login_db
   DB_USER=postgres
   DB_PASSWORD=your_password

   # Chrome Configuration
   CHROME_PROFILES_PATH=C:/Users/User/AppData/Local/Google/Chrome/User Data

   # Proxy Configuration
   PROXY_ENABLED=true
   PROXY_ROTATION_INTERVAL=300000 # 5 minutes

   # Captcha Service Configuration
   CAPTCHA_SERVICE_API_KEY=your_api_key
   CAPTCHA_SERVICE_URL=https://api.captcha-service.com

   # Security
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=24h

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   ```

4. Initialize the database:
   ```bash
   npm run db:init
   ```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```

2. For development with hot reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Chrome Management
- `POST /api/chrome/profiles` - Get list of Chrome profiles
- `POST /api/chrome/launch` - Launch Chrome with specified profile

### Auto Login
- `POST /api/auto-login/start` - Start auto login process
- `GET /api/auto-login/status/:sessionId` - Check login status
- `POST /api/auto-login/2fa/:sessionId` - Handle 2FA
- `POST /api/auto-login/checkpoint/:sessionId` - Handle checkpoint
- `POST /api/auto-login/save` - Save login result
- `GET /api/auto-login/history` - Get login history
- `GET /api/auto-login/statistics` - Get login statistics

### Proxy Management
- `POST /api/proxies` - Load proxy list
- `GET /api/proxies/stats` - Get proxy statistics

### Database Management
- `POST /api/database/init` - Initialize database
- `GET /api/database/stats` - Get database statistics

## WebSocket Events

### Connection Events
- `connection` - Client connected
- `disconnect` - Client disconnected
- `join-session` - Join a login session
- `leave-session` - Leave a login session

### Notification Events
- `notification` - General notification
- `session-notification` - Session-specific notification
- `login-status` - Login status update
- `proxy-status` - Proxy status update
- `captcha-status` - Captcha status update

## Error Handling

The application includes comprehensive error handling:
- Input validation
- Database connection errors
- Chrome launch errors
- Proxy connection errors
- Captcha service errors
- WebSocket connection errors

## Security Considerations

1. Environment Variables
   - Keep sensitive information in `.env` file
   - Never commit `.env` file to version control
   - Use strong passwords and API keys

2. Database Security
   - Use strong database passwords
   - Limit database user permissions
   - Regular database backups

3. Proxy Security
   - Validate proxy list before use
   - Monitor proxy performance
   - Remove failing proxies

4. Chrome Security
   - Use separate Chrome profiles
   - Clear cookies and cache regularly
   - Monitor for suspicious activity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.