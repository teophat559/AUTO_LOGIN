#!/bin/bash

# System Monitoring Script for Auto Login System
# This script monitors the health of all services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
LOG_FILE="./logs/monitor.log"
ALERT_EMAIL="admin@yourdomain.com"
DISCORD_WEBHOOK=""
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHAT_ID=""

# Service endpoints
BACKEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"
DATABASE_HOST="localhost"
DATABASE_PORT="5432"
REDIS_HOST="localhost"
REDIS_PORT="6379"

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

# Function to log messages
log_message() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# Function to check if service is running
check_service() {
    local service_name=$1
    local url=$2
    local timeout=${3:-10}

    if curl -f -s --max-time "$timeout" "$url" > /dev/null 2>&1; then
        print_success "$service_name is running"
        log_message "INFO" "$service_name is healthy"
        return 0
    else
        print_error "$service_name is down"
        log_message "ERROR" "$service_name is down"
        return 1
    fi
}

# Function to check database connection
check_database() {
    print_status "Checking database connection..."

    if command -v psql >/dev/null 2>&1; then
        if PGPASSWORD="$DB_PASSWORD" psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
            print_success "Database connection is healthy"
            log_message "INFO" "Database connection is healthy"
            return 0
        else
            print_error "Database connection failed"
            log_message "ERROR" "Database connection failed"
            return 1
        fi
    else
        print_warning "psql not available, skipping database check"
        return 0
    fi
}

# Function to check Redis connection
check_redis() {
    print_status "Checking Redis connection..."

    if command -v redis-cli >/dev/null 2>&1; then
        if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping > /dev/null 2>&1; then
            print_success "Redis connection is healthy"
            log_message "INFO" "Redis connection is healthy"
            return 0
        else
            print_error "Redis connection failed"
            log_message "ERROR" "Redis connection failed"
            return 1
        fi
    else
        print_warning "redis-cli not available, skipping Redis check"
        return 0
    fi
}

# Function to check disk space
check_disk_space() {
    print_status "Checking disk space..."

    local threshold=90
    local usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')

    if [ "$usage" -lt "$threshold" ]; then
        print_success "Disk space is sufficient ($usage%)"
        log_message "INFO" "Disk space: $usage%"
    else
        print_warning "Disk space is running low ($usage%)"
        log_message "WARNING" "Disk space: $usage%"
    fi
}

# Function to check memory usage
check_memory() {
    print_status "Checking memory usage..."

    local threshold=90
    local usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')

    if [ "$usage" -lt "$threshold" ]; then
        print_success "Memory usage is normal ($usage%)"
        log_message "INFO" "Memory usage: $usage%"
    else
        print_warning "Memory usage is high ($usage%)"
        log_message "WARNING" "Memory usage: $usage%"
    fi
}

