#!/bin/bash

# Script Quản lý Hệ thống Auto Login
# Giao diện quản lý thân thiện với người dùng

set -e

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Cấu hình
PROJECT_NAME="Auto Login System"
VERSION="1.0.0"

print_header() {
    clear
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    $PROJECT_NAME                    ║"
    echo "║                        Phiên bản $VERSION                        ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_status() {
    echo -e "${BLUE}[THÔNG BÁO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[THÀNH CÔNG]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[CẢNH BÁO]${NC} $1"
}

print_error() {
    echo -e "${RED}[LỖI]${NC} $1"
}

# Kiểm tra trạng thái hệ thống
check_system_status() {
    print_status "Kiểm tra trạng thái hệ thống..."

    local services=("postgres" "redis" "backend" "frontend" "nginx")
    local running=0
    local total=${#services[@]}

    echo
    echo "┌─────────────────┬──────────┬─────────────────┐"
    echo "│     Dịch vụ     │  Trạng thái │      Port       │"
    echo "├─────────────────┼──────────┼─────────────────┤"

    for service in "${services[@]}"; do
        local status="❌ Dừng"
        local port=""

        case $service in
            "postgres")
                port="5432"
                if docker ps --format "{{.Names}}" | grep -q "auto-login-postgres"; then
                    status="✅ Chạy"
                    ((running++))
                fi
                ;;
            "redis")
                port="6379"
                if docker ps --format "{{.Names}}" | grep -q "auto-login-redis"; then
                    status="✅ Chạy"
                    ((running++))
                fi
                ;;
            "backend")
                port="3001"
                if docker ps --format "{{.Names}}" | grep -q "auto-login-backend"; then
                    status="✅ Chạy"
                    ((running++))
                fi
                ;;
            "frontend")
                port="3000"
                if docker ps --format "{{.Names}}" | grep -q "auto-login-frontend"; then
                    status="✅ Chạy"
                    ((running++))
                fi
                ;;
            "nginx")
                port="80/443"
                if docker ps --format "{{.Names}}" | grep -q "auto-login-nginx"; then
                    status="✅ Chạy"
                    ((running++))
                fi
                ;;
        esac

        printf "│ %-15s │ %-8s │ %-15s │\n" "$service" "$status" "$port"
    done

    echo "└─────────────────┴──────────┴─────────────────┘"
    echo
    print_status "Tổng số dịch vụ đang chạy: $running/$total"

    if [ $running -eq $total ]; then
        print_success "Tất cả dịch vụ đang hoạt động bình thường!"
    elif [ $running -gt 0 ]; then
        print_warning "Một số dịch vụ chưa hoạt động"
    else
        print_error "Không có dịch vụ nào đang chạy"
    fi
}

# Khởi động hệ thống
start_system() {
    print_status "Khởi động hệ thống..."

    if [ -f "docker-compose.yml" ]; then
        docker-compose up -d
        print_success "Hệ thống đã được khởi động"

        # Chờ một chút để services khởi động
        sleep 5
        check_system_status
    else
        print_error "Không tìm thấy file docker-compose.yml"
    fi
}

# Dừng hệ thống
stop_system() {
    print_status "Dừng hệ thống..."

    if [ -f "docker-compose.yml" ]; then
        docker-compose down
        print_success "Hệ thống đã được dừng"
    else
        print_error "Không tìm thấy file docker-compose.yml"
    fi
}

# Khởi động lại hệ thống
restart_system() {
    print_status "Khởi động lại hệ thống..."

    stop_system
    sleep 2
    start_system
}

# Xem logs
view_logs() {
    print_status "Chọn dịch vụ để xem logs:"
    echo
    echo "1. Backend"
    echo "2. Frontend"
    echo "3. Database"
    echo "4. Redis"
    echo "5. Nginx"
    echo "6. Tất cả"
    echo "0. Quay lại"
    echo

    read -p "Chọn tùy chọn (0-6): " choice

    case $choice in
        1)
            docker-compose logs -f backend
            ;;
        2)
            docker-compose logs -f frontend
            ;;
        3)
            docker-compose logs -f postgres
            ;;
        4)
            docker-compose logs -f redis
            ;;
        5)
            docker-compose logs -f nginx
            ;;
        6)
            docker-compose logs -f
            ;;
        0)
            return
            ;;
        *)
            print_error "Tùy chọn không hợp lệ"
            ;;
    esac
}

