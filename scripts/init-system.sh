#!/bin/bash

# Script Khởi tạo Hệ thống Auto Login
# Script này thiết lập môi trường production ban đầu

set -e

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Kiểm tra quyền root
check_root() {
    if [ "$EUID" -eq 0 ]; then
        print_warning "Đang chạy với quyền root. Khuyến nghị chạy với user thường."
        read -p "Bạn có muốn tiếp tục? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Cài đặt Docker
install_docker() {
    print_status "Cài đặt Docker..."

    if command -v docker >/dev/null 2>&1; then
        print_success "Docker đã được cài đặt"
        return 0
    fi

    # Detect OS
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        print_error "Không thể xác định hệ điều hành"
        exit 1
    fi

    case $OS in
        "Ubuntu"|"Debian GNU/Linux")
            print_status "Cài đặt Docker trên Ubuntu/Debian..."
            sudo apt-get update
            sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
            echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io
            ;;
        "CentOS Linux"|"Red Hat Enterprise Linux")
            print_status "Cài đặt Docker trên CentOS/RHEL..."
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install -y docker-ce docker-ce-cli containerd.io
            sudo systemctl start docker
            sudo systemctl enable docker
            ;;
        *)
            print_error "Hệ điều hành không được hỗ trợ: $OS"
            exit 1
            ;;
    esac

    # Thêm user vào docker group
    sudo usermod -aG docker $USER
    print_success "Docker đã được cài đặt thành công"
    print_warning "Vui lòng đăng xuất và đăng nhập lại để áp dụng quyền docker"
}

# Cài đặt Docker Compose
install_docker_compose() {
    print_status "Cài đặt Docker Compose..."

    if command -v docker-compose >/dev/null 2>&1; then
        print_success "Docker Compose đã được cài đặt"
        return 0
    fi

    # Cài đặt Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

    print_success "Docker Compose đã được cài đặt thành công"
}