# Function to check Docker containers
check_docker_containers() {
    print_status "Checking Docker containers..."

    local containers=("auto-login-postgres" "auto-login-redis" "auto-login-backend" "auto-login-frontend" "auto-login-nginx")
    local failed_containers=()

    for container in "${containers[@]}"; do
        if docker ps --format "table {{.Names}}" | grep -q "$container"; then
            local status=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null)
            if [ "$status" = "running" ]; then
                print_success "Container $container is running"
                log_message "INFO" "Container $container is running"
            else
                print_error "Container $container is not running (status: $status)"
                log_message "ERROR" "Container $container is not running (status: $status)"
                failed_containers+=("$container")
            fi
        else
            print_error "Container $container is not found"
            log_message "ERROR" "Container $container is not found"
            failed_containers+=("$container")
        fi
    done

    if [ ${#failed_containers[@]} -eq 0 ]; then
        return 0
    else
        return 1
    fi
}

# Function to check SSL certificate
check_ssl_certificate() {
    print_status "Checking SSL certificate..."

    if [ -f "./ssl/cert.pem" ]; then
        local expiry=$(openssl x509 -enddate -noout -in "./ssl/cert.pem" | cut -d= -f2)
        local expiry_date=$(date -d "$expiry" +%s)
        local current_date=$(date +%s)
        local days_remaining=$(( (expiry_date - current_date) / 86400 ))

        if [ "$days_remaining" -gt 30 ]; then
            print_success "SSL certificate is valid for $days_remaining days"
            log_message "INFO" "SSL certificate valid for $days_remaining days"
        elif [ "$days_remaining" -gt 7 ]; then
            print_warning "SSL certificate expires in $days_remaining days"
            log_message "WARNING" "SSL certificate expires in $days_remaining days"
        else
            print_error "SSL certificate expires in $days_remaining days"
            log_message "ERROR" "SSL certificate expires in $days_remaining days"
        fi
    else
        print_warning "SSL certificate not found"
        log_message "WARNING" "SSL certificate not found"
    fi
}

# Function to send Discord notification
send_discord_notification() {
    local message=$1

    if [ -n "$DISCORD_WEBHOOK" ]; then
        curl -H "Content-Type: application/json" \
             -X POST \
             -d "{\"content\":\"$message\"}" \
             "$DISCORD_WEBHOOK" > /dev/null 2>&1
    fi
}

# Function to send Telegram notification
send_telegram_notification() {
    local message=$1

    if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
        curl -s -X POST \
             -H "Content-Type: application/json" \
             -d "{\"chat_id\":\"$TELEGRAM_CHAT_ID\",\"text\":\"$message\",\"parse_mode\":\"HTML\"}" \
             "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" > /dev/null 2>&1
    fi
}

# Function to send email notification
send_email_notification() {
    local subject=$1
    local message=$2

    if command -v mail >/dev/null 2>&1; then
        echo "$message" | mail -s "$subject" "$ALERT_EMAIL"
    fi
}

# Function to send alerts
send_alert() {
    local service=$1
    local status=$2
    local message="🚨 Auto Login System Alert: $service is $status"

    send_discord_notification "$message"
    send_telegram_notification "$message"
    send_email_notification "Auto Login System Alert" "$message"
}

# Function to generate health report
generate_health_report() {
    local report_file="./logs/health_report_$(date +%Y%m%d_%H%M%S).txt"

    cat > "$report_file" << EOF
Auto Login System Health Report
Generated: $(date)

=== System Status ===
$(docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}")

=== Disk Usage ===
$(df -h)

=== Memory Usage ===
$(free -h)

=== Recent Logs ===
$(tail -n 50 ./logs/app.log 2>/dev/null || echo "No logs found")

=== SSL Certificate ===
$(openssl x509 -in ./ssl/cert.pem -text -noout 2>/dev/null | grep -E "(Subject:|Issuer:|Not After:)" || echo "SSL certificate not found")
EOF

    print_success "Health report generated: $report_file"
}

# Main monitoring function
main() {
    print_status "Starting system monitoring..."

    # Create logs directory if it doesn't exist
    mkdir -p ./logs

    # Initialize log file
    log_message "INFO" "Monitoring started"

    local failed_checks=0

    # Check services
    print_status "Checking services..."

    if ! check_service "Backend API" "$BACKEND_URL/api/health"; then
        failed_checks=$((failed_checks + 1))
        send_alert "Backend API" "down"
    fi

    if ! check_service "Frontend" "$FRONTEND_URL"; then
        failed_checks=$((failed_checks + 1))
        send_alert "Frontend" "down"
    fi

    # Check infrastructure
    print_status "Checking infrastructure..."

    if ! check_database; then
        failed_checks=$((failed_checks + 1))
        send_alert "Database" "unavailable"
    fi

    if ! check_redis; then
        failed_checks=$((failed_checks + 1))
        send_alert "Redis" "unavailable"
    fi

    if ! check_docker_containers; then
        failed_checks=$((failed_checks + 1))
        send_alert "Docker containers" "unhealthy"
    fi

    # Check system resources
    print_status "Checking system resources..."
    check_disk_space
    check_memory

    # Check SSL certificate
    check_ssl_certificate

    # Generate health report
    generate_health_report

    # Summary
    if [ "$failed_checks" -eq 0 ]; then
        print_success "All systems are healthy!"
        log_message "INFO" "All systems are healthy"
    else
        print_error "$failed_checks service(s) are unhealthy"
        log_message "ERROR" "$failed_checks service(s) are unhealthy"
    fi

    log_message "INFO" "Monitoring completed"
}

# Check if running in continuous mode
if [ "$1" = "--continuous" ]; then
    print_status "Running in continuous monitoring mode..."
    while true; do
        main
        sleep 300  # Check every 5 minutes
    done
else
    main
fi