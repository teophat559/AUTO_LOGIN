#!/bin/bash

# SSL Certificate Setup Script for Production
# This script helps set up SSL certificates for the auto login system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOMAIN=${1:-"yourdomain.com"}
EMAIL=${2:-"admin@yourdomain.com"}
SSL_DIR="./ssl"
CERTBOT_DIR="/etc/letsencrypt"

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

# Function to create SSL directory
create_ssl_directory() {
    print_status "Creating SSL directory..."
    mkdir -p "$SSL_DIR"
    print_success "SSL directory created: $SSL_DIR"
}

# Function to generate self-signed certificate (for development/testing)
generate_self_signed_cert() {
    print_status "Generating self-signed SSL certificate..."

    if ! command_exists openssl; then
        print_error "OpenSSL is not installed. Please install OpenSSL first."
        exit 1
    fi

    # Generate private key
    openssl genrsa -out "$SSL_DIR/private.key" 2048

    # Generate certificate signing request
    openssl req -new -key "$SSL_DIR/private.key" -out "$SSL_DIR/cert.csr" -subj "/C=VN/ST=Hanoi/L=Hanoi/O=AutoLogin/OU=IT/CN=$DOMAIN"

    # Generate self-signed certificate
    openssl x509 -req -days 365 -in "$SSL_DIR/cert.csr" -signkey "$SSL_DIR/private.key" -out "$SSL_DIR/cert.pem"

    # Remove CSR file
    rm "$SSL_DIR/cert.csr"

    print_success "Self-signed certificate generated successfully"
    print_warning "This certificate is for development/testing only. Use Let's Encrypt for production."
}

# Function to setup Let's Encrypt certificate
setup_letsencrypt() {
    print_status "Setting up Let's Encrypt certificate..."

    if ! command_exists certbot; then
        print_error "Certbot is not installed. Please install Certbot first."
        print_status "Installation guide: https://certbot.eff.org/"
        exit 1
    fi

    # Stop nginx temporarily
    print_status "Stopping nginx temporarily..."
    docker-compose stop nginx || true

    # Create temporary nginx config for ACME challenge
    cat > nginx-acme.conf << EOF
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name $DOMAIN;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://\$host\$request_uri;
        }
    }
}
EOF

    # Run certbot
    print_status "Running certbot to obtain certificate..."
    certbot certonly --standalone \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        --domains "$DOMAIN" \
        --cert-path "$SSL_DIR/cert.pem" \
        --key-path "$SSL_DIR/private.key"

    # Copy certificates to SSL directory
    cp "$CERTBOT_DIR/live/$DOMAIN/fullchain.pem" "$SSL_DIR/cert.pem"
    cp "$CERTBOT_DIR/live/$DOMAIN/privkey.pem" "$SSL_DIR/private.key"

    # Set proper permissions
    chmod 600 "$SSL_DIR/private.key"
    chmod 644 "$SSL_DIR/cert.pem"

    # Remove temporary nginx config
    rm nginx-acme.conf

    print_success "Let's Encrypt certificate obtained successfully"
}

# Function to setup auto-renewal
setup_auto_renewal() {
    print_status "Setting up auto-renewal for SSL certificate..."

    # Create renewal script
    cat > "$SSL_DIR/renew.sh" << EOF
#!/bin/bash
# SSL Certificate Renewal Script

set -e

# Stop nginx
docker-compose stop nginx

# Renew certificate
certbot renew --standalone

# Copy renewed certificates
cp $CERTBOT_DIR/live/$DOMAIN/fullchain.pem $SSL_DIR/cert.pem
cp $CERTBOT_DIR/live/$DOMAIN/privkey.pem $SSL_DIR/private.key

# Set permissions
chmod 600 $SSL_DIR/private.key
chmod 644 $SSL_DIR/cert.pem

# Start nginx
docker-compose start nginx

echo "SSL certificate renewed successfully at \$(date)"
EOF

    chmod +x "$SSL_DIR/renew.sh"

    # Add to crontab (renew twice daily)
    (crontab -l 2>/dev/null; echo "0 12,0 * * * $SSL_DIR/renew.sh") | crontab -

    print_success "Auto-renewal setup completed"
}

# Function to validate certificate
validate_certificate() {
    print_status "Validating SSL certificate..."

    if [ -f "$SSL_DIR/cert.pem" ] && [ -f "$SSL_DIR/private.key" ]; then
        # Check certificate expiration
        EXPIRY=$(openssl x509 -enddate -noout -in "$SSL_DIR/cert.pem" | cut -d= -f2)
        print_success "Certificate expires on: $EXPIRY"

        # Check certificate details
        print_status "Certificate details:"
        openssl x509 -in "$SSL_DIR/cert.pem" -text -noout | grep -E "(Subject:|Issuer:|Not After:)"
    else
        print_error "Certificate files not found"
        exit 1
    fi
}

# Main execution
main() {
    print_status "SSL Certificate Setup for Auto Login System"
    print_status "Domain: $DOMAIN"
    print_status "Email: $EMAIL"

    # Create SSL directory
    create_ssl_directory

    # Check if running in production mode
    if [ "$NODE_ENV" = "production" ]; then
        print_status "Production mode detected. Setting up Let's Encrypt certificate..."
        setup_letsencrypt
        setup_auto_renewal
    else
        print_status "Development mode detected. Generating self-signed certificate..."
        generate_self_signed_cert
    fi

    # Validate certificate
    validate_certificate

    print_success "SSL setup completed successfully!"
    print_status "You can now start your services with: docker-compose up -d"
}

# Check if domain is provided
if [ -z "$1" ]; then
    print_error "Usage: $0 <domain> [email]"
    print_status "Example: $0 yourdomain.com admin@yourdomain.com"
    exit 1
fi

# Run main function
main