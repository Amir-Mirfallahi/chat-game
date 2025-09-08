#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="chatai-talk.ir"
API_DOMAIN="server.chatai-talk.ir"
EMAIL=""

echo -e "${BLUE}🚀 ChatAI SSL Setup Script${NC}"
echo "================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}


# Get email for Let's Encrypt
get_email() {
    if [ -z "$EMAIL" ]; then
        echo -n "Enter your email for Let's Encrypt notifications: "
        read EMAIL
        if [ -z "$EMAIL" ]; then
            print_error "Email is required for SSL certificates"
            exit 1
        fi
    fi
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if docker-compose is installed
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    # Check if openssl is installed
    if ! command -v openssl &> /dev/null; then
        print_error "OpenSSL is not installed. Please install OpenSSL first."
        exit 1
    fi
    
    print_status "All prerequisites are installed"
}

# Check domain DNS
check_dns() {
    print_info "Checking DNS configuration..."
    
    SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip)
    if [ -z "$SERVER_IP" ]; then
        print_warning "Could not determine server IP automatically"
        echo -n "Enter your server's public IP: "
        read SERVER_IP
    else
        print_info "Detected server IP: $SERVER_IP"
    fi
    
    # Check main domain
    DOMAIN_IP=$(nslookup $DOMAIN | grep -A1 "Name:" | tail -n1 | awk '{print $2}' 2>/dev/null || dig +short $DOMAIN 2>/dev/null | head -n1)
    if [ "$DOMAIN_IP" = "$SERVER_IP" ]; then
        print_status "$DOMAIN points to correct IP ($SERVER_IP)"
    else
        print_warning "$DOMAIN points to $DOMAIN_IP, but server IP is $SERVER_IP"
        echo "Please update your DNS records and wait for propagation before continuing."
        echo -n "Continue anyway? (y/N): "
        read -r response
        if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            exit 1
        fi
    fi
    
    # Check API subdomain
    API_IP=$(nslookup $API_DOMAIN | grep -A1 "Name:" | tail -n1 | awk '{print $2}' 2>/dev/null || dig +short $API_DOMAIN 2>/dev/null | head -n1)
    if [ "$API_IP" = "$SERVER_IP" ]; then
        print_status "$API_DOMAIN points to correct IP ($SERVER_IP)"
    else
        print_warning "$API_DOMAIN points to $API_IP, but server IP is $SERVER_IP"
    fi
}

# Create directory structure
create_directories() {
    print_info "Creating directory structure..."
    
    mkdir -p ./nginx/conf.d
    mkdir -p ./certbot/www
    mkdir -p ./certbot/conf
    mkdir -p ./dhparam
    
    print_status "Directories created"
}

# Generate dhparam
generate_dhparam() {
    if [ ! -f "./dhparam/dhparam.pem" ]; then
        print_info "Generating Diffie-Hellman parameters (this may take a few minutes)..."
        openssl dhparam -out ./dhparam/dhparam.pem 2048
        print_status "DH parameters generated"
    else
        print_status "DH parameters already exist"
    fi
}

