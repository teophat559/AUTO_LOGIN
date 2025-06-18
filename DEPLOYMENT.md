# 🚀 Auto Login System - Deployment Guide

Hướng dẫn chi tiết để deploy hệ thống Auto Login lên production.

## 📋 Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt ban đầu](#cài-đặt-ban-đầu)
- [Cấu hình SSL](#cấu-hình-ssl)
- [Deployment](#deployment)
- [Monitoring](#monitoring)
- [Backup & Restore](#backup--restore)
- [Troubleshooting](#troubleshooting)

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

### Software requirements
```bash
# Docker & Docker Compose
Docker >= 20.10
Docker Compose >= 2.0

# Git
Git >= 2.30

# SSL (Let's Encrypt)
Certbot >= 1.20

# Monitoring tools
curl, wget, htop, iotop
```

## 🔧 Cài đặt ban đầu

### 1. Clone repository
```bash
git clone https://github.com/your-username/auto-login-system.git
cd auto-login-system
```

### 2. Cài đặt dependencies
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y docker.io docker-compose git curl wget

# CentOS/RHEL
sudo yum install -y docker docker-compose git curl wget
sudo systemctl start docker
sudo systemctl enable docker
```

### 3. Cấu hình environment
```bash
# Copy file environment production
cp env.production .env

# Chỉnh sửa các biến quan trọng
nano .env
```

**Các biến quan trọng cần thay đổi:**
```bash
# Database
DB_PASSWORD=your_strong_production_password_here
DB_SSL=true

# Redis
REDIS_PASSWORD=your_redis_password_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_use_strong_random_string

# Domain
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_WS_URL=wss://api.yourdomain.com

# Email (nếu cần)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
```

### 4. Tạo thư mục cần thiết
```bash
mkdir -p logs backups ssl monitoring/grafana/{dashboards,datasources}
chmod +x scripts/*.sh
```

## 🔒 Cấu hình SSL

### Tự động với Let's Encrypt
```bash
# Cài đặt Certbot
sudo apt install certbot

# Tạo SSL certificate
./scripts/setup-ssl.sh yourdomain.com admin@yourdomain.com
```

### Thủ công với certificate có sẵn
```bash
# Copy certificate vào thư mục ssl
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/private.key

# Set permissions
chmod 644 ssl/cert.pem
chmod 600 ssl/private.key
```

## 🚀 Deployment

### Deployment đầy đủ
```bash
# Deploy toàn bộ hệ thống
./scripts/deploy-production.sh

# Deploy chỉ backend
./scripts/deploy-production.sh --type backend

# Deploy chỉ frontend
./scripts/deploy-production.sh --type frontend
```

### Deployment với tùy chọn
```bash
# Deploy không backup (không khuyến nghị)
./scripts/deploy-production.sh --skip-backup

# Deploy force (bỏ qua health check)
./scripts/deploy-production.sh --force

# Rollback về version trước
./scripts/deploy-production.sh --rollback
```

### Kiểm tra deployment
```bash
# Kiểm tra status services
docker-compose ps

# Kiểm tra logs
docker-compose logs -f

# Kiểm tra health
curl http://localhost:3001/api/health
curl http://localhost:3000
```

## 📊 Monitoring

### Monitoring tự động
```bash
# Chạy monitoring một lần
./scripts/monitor.sh

# Chạy monitoring liên tục (mỗi 5 phút)
./scripts/monitor.sh --continuous
```

### Monitoring với Prometheus & Grafana
```bash
# Khởi động monitoring stack
docker-compose --profile monitoring up -d

# Truy cập Grafana
# URL: http://yourdomain.com:3002
# Username: admin
# Password: admin123
```

### Cấu hình alerts
```bash
# Discord webhook
export DISCORD_WEBHOOK="https://discord.com/api/webhooks/your-webhook"

# Telegram bot
export TELEGRAM_BOT_TOKEN="your-bot-token"
export TELEGRAM_CHAT_ID="your-chat-id"

# Email alerts
export ALERT_EMAIL="admin@yourdomain.com"
```

## 💾 Backup & Restore

### Tạo backup
```bash
# Backup toàn bộ hệ thống
./scripts/backup.sh backup

# Backup chỉ database
./scripts/backup.sh backup-db

# Backup chỉ files
./scripts/backup.sh backup-files
```

### Restore
```bash
# Restore database
./scripts/backup.sh restore-db ./backups/database/db_backup_20231201_120000.sql.gz

# Restore files
./scripts/backup.sh restore-files ./backups/files/files_backup_20231201_120000.tar.gz
```

### Quản lý backup
```bash
# Liệt kê backups
./scripts/backup.sh list

# Xóa backups cũ
./scripts/backup.sh cleanup

# Thống kê backup
./scripts/backup.sh stats

# Verify backup
./scripts/backup.sh verify ./backups/database/db_backup_20231201_120000.sql.gz
```

## 🔧 Troubleshooting

### Services không start
```bash
# Kiểm tra logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Restart services
docker-compose restart

# Rebuild images
docker-compose build --no-cache
```

### Database connection issues
```bash
# Kiểm tra database
docker-compose exec postgres psql -U auto_login_user -d auto_login_db -c "SELECT 1;"

# Reset database
docker-compose down
docker volume rm auto-login-system_postgres_data
docker-compose up -d postgres
```

### SSL issues
```bash
# Kiểm tra certificate
openssl x509 -in ssl/cert.pem -text -noout

# Renew certificate
./ssl/renew.sh

# Test SSL
curl -I https://yourdomain.com
```

### Performance issues
```bash
# Kiểm tra resource usage
docker stats

# Kiểm tra disk space
df -h

# Kiểm tra memory
free -h

# Cleanup Docker
docker system prune -a
```

### Log analysis
```bash
# View real-time logs
tail -f logs/app.log

# Search for errors
grep -i error logs/app.log

# Monitor specific service
docker-compose logs -f backend | grep ERROR
```

## 📈 Performance Optimization

### Database optimization
```sql
-- Tạo indexes cho performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_logs_timestamp ON logs(timestamp);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Analyze tables
ANALYZE users;
ANALYZE logs;
ANALYZE sessions;
```

### Redis optimization
```bash
# Cấu hình Redis
docker-compose exec redis redis-cli CONFIG SET maxmemory 512mb
docker-compose exec redis redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

### Nginx optimization
```nginx
# Thêm vào nginx.conf
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

## 📞 Support

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra logs: `docker-compose logs`
2. Chạy health check: `./scripts/monitor.sh`
3. Tạo issue trên GitHub với thông tin:
   - OS version
   - Docker version
   - Error logs
   - Steps to reproduce

## 📝 Changelog

### v1.0.0
- Initial production deployment
- SSL configuration
- Monitoring setup
- Backup system
- Security hardening

---

**Lưu ý**: Đảm bảo backup dữ liệu trước khi thực hiện bất kỳ thay đổi nào trên production system.