# Quản lý backup
manage_backup() {
    while true; do
        print_header
        print_status "Quản lý Backup"
        echo
        echo "1. Tạo backup toàn bộ hệ thống"
        echo "2. Tạo backup database"
        echo "3. Tạo backup files"
        echo "4. Liệt kê backups"
        echo "5. Restore database"
        echo "6. Restore files"
        echo "7. Xóa backups cũ"
        echo "8. Thống kê backup"
        echo "0. Quay lại"
        echo

        read -p "Chọn tùy chọn (0-8): " choice

        case $choice in
            1)
                ./scripts/backup.sh backup
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            2)
                ./scripts/backup.sh backup-db
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            3)
                ./scripts/backup.sh backup-files
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            4)
                ./scripts/backup.sh list
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            5)
                read -p "Nhập đường dẫn file backup database: " backup_file
                if [ -n "$backup_file" ]; then
                    ./scripts/backup.sh restore-db "$backup_file"
                fi
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            6)
                read -p "Nhập đường dẫn file backup files: " backup_file
                if [ -n "$backup_file" ]; then
                    ./scripts/backup.sh restore-files "$backup_file"
                fi
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            7)
                ./scripts/backup.sh cleanup
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            8)
                ./scripts/backup.sh stats
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            0)
                break
                ;;
            *)
                print_error "Tùy chọn không hợp lệ"
                read -p "Nhấn Enter để tiếp tục..."
                ;;
        esac
    done
}

# Quản lý monitoring
manage_monitoring() {
    while true; do
        print_header
        print_status "Quản lý Monitoring"
        echo
        echo "1. Kiểm tra sức khỏe hệ thống"
        echo "2. Chạy monitoring liên tục"
        echo "3. Xem báo cáo sức khỏe"
        echo "4. Cấu hình alerts"
        echo "5. Khởi động Prometheus & Grafana"
        echo "6. Dừng Prometheus & Grafana"
        echo "0. Quay lại"
        echo

        read -p "Chọn tùy chọn (0-6): " choice

        case $choice in
            1)
                ./scripts/monitor.sh
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            2)
                print_status "Chạy monitoring liên tục (Ctrl+C để dừng)..."
                ./scripts/monitor.sh --continuous
                ;;
            3)
                if [ -f "./logs/health_report_*.txt" ]; then
                    latest_report=$(ls -t ./logs/health_report_*.txt | head -1)
                    cat "$latest_report"
                else
                    print_warning "Không tìm thấy báo cáo sức khỏe"
                fi
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            4)
                print_status "Cấu hình alerts..."
                read -p "Discord Webhook URL (Enter để bỏ qua): " discord_webhook
                read -p "Telegram Bot Token (Enter để bỏ qua): " telegram_token
                read -p "Telegram Chat ID (Enter để bỏ qua): " telegram_chat_id
                read -p "Email alerts (Enter để bỏ qua): " alert_email

                # Lưu cấu hình
                cat > .env.alerts << EOF
DISCORD_WEBHOOK=$discord_webhook
TELEGRAM_BOT_TOKEN=$telegram_token
TELEGRAM_CHAT_ID=$telegram_chat_id
ALERT_EMAIL=$alert_email
EOF

                print_success "Cấu hình alerts đã được lưu"
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            5)
                docker-compose --profile monitoring up -d
                print_success "Prometheus & Grafana đã được khởi động"
                print_status "Grafana: http://localhost:3002 (admin/admin123)"
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            6)
                docker-compose --profile monitoring down
                print_success "Prometheus & Grafana đã được dừng"
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            0)
                break
                ;;
            *)
                print_error "Tùy chọn không hợp lệ"
                read -p "Nhấn Enter để tiếp tục..."
                ;;
        esac
    done
}

# Quản lý SSL
manage_ssl() {
    while true; do
        print_header
        print_status "Quản lý SSL Certificate"
        echo
        echo "1. Tạo SSL certificate với Let's Encrypt"
        echo "2. Tạo self-signed certificate"
        echo "3. Kiểm tra certificate"
        echo "4. Renew certificate"
        echo "5. Xem thông tin certificate"
        echo "0. Quay lại"
        echo

        read -p "Chọn tùy chọn (0-5): " choice

        case $choice in
            1)
                read -p "Nhập domain: " domain
                read -p "Nhập email: " email
                if [ -n "$domain" ] && [ -n "$email" ]; then
                    ./scripts/setup-ssl.sh "$domain" "$email"
                fi
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            2)
                read -p "Nhập domain: " domain
                if [ -n "$domain" ]; then
                    ./scripts/setup-ssl.sh "$domain"
                fi
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            3)
                if [ -f "./ssl/cert.pem" ]; then
                    openssl x509 -in ./ssl/cert.pem -text -noout | grep -E "(Subject:|Issuer:|Not After:)"
                else
                    print_warning "Không tìm thấy SSL certificate"
                fi
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            4)
                if [ -f "./ssl/renew.sh" ]; then
                    ./ssl/renew.sh
                else
                    print_warning "Script renew không tồn tại"
                fi
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            5)
                if [ -f "./ssl/cert.pem" ]; then
                    openssl x509 -in ./ssl/cert.pem -text -noout
                else
                    print_warning "Không tìm thấy SSL certificate"
                fi
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            0)
                break
                ;;
            *)
                print_error "Tùy chọn không hợp lệ"
                read -p "Nhấn Enter để tiếp tục..."
                ;;
        esac
    done
}

