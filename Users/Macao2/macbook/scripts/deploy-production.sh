#!/bin/bash

# Production Deployment Script for Auto Login System
# This script handles safe production deployments with rollback capability

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_NAME="auto-login-system"
DEPLOYMENT_DIR="./deployments"
BACKUP_DIR="./backups"
LOG_FILE="./logs/deployment.log"
ROLLBACK_FILE="$DEPLOYMENT_DIR/rollback_info.json"

# Environment variables
NODE_ENV=${NODE_ENV:-"production"}
DEPLOYMENT_TYPE=${DEPLOYMENT_TYPE:-"full"}  # full, backend, frontend
SKIP_BACKUP=${SKIP_BACKUP:-"false"}
FORCE_DEPLOY=${FORCE_DEPLOY:-"false"}

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

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking deployment prerequisites..."

    local missing_deps=()

    if ! command -v docker >/dev/null 2>&1; then
        missing_deps+=("docker")
    fi

    if ! command -v docker-compose >/dev/null 2>&1; then
        missing_deps+=("docker-compose")
    fi

    if ! command -v git >/dev/null 2>&1; then
        missing_deps+=("git")
    fi

    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing required dependencies: ${missing_deps[*]}"
        exit 1
    fi

    # Check if running as root (not recommended)
    if [ "$EUID" -eq 0 ]; then
        print_warning "Running as root is not recommended for security reasons"
    fi

    print_success "Prerequisites check passed"
}

# Function to create deployment directories
create_directories() {
    print_status "Creating deployment directories..."

    mkdir -p "$DEPLOYMENT_DIR"
    mkdir -p "$BACKUP_DIR"
    mkdir -p "./logs"
    mkdir -p "./ssl"

    print_success "Directories created"
}

# Function to backup current system
backup_current_system() {
    if [ "$SKIP_BACKUP" = "true" ]; then
        print_warning "Skipping backup as requested"
        return 0
    fi

    print_status "Creating backup of current system..."

    # Create backup using backup script
    if [ -f "./scripts/backup.sh" ]; then
        chmod +x "./scripts/backup.sh"
        ./scripts/backup.sh backup
        print_success "System backup completed"
    else
        print_warning "Backup script not found, skipping backup"
    fi
}

# Function to check current system health
check_system_health() {
    print_status "Checking current system health..."

    local failed_checks=0

    # Check if services are running
    if ! docker-compose ps | grep -q "Up"; then
        print_warning "Some services are not running"
        failed_checks=$((failed_checks + 1))
    fi

    # Check disk space
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 90 ]; then
        print_error "Disk space is critically low ($disk_usage%)"
        failed_checks=$((failed_checks + 1))
    fi

    # Check memory
    local mem_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ "$mem_usage" -gt 90 ]; then
        print_warning "Memory usage is high ($mem_usage%)"
    fi

    if [ "$failed_checks" -gt 0 ] && [ "$FORCE_DEPLOY" != "true" ]; then
        print_error "System health check failed. Use --force to deploy anyway."
        exit 1
    fi

    print_success "System health check passed"
}

# Function to pull latest code
pull_latest_code() {
    print_status "Pulling latest code from repository..."

    if [ -d ".git" ]; then
        # Stash any local changes
        git stash push -m "Auto-stash before deployment $(date)" || true

        # Pull latest changes
        git pull origin main || git pull origin master

        print_success "Latest code pulled successfully"
    else
        print_warning "Not a git repository, skipping code pull"
    fi
}

# Function to build Docker images
build_images() {
    print_status "Building Docker images..."

    case "$DEPLOYMENT_TYPE" in
        "full")
            docker-compose build --no-cache
            ;;
        "backend")
            docker-compose build --no-cache backend
            ;;
        "frontend")
            docker-compose build --no-cache frontend
            ;;
        *)
            print_error "Invalid deployment type: $DEPLOYMENT_TYPE"
            exit 1
            ;;
    esac

    print_success "Docker images built successfully"
}

# Function to stop services
stop_services() {
    print_status "Stopping services..."

    docker-compose down --remove-orphans

    print_success "Services stopped"
}

# Function to start services
start_services() {
    print_status "Starting services..."

    # Start services with health checks
    docker-compose up -d

    # Wait for services to be healthy
    print_status "Waiting for services to be healthy..."
    sleep 30

    # Check service health
    local max_attempts=10
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps | grep -q "healthy"; then
            print_success "All services are healthy"
            break
        else
            print_status "Waiting for services to be healthy... (attempt $attempt/$max_attempts)"
            sleep 30
            attempt=$((attempt + 1))
        fi
    done

    if [ $attempt -gt $max_attempts ]; then
        print_error "Services failed to become healthy"
        return 1
    fi
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."

    # Check if migration script exists
    if [ -f "./backend-node/src/scripts/init-db.ts" ]; then
        docker-compose exec backend npm run migrate || {
            print_warning "Database migration failed, but continuing deployment"
        }
    else
        print_warning "No migration script found, skipping migrations"
    fi
}

