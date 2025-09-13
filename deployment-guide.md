# Ninder Production Deployment Guide

## Architecture
```
Internet → yourdomain.com (Cloudflare DNS) → Digital Ocean (Caddy) → Cloudflare Tunnel → Home Server (Docker)
```

## Prerequisites
- Domain managed by Cloudflare
- Digital Ocean instance running Caddy
- Home server with Docker and Docker Compose
- Cloudflare tunnel set up

## Step 1: Prepare Home Server

### 1.1 Create production environment file
Create `.env.production`:
```bash
POSTGRES_USER=ninder_user
POSTGRES_PASSWORD=your_secure_password_here
DATABASE_URL=postgresql://ninder_user:your_secure_password_here@postgres:5432/ninder
NODE_ENV=production
```

### 1.2 Create production docker-compose
Create `docker-compose.prod.yml`:
```yaml
services:
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=ninder
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups  # For database backups
    networks:
      - ninder
    restart: unless-stopped

  ninder:
    build: .
    ports:
      - "3002:3000"  # Only accessible from localhost
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NODE_ENV=production
    networks:
      - ninder
    depends_on:
      - postgres
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs  # For application logs

volumes:
  postgres_data:

networks:
  ninder:
```

## Step 2: Home Server Deployment

### 2.1 Deploy on home server
```bash
# Copy project to home server
scp -r /path/to/ninder user@homeserver:/opt/ninder

# On home server
cd /opt/ninder
cp .env.production .env
docker-compose -f docker-compose.prod.yml up -d --build
```

### 2.2 Initialize database
```bash
# Load your names data
cd /opt/ninder/tools/names
./refresh-names.sh
```

## Step 3: Cloudflare Tunnel Setup

### 3.1 Install cloudflared on home server
```bash
# On home server
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared
```

### 3.2 Create tunnel
```bash
# Login to Cloudflare
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create ninder-tunnel

# Get tunnel ID and save credentials
cloudflared tunnel list
```

### 3.3 Configure tunnel
Create `/opt/ninder/tunnel-config.yml`:
```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /root/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: ninder.yourdomain.com
    service: http://localhost:3002
  - service: http_status:404
```

### 3.4 Run tunnel as service
```bash
# Create systemd service
sudo tee /etc/systemd/system/cloudflared.service > /dev/null <<EOF
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/cloudflared tunnel --config /opt/ninder/tunnel-config.yml run
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

## Step 4: Digital Ocean Caddy Configuration

### 4.1 Caddy configuration
On your Digital Ocean instance, add to Caddyfile:
```
ninder.yourdomain.com {
    reverse_proxy https://YOUR_TUNNEL_ID.cfargotunnel.com {
        header_up Host {upstream_hostport}
        header_up X-Forwarded-Proto https
    }
}
```

### 4.2 Reload Caddy
```bash
sudo systemctl reload caddy
```

## Step 5: Cloudflare DNS Configuration

### 5.1 Add DNS record
In Cloudflare dashboard:
- Type: CNAME
- Name: ninder
- Content: YOUR_TUNNEL_ID.cfargotunnel.com
- Proxy status: Proxied (orange cloud)

## Step 6: SSL/Security Configuration

### 6.1 Cloudflare SSL settings
- SSL/TLS mode: Full (strict)
- Always Use HTTPS: On
- Automatic HTTPS Rewrites: On

### 6.2 Security headers in Caddy
Update Caddy config:
```
ninder.yourdomain.com {
    header {
        X-Frame-Options DENY
        X-Content-Type-Options nosniff
        Referrer-Policy strict-origin-when-cross-origin
    }
    reverse_proxy https://YOUR_TUNNEL_ID.cfargotunnel.com {
        header_up Host {upstream_hostport}
        header_up X-Forwarded-Proto https
    }
}
```

## Step 7: Monitoring & Maintenance

### 7.1 Database backups
Create backup script `/opt/ninder/backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose -f /opt/ninder/docker-compose.prod.yml exec -T postgres pg_dump -U ninder_user ninder > /opt/ninder/backups/ninder_backup_$DATE.sql
find /opt/ninder/backups -name "*.sql" -mtime +7 -delete
```

### 7.2 Log rotation
Add to `/etc/logrotate.d/ninder`:
```
/opt/ninder/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 644 root root
}
```

## Troubleshooting

### Check services
```bash
# Home server
docker-compose -f docker-compose.prod.yml ps
sudo systemctl status cloudflared

# Digital Ocean
sudo systemctl status caddy

# Check tunnel
cloudflared tunnel info ninder-tunnel
```

### Logs
```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs -f ninder

# Tunnel logs
sudo journalctl -u cloudflared -f

# Caddy logs
sudo journalctl -u caddy -f
```