# Create initial HTTP-only nginx config
create_http_config() {
    print_info "Creating HTTP-only nginx configuration..."
    
    cat > ./nginx/conf.d/default.conf << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

server {
    listen 80;
    server_name $API_DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://backend:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    print_status "HTTP configuration created"
}

# Start services with HTTP config
start_http_services() {
    print_info "Starting services with HTTP configuration..."
    
    # Stop any running services
    docker compose down 2>/dev/null || true
    
    # Start services
    docker compose up -d --build
    
    # Wait for nginx to be ready
    print_info "Waiting for services to start..."
    sleep 40
    
    # Check if nginx is responding
    if curl -f -s -I http://localhost:80 > /dev/null 2>&1; then
        print_status "Nginx is responding"
    else
        print_error "Nginx is not responding on port 80"
        print_info "Checking nginx logs..."
        docker compose logs nginx
        exit 1
    fi
}

# Obtain SSL certificates
obtain_certificates() {
    print_info "Obtaining SSL certificates from Let's Encrypt..."
    
    # Test connectivity first
    print_info "Testing domain connectivity..."
    if curl -f -s -I "http://$DOMAIN" > /dev/null 2>&1; then
        print_status "$DOMAIN is reachable"
    else
        print_warning "$DOMAIN is not reachable from this server"
    fi
    
    # Get certificate for main domain
    print_info "Requesting certificate for $DOMAIN..."
    docker docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
        -d "$DOMAIN" \
        -d "www.$DOMAIN"
    
    if [ $? -eq 0 ]; then
        print_status "Certificate obtained for $DOMAIN"
    else
        print_error "Failed to obtain certificate for $DOMAIN"
        print_info "Checking certbot logs..."
        docker compose logs certbot
        exit 1
    fi
    
    # Get certificate for API domain
    print_info "Requesting certificate for $API_DOMAIN..."
    docker docker compose run --rm certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  -d "$API_DOMAIN"
    
    if [ $? -eq 0 ]; then
        print_status "Certificate obtained for $API_DOMAIN"
    else
        print_error "Failed to obtain certificate for $API_DOMAIN"
        exit 1
    fi
    
    # Verify certificates exist
    if [ -f "./certbot/conf/live/$DOMAIN/fullchain.pem" ] && [ -f "./certbot/conf/live/$API_DOMAIN/fullchain.pem" ]; then
        print_status "All certificates verified"
    else
        print_error "Certificate files not found"
        exit 1
    fi
}

# Create HTTPS nginx configuration
create_https_config() {
    print_info "Creating HTTPS nginx configuration..."
    
    cat > ./nginx/conf.d/default.conf << EOF
# Redirect all HTTP traffic to HTTPS
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN $API_DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

# Frontend - Main domain
server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_dhparam /etc/nginx/dhparam/dhparam.pem;
    
    # SSL Session
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# Backend - API subdomain
server {
    listen 443 ssl http2;
    server_name $API_DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$API_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$API_DOMAIN/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_dhparam /etc/nginx/dhparam/dhparam.pem;
    
    # SSL Session
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # CORS headers
    add_header Access-Control-Allow-Origin "https://$DOMAIN" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;

    location / {
        proxy_pass http://backend:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Handle CORS preflight requests
    location ~* ^.+\\.(OPTIONS)\$ {
        add_header Access-Control-Allow-Origin "https://$DOMAIN";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Authorization, Content-Type";
        add_header Content-Length 0;
        add_header Content-Type text/plain;
        return 200;
    }
}
EOF
    
    print_status "HTTPS configuration created"
}

# Apply HTTPS configuration
apply_https_config() {
    print_info "Applying HTTPS configuration..."
    
    # Reload nginx with new config
    docker compose exec nginx nginx -s reload
    
    if [ $? -eq 0 ]; then
        print_status "Nginx reloaded with HTTPS configuration"
    else
        print_error "Failed to reload nginx"
        exit 1
    fi
}

# Test the setup
test_setup() {
    print_info "Testing the setup..."
    
    sleep 5
    
    # Test HTTP redirect
    if curl -s -I "http://$DOMAIN" | grep -q "301"; then
        print_status "HTTP to HTTPS redirect working"
    else
        print_warning "HTTP redirect might not be working"
    fi
    
    # Test HTTPS
    if curl -s -I "https://$DOMAIN" | grep -q "200"; then
        print_status "HTTPS frontend is working"
    else
        print_warning "HTTPS frontend might not be working"
    fi
    
    if curl -s -I "https://$API_DOMAIN" | grep -q -E "(200|404)"; then
        print_status "HTTPS backend is accessible"
    else
        print_warning "HTTPS backend might not be working"
    fi
}

# Create renewal script
create_renewal_script() {
    print_info "Creating certificate renewal script..."
    
    cat > ./renew-certs.sh << 'EOF'
#!/bin/bash
echo "🔄 Renewing SSL certificates..."
docker compose run --rm certbot renew --quiet
docker compose exec nginx nginx -s reload
echo "✅ Certificate renewal completed"
EOF
    
    chmod +x ./renew-certs.sh
    print_status "Renewal script created (./renew-certs.sh)"
}

# Main execution
main() {
    echo
    get_email
    check_prerequisites
    check_dns
    create_directories
    generate_dhparam
    create_http_config
    start_http_services
    obtain_certificates
    create_https_config
    apply_https_config
    test_setup
    create_renewal_script
    
    echo
    echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
    echo "================================="
    echo -e "${BLUE}Your website is now available at:${NC}"
    echo -e "  Frontend: ${GREEN}https://$DOMAIN${NC}"
    echo -e "  Backend:  ${GREEN}https://$API_DOMAIN${NC}"
    echo
    echo -e "${YELLOW}Important notes:${NC}"
    echo "• Certificates will auto-renew via docker-compose"
    echo "• Manual renewal: ./renew-certs.sh"
    echo "• Your CI/CD pipeline can now deploy normally"
    echo "• Check certificate status: docker compose run --rm certbot certificates"
    echo
}

# Run main function
main "$@"