# Function to verify deployment
verify_deployment() {
    print_status "Verifying deployment..."

    local failed_checks=0

    # Check if all containers are running
    if ! docker-compose ps | grep -q "Up"; then
        print_error "Some containers are not running"
        failed_checks=$((failed_checks + 1))
    fi

    # Check backend health
    if ! curl -f -s http://localhost:3001/api/health > /dev/null; then
        print_error "Backend health check failed"
        failed_checks=$((failed_checks + 1))
    fi

    # Check frontend
    if ! curl -f -s http://localhost:3000 > /dev/null; then
        print_error "Frontend health check failed"
        failed_checks=$((failed_checks + 1))
    fi

    # Check database connection
    if ! docker-compose exec backend npm run test:db > /dev/null 2>&1; then
        print_warning "Database connection test failed"
    fi

    if [ $failed_checks -gt 0 ]; then
        print_error "Deployment verification failed"
        return 1
    fi

    print_success "Deployment verification passed"
}

# Function to save deployment info
save_deployment_info() {
    local deployment_id=$(date +%Y%m%d_%H%M%S)
    local git_commit=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
    local git_branch=$(git branch --show-current 2>/dev/null || echo "unknown")

    cat > "$ROLLBACK_FILE" << EOF
{
    "deployment_id": "$deployment_id",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "git_commit": "$git_commit",
    "git_branch": "$git_branch",
    "deployment_type": "$DEPLOYMENT_TYPE",
    "backup_location": "$BACKUP_DIR",
    "docker_images": {
        "backend": "$(docker images --format "{{.Repository}}:{{.Tag}}" | grep backend | head -1)",
        "frontend": "$(docker images --format "{{.Repository}}:{{.Tag}}" | grep frontend | head -1)"
    }
}
EOF

    print_success "Deployment info saved: $ROLLBACK_FILE"
}

# Function to rollback deployment
rollback_deployment() {
    print_status "Rolling back deployment..."

    if [ ! -f "$ROLLBACK_FILE" ]; then
        print_error "No rollback information found"
        return 1
    fi

    # Stop current services
    docker-compose down

    # Restore from backup
    if [ -f "./scripts/backup.sh" ]; then
        local latest_backup=$(find "$BACKUP_DIR" -name "full_backup_*" -type d | sort | tail -1)
        if [ -n "$latest_backup" ]; then
            print_status "Restoring from backup: $latest_backup"
            ./scripts/backup.sh restore-db "$latest_backup/db_backup_*.sql.gz"
            ./scripts/backup.sh restore-files "$latest_backup/files_backup_*.tar.gz"
        fi
    fi

    # Restart services
    docker-compose up -d

    print_success "Rollback completed"
}

# Function to cleanup old images
cleanup_old_images() {
    print_status "Cleaning up old Docker images..."

    # Remove dangling images
    docker image prune -f

    # Remove unused images (older than 7 days)
    docker image prune -a --filter "until=168h" -f

    print_success "Cleanup completed"
}

# Function to send deployment notification
send_notification() {
    local status=$1
    local message=$2

    # Discord notification
    if [ -n "$DISCORD_WEBHOOK" ]; then
        curl -H "Content-Type: application/json" \
             -X POST \
             -d "{\"content\":\"🚀 Deployment $status: $message\"}" \
             "$DISCORD_WEBHOOK" > /dev/null 2>&1
    fi

    # Telegram notification
    if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
        curl -s -X POST \
             -H "Content-Type: application/json" \
             -d "{\"chat_id\":\"$TELEGRAM_CHAT_ID\",\"text\":\"🚀 Deployment $status: $message\",\"parse_mode\":\"HTML\"}" \
             "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" > /dev/null 2>&1
    fi
}

# Main deployment function
main() {
    local start_time=$(date +%s)

    print_status "Starting production deployment..."
    log_message "INFO" "Deployment started"

    # Check prerequisites
    check_prerequisites

    # Create directories
    create_directories

    # Check system health
    check_system_health

    # Backup current system
    backup_current_system

    # Pull latest code
    pull_latest_code

    # Build images
    build_images

    # Stop services
    stop_services

    # Start services
    if ! start_services; then
        print_error "Failed to start services"
        send_notification "FAILED" "Services failed to start"
        exit 1
    fi

    # Run migrations
    run_migrations

    # Verify deployment
    if ! verify_deployment; then
        print_error "Deployment verification failed"
        send_notification "FAILED" "Deployment verification failed"
        exit 1
    fi

    # Save deployment info
    save_deployment_info

    # Cleanup
    cleanup_old_images

    # Calculate deployment time
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    print_success "Deployment completed successfully in ${duration}s"
    log_message "INFO" "Deployment completed successfully in ${duration}s"

    send_notification "SUCCESS" "Completed in ${duration}s"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --type)
            DEPLOYMENT_TYPE="$2"
            shift 2
            ;;
        --skip-backup)
            SKIP_BACKUP="true"
            shift
            ;;
        --force)
            FORCE_DEPLOY="true"
            shift
            ;;
        --rollback)
            rollback_deployment
            exit 0
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --type TYPE        Deployment type: full, backend, frontend (default: full)"
            echo "  --skip-backup      Skip creating backup before deployment"
            echo "  --force            Force deployment even if health checks fail"
            echo "  --rollback         Rollback to previous deployment"
            echo "  --help             Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                    # Full deployment"
            echo "  $0 --type backend     # Backend only deployment"
            echo "  $0 --skip-backup      # Deploy without backup"
            echo "  $0 --rollback         # Rollback to previous version"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run main deployment
main