# Cài đặt hệ thống
system_settings() {
    while true; do
        print_header
        print_status "Cài đặt Hệ thống"
        echo
        echo "1. Chỉnh sửa file .env"
        echo "2. Cấu hình firewall"
        echo "3. Cài đặt dependencies"
        echo "4. Tạo thư mục cần thiết"
        echo "5. Cấu hình auto-start"
        echo "6. Kiểm tra hệ thống"
        echo "0. Quay lại"
        echo

        read -p "Chọn tùy chọn (0-6): " choice

        case $choice in
            1)
                if command -v nano >/dev/null 2>&1; then
                    nano .env
                elif command -v vim >/dev/null 2>&1; then
                    vim .env
                else
                    print_error "Không tìm thấy editor (nano/vim)"
                fi
                ;;
            2)
                ./scripts/init-system.sh
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            3)
                print_status "Cài đặt dependencies..."
                sudo apt-get update || sudo yum update
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            4)
                mkdir -p logs backups ssl uploads monitoring
                print_success "Thư mục đã được tạo"
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            5)
                print_status "Cấu hình auto-start..."
                sudo systemctl enable docker
                print_success "Docker auto-start đã được bật"
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            6)
                ./scripts/init-system.sh
                read -p "Nhấn Enter để tiếp tục..."
                ;;
            0)
                break
                ;;
            *)
                print_error "Tùy chọn không hợp lệ"
                read -p "Nhấn Enter để tiếp tục..."
                ;;
        esac
    done
}

# Hiển thị thông tin hệ thống
system_info() {
    print_header
    print_status "Thông tin Hệ thống"
    echo

    echo "📊 Thông tin Server:"
    echo "   OS: $(uname -s) $(uname -r)"
    echo "   CPU: $(nproc) cores"
    echo "   Memory: $(free -h | awk 'NR==2{printf "%.1f/%.1f GB", $3/1024, $2/1024}')"
    echo "   Disk: $(df -h / | awk 'NR==2{printf "%s/%s (%s)", $3, $2, $5}')"
    echo

    echo "🐳 Docker:"
    if command -v docker >/dev/null 2>&1; then
        echo "   Version: $(docker --version | cut -d' ' -f3 | cut -d',' -f1)"
        echo "   Containers: $(docker ps -q | wc -l) running / $(docker ps -aq | wc -l) total"
        echo "   Images: $(docker images -q | wc -l)"
    else
        echo "   ❌ Không được cài đặt"
    fi
    echo

    echo "📁 Thư mục:"
    echo "   Project: $(pwd)"
    echo "   Logs: $(du -sh logs 2>/dev/null | cut -f1 || echo 'N/A')"
    echo "   Backups: $(du -sh backups 2>/dev/null | cut -f1 || echo 'N/A')"
    echo "   SSL: $(ls -la ssl/ 2>/dev/null | wc -l) files"
    echo

    echo "🔗 Ports:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend: http://localhost:3001"
    echo "   Grafana: http://localhost:3002"
    echo

    read -p "Nhấn Enter để tiếp tục..."
}

# Menu chính
main_menu() {
    while true; do
        print_header
        check_system_status
        echo
        echo -e "${PURPLE}📋 MENU CHÍNH:${NC}"
        echo
        echo "1. 🚀 Khởi động hệ thống"
        echo "2. ⏹️  Dừng hệ thống"
        echo "3. 🔄 Khởi động lại hệ thống"
        echo "4. 📋 Xem logs"
        echo "5. 💾 Quản lý Backup"
        echo "6. 📊 Quản lý Monitoring"
        echo "7. 🔒 Quản lý SSL"
        echo "8. ⚙️  Cài đặt hệ thống"
        echo "9. ℹ️  Thông tin hệ thống"
        echo "0. 🚪 Thoát"
        echo

        read -p "Chọn tùy chọn (0-9): " choice

        case $choice in
            1)
                start_system
                ;;
            2)
                stop_system
                ;;
            3)
                restart_system
                ;;
            4)
                view_logs
                ;;
            5)
                manage_backup
                ;;
            6)
                manage_monitoring
                ;;
            7)
                manage_ssl
                ;;
            8)
                system_settings
                ;;
            9)
                system_info
                ;;
            0)
                print_status "Tạm biệt! 👋"
                exit 0
                ;;
            *)
                print_error "Tùy chọn không hợp lệ"
                read -p "Nhấn Enter để tiếp tục..."
                ;;
        esac
    done
}

# Kiểm tra dependencies
check_dependencies() {
    local missing=()

    if ! command -v docker >/dev/null 2>&1; then
        missing+=("docker")
    fi

    if ! command -v docker-compose >/dev/null 2>&1; then
        missing+=("docker-compose")
    fi

    if [ ${#missing[@]} -ne 0 ]; then
        print_error "Thiếu dependencies: ${missing[*]}"
        print_status "Chạy ./scripts/init-system.sh để cài đặt"
        exit 1
    fi
}

# Khởi động script
main() {
    # Kiểm tra dependencies
    check_dependencies

    # Chạy menu chính
    main_menu
}

# Chạy script
main