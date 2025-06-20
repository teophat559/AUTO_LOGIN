#!/bin/bash

# Facebook Auto Login System Deployment Script
# This script handles the complete deployment of the auto login system

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="auto-login-system"
DOCKER_COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."

    local missing_deps=()

    if ! command_exists docker; then
        missing_deps+=("docker")
    fi

    if ! command_exists docker-compose; then
        missing_deps+=("docker-compose")
    fi

    if ! command_exists git; then
        missing_deps+=("git")
    fi

    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing required dependencies: ${missing_deps[*]}"
        print_status "Please install the missing dependencies and try again."
        exit 1
    fi

    print_success "All prerequisites are satisfied"
}

# Function to create environment file
create_env_file() {
    print_status "Creating environment configuration..."

    if [ ! -f "$ENV_FILE" ]; then
        cat > "$ENV_FILE" << EOF
# Auto Login System Environment Configuration

# Server Configuration
NODE_ENV=production
PORT=3001

# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=auto_login_db
DB_USER=auto_login_user
DB_PASSWORD=auto_login_password

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h

# Chrome Configuration
CHROME_PATH=/usr/bin/chromium-browser
CHROME_USER_DATA_DIR=/tmp/chrome-profiles

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

# Frontend Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001
REACT_APP_VERSION=1.0.0
EOF
        print_success "Environment file created: $ENV_FILE"
        print_warning "Please review and update the environment variables in $ENV_FILE"
    else
        print_status "Environment file already exists: $ENV_FILE"
    fi
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."

    mkdir -p logs
    mkdir -p backups
    mkdir -p ssl
    mkdir -p monitoring/grafana/dashboards
    mkdir -p monitoring/grafana/datasources

    print_success "Directories created successfully"
}

# Function to create nginx configuration
create_nginx_config() {
    print_status "Creating Nginx configuration..."

    cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status \$body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=login:10m rate=5r/s;

    # Upstream backend
    upstream backend {
        server backend:3001;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name _;
        return 301 https://\$host\$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name _;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Frontend
        location / {
            root /usr/share/nginx/html;
            try_files \$uri \$uri/ /index.html;

            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # API endpoints
        location /api/ {
            limit_req zone=api burst=20 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }

        # WebSocket support
        location /socket.io/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

    print_success "Nginx configuration created"
}

# Function to create SSL certificates (self-signed for development)
create_ssl_certificates() {
    print_status "Creating SSL certificates..."

    if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/key.pem \
            -out ssl/cert.pem \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

        print_success "SSL certificates created"
        print_warning "Using self-signed certificates for development. Use proper certificates for production."
    else
        print_status "SSL certificates already exist"
    fi
}

# Function to build and start services
deploy_services() {
    print_status "Building and starting services..."

    # Pull latest images
    docker-compose pull

    # Build images
    docker-compose build --no-cache

    # Start services
    docker-compose up -d

    print_success "Services deployed successfully"
}

# Function to wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."

    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps | grep -q "Up"; then
            print_success "All services are running"
            return 0
        fi

        print_status "Waiting for services... (attempt $attempt/$max_attempts)"
        sleep 10
        ((attempt++))
    done

    print_error "Services failed to start within expected time"
    return 1
}

# Function to check service health
check_service_health() {
    print_status "Checking service health..."

    # Check if all containers are running
    if docker-compose ps | grep -q "Exit"; then
        print_error "Some services have exited"
        docker-compose logs
        return 1
    fi

    # Check API health
    if curl -f http://localhost:3001/api/health >/dev/null 2>&1; then
        print_success "Backend API is healthy"
    else
        print_warning "Backend API health check failed"
    fi

    # Check frontend
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        print_success "Frontend is accessible"
    else
        print_warning "Frontend health check failed"
    fi

    print_success "Health checks completed"
}

# Function to show deployment information
show_deployment_info() {
    print_success "Deployment completed successfully!"
    echo
    echo "=== Deployment Information ==="
    echo "Frontend URL: http://localhost:3000"
    echo "Backend API: http://localhost:3001"
    echo "Database: localhost:5432"
    echo "Redis: localhost:6379"
    echo
    echo "=== Useful Commands ==="
    echo "View logs: docker-compose logs -f"
    echo "Stop services: docker-compose down"
    echo "Restart services: docker-compose restart"
    echo "Update services: ./deploy.sh update"
    echo
    echo "=== Monitoring ==="
    echo "With monitoring: docker-compose --profile monitoring up -d"
    echo "Grafana: http://localhost:3002 (admin/admin123)"
    echo "Prometheus: http://localhost:9090"
    echo
    echo "=== Backup ==="
    echo "With backup: docker-compose --profile backup up -d"
    echo "Backup location: ./backups/"
}

# Function to update services
update_services() {
    print_status "Updating services..."

    # Pull latest changes
    git pull origin main

    # Rebuild and restart services
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d

    print_success "Services updated successfully"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up..."

    docker-compose down -v
    docker system prune -f

    print_success "Cleanup completed"
}

# Function to show help
show_help() {
    echo "Facebook Auto Login System Deployment Script"
    echo
    echo "Usage: $0 [COMMAND]"
    echo
    echo "Commands:"
    echo "  deploy    Deploy the complete system (default)"
    echo "  update    Update existing deployment"
    echo "  cleanup   Clean up all containers and volumes"
    echo "  health    Check service health"
    echo "  help      Show this help message"
    echo
    echo "Examples:"
    echo "  $0 deploy"
    echo "  $0 update"
    echo "  $0 cleanup"
}

# Main script logic
main() {
    local command=${1:-deploy}

    case $command in
        "deploy")
            check_prerequisites
            create_env_file
            create_directories
            create_nginx_config
            create_ssl_certificates
            deploy_services
            wait_for_services
            check_service_health
            show_deployment_info
            ;;
        "update")
            update_services
            wait_for_services
            check_service_health
            ;;
        "cleanup")
            cleanup
            ;;
        "health")
            check_service_health
            ;;
        "help")
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"