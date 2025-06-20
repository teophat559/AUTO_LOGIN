# 🚀 Hệ thống Auto Login - Hướng dẫn sử dụng

Hệ thống tự động đăng nhập Facebook với giao diện quản trị hiện đại và tính năng bảo mật cao.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Tính năng](#tính-năng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt nhanh](#cài-đặt-nhanh)
- [Hướng dẫn chi tiết](#hướng-dẫn-chi-tiết)
- [Quản lý hệ thống](#quản-lý-hệ-thống)
- [Troubleshooting](#troubleshooting)
- [Đóng góp](#đóng-góp)

## 🎯 Tổng quan

Hệ thống Auto Login là một giải pháp toàn diện cho việc quản lý và tự động hóa quá trình đăng nhập Facebook. Hệ thống bao gồm:

- **Backend API**: Node.js/TypeScript với các dịch vụ tự động hóa
- **Frontend Dashboard**: React với giao diện quản trị hiện đại
- **Database**: PostgreSQL với cấu trúc tối ưu
- **Cache**: Redis cho hiệu suất cao
- **Monitoring**: Prometheus & Grafana
- **Security**: SSL/TLS, JWT, Rate limiting

## ✨ Tính năng

### 🔐 Bảo mật
- Xác thực JWT với refresh token
- Rate limiting và DDoS protection
- SSL/TLS encryption
- CORS configuration
- Helmet security headers
- Session management

### 🤖 Tự động hóa
- Auto login Facebook
- Captcha solving
- Proxy rotation
- Form filling
- Notification system
- Error handling

### 📊 Monitoring & Analytics
- Real-time system monitoring
- Health checks
- Performance metrics
- Alert notifications (Discord, Telegram, Email)
- Log management
- Backup automation

### 🎛️ Quản lý
- User management
- Role-based access control
- Activity logs
- Statistics dashboard
- Configuration management
- System maintenance

## 🖥️ Yêu cầu hệ thống

### Tối thiểu
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

### Khuyến nghị
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **OS**: Ubuntu 22.04 LTS

### Software
```bash
Docker >= 20.10
Docker Compose >= 2.0
Git >= 2.30
```

## ⚡ Cài đặt nhanh

### 1. Clone repository
```bash
git clone https://github.com/your-username/auto-login-system.git
cd auto-login-system
```

### 2. Khởi tạo hệ thống
```bash
chmod +x scripts/*.sh
./scripts/init-system.sh
```

### 3. Cấu hình môi trường
```bash
cp env.production .env
nano .env  # Chỉnh sửa các biến quan trọng
```

### 4. Cấu hình SSL
```bash
./scripts/setup-ssl.sh yourdomain.com admin@yourdomain.com
```

### 5. Deploy hệ thống
```bash
./scripts/deploy-production.sh
```

### 6. Truy cập hệ thống
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Grafana**: http://localhost:3002 (admin/admin123)

## 📖 Hướng dẫn chi tiết

### Cấu trúc dự án
```
auto-login-system/
├── backend-node/          # Backend API (Node.js/TypeScript)
├── dashboard/             # Frontend Dashboard (React)
├── admin/                 # Admin interface
├── user/                  # User interface
├── scripts/               # Deployment & management scripts
├── docker-compose.yml     # Docker configuration
├── env.production         # Production environment
└── DEPLOYMENT.md          # Deployment guide
```

### Các biến môi trường quan trọng

#### Database
```bash
DB_HOST=postgres
DB_PORT=5432
DB_NAME=auto_login_db
DB_USER=auto_login_user
DB_PASSWORD=your_strong_password
```

#### JWT Security
```bash
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

#### Domain Configuration
```bash
CORS_ORIGIN=https://yourdomain.com
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_WS_URL=wss://api.yourdomain.com
```

### Quản lý hệ thống

#### Sử dụng script quản lý
```bash
./scripts/manage.sh
```

Menu chính bao gồm:
- 🚀 Khởi động hệ thống
- ⏹️ Dừng hệ thống
- 🔄 Khởi động lại hệ thống
- 📋 Xem logs
- 💾 Quản lý Backup
- 📊 Quản lý Monitoring
- 🔒 Quản lý SSL
- ⚙️ Cài đặt hệ thống
- ℹ️ Thông tin hệ thống

#### Lệnh hữu ích
```bash
# Kiểm tra trạng thái
docker-compose ps

# Xem logs
docker-compose logs -f backend

# Backup hệ thống
./scripts/backup.sh backup

# Monitoring
./scripts/monitor.sh

# Deploy
./scripts/deploy-production.sh
```

## 🔧 Quản lý hệ thống

### Backup & Restore

#### Tạo backup
```bash
# Backup toàn bộ hệ thống
./scripts/backup.sh backup

# Backup chỉ database
./scripts/backup.sh backup-db

# Backup chỉ files
./scripts/backup.sh backup-files
```

#### Restore
```bash
# Restore database
./scripts/backup.sh restore-db ./backups/database/db_backup_*.sql.gz

# Restore files
./scripts/backup.sh restore-files ./backups/files/files_backup_*.tar.gz
```

### Monitoring

#### Kiểm tra sức khỏe hệ thống
```bash
./scripts/monitor.sh
```

#### Monitoring liên tục
```bash
./scripts/monitor.sh --continuous
```

#### Cấu hình alerts
```bash
# Discord
export DISCORD_WEBHOOK="https://discord.com/api/webhooks/your-webhook"

# Telegram
export TELEGRAM_BOT_TOKEN="your-bot-token"
export TELEGRAM_CHAT_ID="your-chat-id"

# Email
export ALERT_EMAIL="admin@yourdomain.com"
```

### SSL Management

#### Tạo certificate
```bash
# Let's Encrypt (production)
./scripts/setup-ssl.sh yourdomain.com admin@yourdomain.com

# Self-signed (development)
./scripts/setup-ssl.sh localhost
```

#### Kiểm tra certificate
```bash
openssl x509 -in ssl/cert.pem -text -noout
```

## 🛠️ Troubleshooting

### Services không start

#### Kiểm tra logs
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

#### Restart services
```bash
docker-compose restart
```

#### Rebuild images
```bash
docker-compose build --no-cache
```

### Database issues

#### Kiểm tra connection
```bash
docker-compose exec postgres psql -U auto_login_user -d auto_login_db -c "SELECT 1;"
```

#### Reset database
```bash
docker-compose down
docker volume rm auto-login-system_postgres_data
docker-compose up -d postgres
```

### Performance issues

#### Kiểm tra resources
```bash
docker stats
df -h
free -h
```

#### Cleanup Docker
```bash
docker system prune -a
```

### SSL issues

#### Kiểm tra certificate
```bash
openssl x509 -in ssl/cert.pem -text -noout
```

#### Renew certificate
```bash
./ssl/renew.sh
```

## 📊 Monitoring & Analytics

### Prometheus & Grafana

#### Khởi động monitoring stack
```bash
docker-compose --profile monitoring up -d
```

#### Truy cập Grafana
- **URL**: http://localhost:3002
- **Username**: admin
- **Password**: admin123

### Health Checks

#### API Health
```bash
curl http://localhost:3001/api/health
```

#### Frontend Health
```bash
curl http://localhost:3000
```

#### Database Health
```bash
docker-compose exec postgres pg_isready -U auto_login_user
```

## 🔐 Security Checklist

- [ ] Thay đổi tất cả passwords mặc định
- [ ] Cấu hình SSL/TLS
- [ ] Bật firewall (UFW/iptables)
- [ ] Cấu hình rate limiting
- [ ] Bật CORS với domain cụ thể
- [ ] Cấu hình JWT với strong secret
- [ ] Bật Helmet security headers
- [ ] Cấu hình session security
- [ ] Backup encryption
- [ ] Log monitoring
- [ ] Regular security updates

## 📈 Performance Optimization

### Database
```sql
-- Tạo indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_logs_timestamp ON logs(timestamp);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Analyze tables
ANALYZE users;
ANALYZE logs;
ANALYZE sessions;
```

### Redis
```bash
# Cấu hình memory
docker-compose exec redis redis-cli CONFIG SET maxmemory 512mb
docker-compose exec redis redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

### Nginx
```nginx
# Compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;

# Cache static files
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🤝 Đóng góp

### Báo cáo lỗi
1. Kiểm tra logs: `docker-compose logs`
2. Chạy health check: `./scripts/monitor.sh`
3. Tạo issue với thông tin:
   - OS version
   - Docker version
   - Error logs
   - Steps to reproduce

### Đóng góp code
1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📞 Hỗ trợ

### Liên hệ
- **Email**: support@yourdomain.com
- **Discord**: [Join our server](https://discord.gg/your-server)
- **Telegram**: [@your_bot](https://t.me/your_bot)

### Tài liệu
- [API Documentation](https://docs.yourdomain.com)
- [Deployment Guide](DEPLOYMENT.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)

## 📝 Changelog

### v1.0.0 (2024-01-01)
- Initial release
- Complete deployment system
- Monitoring & alerting
- Backup & restore
- SSL management
- Security hardening

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

**Lưu ý**: Đảm bảo backup dữ liệu trước khi thực hiện bất kỳ thay đổi nào trên production system.

**⚠️ Cảnh báo**: Hệ thống này chỉ được sử dụng cho mục đích giáo dục và nghiên cứu. Người dùng chịu trách nhiệm tuân thủ các quy định pháp luật và điều khoản dịch vụ của Facebook.