# Cài đặt các công cụ cần thiết
install_tools() {
    print_status "Cài đặt các công cụ cần thiết..."

    local tools=("curl" "wget" "git" "htop" "unzip")
    local missing_tools=()

    for tool in "${tools[@]}"; do
        if ! command -v $tool >/dev/null 2>&1; then
            missing_tools+=($tool)
        fi
    done

    if [ ${#missing_tools[@]} -ne 0 ]; then
        if command -v apt-get >/dev/null 2>&1; then
            sudo apt-get update
            sudo apt-get install -y "${missing_tools[@]}"
        elif command -v yum >/dev/null 2>&1; then
            sudo yum install -y "${missing_tools[@]}"
        fi
    fi

    print_success "Các công cụ đã được cài đặt"
}

# Tạo cấu trúc thư mục
create_directories() {
    print_status "Tạo cấu trúc thư mục..."

    local directories=(
        "logs"
        "backups"
        "backups/database"
        "backups/files"
        "ssl"
        "uploads"
        "monitoring"
        "monitoring/grafana"
        "monitoring/grafana/dashboards"
        "monitoring/grafana/datasources"
        "deployments"
        "config"
        "temp"
    )

    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
    done

    print_success "Cấu trúc thư mục đã được tạo"
}

# Cấu hình firewall
configure_firewall() {
    print_status "Cấu hình firewall..."

    if command -v ufw >/dev/null 2>&1; then
        # Ubuntu/Debian
        sudo ufw --force enable
        sudo ufw allow ssh
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        sudo ufw allow 3000/tcp
        sudo ufw allow 3001/tcp
        sudo ufw allow 3002/tcp
        print_success "UFW firewall đã được cấu hình"
    elif command -v firewall-cmd >/dev/null 2>&1; then
        # CentOS/RHEL
        sudo firewall-cmd --permanent --add-service=ssh
        sudo firewall-cmd --permanent --add-port=80/tcp
        sudo firewall-cmd --permanent --add-port=443/tcp
        sudo firewall-cmd --permanent --add-port=3000/tcp
        sudo firewall-cmd --permanent --add-port=3001/tcp
        sudo firewall-cmd --permanent --add-port=3002/tcp
        sudo firewall-cmd --reload
        print_success "Firewalld đã được cấu hình"
    else
        print_warning "Không tìm thấy firewall, bỏ qua cấu hình"
    fi
}

# Tạo file cấu hình môi trường
setup_environment() {
    print_status "Thiết lập file cấu hình môi trường..."

    if [ ! -f ".env" ]; then
        if [ -f "env.production" ]; then
            cp env.production .env
            print_success "Đã copy env.production thành .env"
        else
            print_warning "Không tìm thấy file env.production"
        fi
    else
        print_warning "File .env đã tồn tại"
    fi
}

# Tạo script khởi động tự động
setup_autostart() {
    print_status "Thiết lập khởi động tự động..."

    # Tạo systemd service
    cat > auto-login.service << EOF
[Unit]
Description=Auto Login System
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$(pwd)
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    # Copy service file
    sudo cp auto-login.service /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable auto-login.service

    # Cleanup
    rm auto-login.service

    print_success "Khởi động tự động đã được cấu hình"
}

# Tạo cron jobs
setup_cron_jobs() {
    print_status "Thiết lập cron jobs..."

    # Backup hàng ngày lúc 2:00 sáng
    (crontab -l 2>/dev/null; echo "0 2 * * * cd $(pwd) && ./scripts/backup.sh backup > /dev/null 2>&1") | crontab -

    # Monitoring mỗi 5 phút
    (crontab -l 2>/dev/null; echo "*/5 * * * * cd $(pwd) && ./scripts/monitor.sh > /dev/null 2>&1") | crontab -

    # Cleanup logs hàng tuần
    (crontab -l 2>/dev/null; echo "0 3 * * 0 cd $(pwd) && find logs -name '*.log' -mtime +7 -delete > /dev/null 2>&1") | crontab -

    print_success "Cron jobs đã được cấu hình"
}

# Kiểm tra hệ thống
system_check() {
    print_status "Kiểm tra hệ thống..."

    local checks=0
    local total_checks=6

    # Kiểm tra Docker
    if command -v docker >/dev/null 2>&1; then
        print_success "✓ Docker"
        ((checks++))
    else
        print_error "✗ Docker"
    fi

    # Kiểm tra Docker Compose
    if command -v docker-compose >/dev/null 2>&1; then
        print_success "✓ Docker Compose"
        ((checks++))
    else
        print_error "✗ Docker Compose"
    fi

    # Kiểm tra Git
    if command -v git >/dev/null 2>&1; then
        print_success "✓ Git"
        ((checks++))
    else
        print_error "✗ Git"
    fi

    # Kiểm tra thư mục
    if [ -d "logs" ] && [ -d "backups" ] && [ -d "ssl" ]; then
        print_success "✓ Thư mục"
        ((checks++))
    else
        print_error "✗ Thư mục"
    fi

    # Kiểm tra file .env
    if [ -f ".env" ]; then
        print_success "✓ File .env"
        ((checks++))
    else
        print_error "✗ File .env"
    fi

    # Kiểm tra quyền script
    if [ -x "scripts/deploy-production.sh" ]; then
        print_success "✓ Script permissions"
        ((checks++))
    else
        print_error "✗ Script permissions"
    fi

    echo
    print_status "Kết quả kiểm tra: $checks/$total_checks"

    if [ $checks -eq $total_checks ]; then
        print_success "Hệ thống đã sẵn sàng để deploy!"
    else
        print_warning "Một số thành phần chưa được cài đặt đầy đủ"
    fi
}

# Hiển thị hướng dẫn tiếp theo
show_next_steps() {
    echo
    print_status "🎉 Khởi tạo hệ thống hoàn tất!"
    echo
    print_status "Các bước tiếp theo:"
    echo "1. Chỉnh sửa file .env với thông tin thực tế"
    echo "2. Cấu hình SSL: ./scripts/setup-ssl.sh yourdomain.com email@domain.com"
    echo "3. Deploy hệ thống: ./scripts/deploy-production.sh"
    echo "4. Kiểm tra monitoring: ./scripts/monitor.sh"
    echo
    print_status "Lệnh hữu ích:"
    echo "• Xem logs: docker-compose logs -f"
    echo "• Kiểm tra status: docker-compose ps"
    echo "• Backup: ./scripts/backup.sh backup"
    echo "• Restart: docker-compose restart"
    echo
    print_warning "Lưu ý: Đảm bảo thay đổi tất cả passwords mặc định trong file .env"
}

# Hàm chính
main() {
    echo "🚀 Khởi tạo Hệ thống Auto Login"
    echo "=================================="
    echo

    # Kiểm tra quyền root
    check_root

    # Cài đặt các thành phần
    install_docker
    install_docker_compose
    install_tools

    # Thiết lập hệ thống
    create_directories
    configure_firewall
    setup_environment
    setup_autostart
    setup_cron_jobs

    # Cấp quyền cho scripts
    chmod +x scripts/*.sh

    # Kiểm tra hệ thống
    system_check

    # Hiển thị hướng dẫn
    show_next_steps
}

# Chạy hàm chính
main