#!/bin/bash

# Backup and Restore Script for Auto Login System
# This script handles database and file backups

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKUP_DIR="./backups"
DB_BACKUP_DIR="$BACKUP_DIR/database"
FILE_BACKUP_DIR="$BACKUP_DIR/files"
LOG_FILE="$BACKUP_DIR/backup.log"
RETENTION_DAYS=30
COMPRESSION=true

# Database configuration
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_NAME=${DB_NAME:-"auto_login_db"}
DB_USER=${DB_USER:-"auto_login_user"}
DB_PASSWORD=${DB_PASSWORD:-"auto_login_password"}

# Backup directories to include
BACKUP_PATHS=(
    "./uploads"
    "./logs"
    "./ssl"
    "./config"
)

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

# Function to create backup directories
create_backup_directories() {
    print_status "Creating backup directories..."

    mkdir -p "$BACKUP_DIR"
    mkdir -p "$DB_BACKUP_DIR"
    mkdir -p "$FILE_BACKUP_DIR"

    print_success "Backup directories created"
}

# Function to backup database
backup_database() {
    print_status "Starting database backup..."

    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$DB_BACKUP_DIR/db_backup_$timestamp.sql"

    if command -v pg_dump >/dev/null 2>&1; then
        # Set password for pg_dump
        export PGPASSWORD="$DB_PASSWORD"

        # Create database backup
        pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
            --verbose --clean --create --if-exists > "$backup_file"

        # Compress if enabled
        if [ "$COMPRESSION" = true ]; then
            gzip "$backup_file"
            backup_file="$backup_file.gz"
        fi

        print_success "Database backup completed: $backup_file"
        log_message "INFO" "Database backup completed: $backup_file"

        # Get backup size
        local size=$(du -h "$backup_file" | cut -f1)
        print_status "Backup size: $size"

        echo "$backup_file"
    else
        print_error "pg_dump not found. Please install PostgreSQL client tools."
        log_message "ERROR" "pg_dump not found"
        return 1
    fi
}

# Function to backup files
backup_files() {
    print_status "Starting file backup..."

    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$FILE_BACKUP_DIR/files_backup_$timestamp.tar"

    # Create tar archive
    tar -cf "$backup_file" "${BACKUP_PATHS[@]}" 2>/dev/null || {
        print_warning "Some files could not be backed up (may not exist)"
    }

    # Compress if enabled
    if [ "$COMPRESSION" = true ]; then
        gzip "$backup_file"
        backup_file="$backup_file.gz"
    fi

    print_success "File backup completed: $backup_file"
    log_message "INFO" "File backup completed: $backup_file"

    # Get backup size
    local size=$(du -h "$backup_file" | cut -f1)
    print_status "Backup size: $size"

    echo "$backup_file"
}

# Function to create full backup
create_full_backup() {
    print_status "Creating full system backup..."

    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_name="full_backup_$timestamp"
    local backup_dir="$BACKUP_DIR/$backup_name"

    mkdir -p "$backup_dir"

    # Backup database
    local db_backup=$(backup_database)
    if [ -n "$db_backup" ]; then
        mv "$db_backup" "$backup_dir/"
    fi

    # Backup files
    local file_backup=$(backup_files)
    if [ -n "$file_backup" ]; then
        mv "$file_backup" "$backup_dir/"
    fi

    # Create backup manifest
    cat > "$backup_dir/manifest.txt" << EOF
Auto Login System Full Backup
Created: $(date)
Backup ID: $backup_name

Contents:
- Database backup
- File backup
- Configuration files

System Information:
- Database: $DB_NAME
- Backup compression: $COMPRESSION
- Retention days: $RETENTION_DAYS
EOF

    print_success "Full backup completed: $backup_dir"
    log_message "INFO" "Full backup completed: $backup_dir"

    echo "$backup_dir"
}

# Function to restore database
restore_database() {
    local backup_file=$1

    if [ -z "$backup_file" ]; then
        print_error "No backup file specified"
        return 1
    fi

    print_status "Restoring database from: $backup_file"

    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        return 1
    fi

    # Check if file is compressed
    local restore_file="$backup_file"
    if [[ "$backup_file" == *.gz ]]; then
        print_status "Decompressing backup file..."
        gunzip -c "$backup_file" > "${backup_file%.gz}"
        restore_file="${backup_file%.gz}"
    fi

    # Set password for psql
    export PGPASSWORD="$DB_PASSWORD"

    # Restore database
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" < "$restore_file"

    # Clean up temporary file
    if [[ "$backup_file" == *.gz ]]; then
        rm "$restore_file"
    fi

    print_success "Database restored successfully"
    log_message "INFO" "Database restored from: $backup_file"
}

# Function to restore files
restore_files() {
    local backup_file=$1
    local restore_path=$2

    if [ -z "$backup_file" ]; then
        print_error "No backup file specified"
        return 1
    fi

    if [ -z "$restore_path" ]; then
        restore_path="."
    fi

    print_status "Restoring files from: $backup_file to: $restore_path"

    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        return 1
    fi

    # Check if file is compressed
    local restore_file="$backup_file"
    if [[ "$backup_file" == *.gz ]]; then
        print_status "Decompressing backup file..."
        gunzip -c "$backup_file" > "${backup_file%.gz}"
        restore_file="${backup_file%.gz}"
    fi

    # Extract files
    tar -xf "$restore_file" -C "$restore_path"

    # Clean up temporary file
    if [[ "$backup_file" == *.gz ]]; then
        rm "$restore_file"
    fi

    print_success "Files restored successfully"
    log_message "INFO" "Files restored from: $backup_file"
}

# Function to list backups
list_backups() {
    print_status "Available backups:"

    echo ""
    echo "Database backups:"
    if [ -d "$DB_BACKUP_DIR" ]; then
        ls -lh "$DB_BACKUP_DIR"/*.sql* 2>/dev/null || echo "No database backups found"
    else
        echo "No database backup directory found"
    fi

    echo ""
    echo "File backups:"
    if [ -d "$FILE_BACKUP_DIR" ]; then
        ls -lh "$FILE_BACKUP_DIR"/*.tar* 2>/dev/null || echo "No file backups found"
    else
        echo "No file backup directory found"
    fi

    echo ""
    echo "Full backups:"
    if [ -d "$BACKUP_DIR" ]; then
        ls -lh "$BACKUP_DIR"/full_backup_* 2>/dev/null || echo "No full backups found"
    else
        echo "No full backups found"
    fi
}

# Function to clean old backups
cleanup_old_backups() {
    print_status "Cleaning up old backups (older than $RETENTION_DAYS days)..."

    local deleted_count=0

    # Clean database backups
    if [ -d "$DB_BACKUP_DIR" ]; then
        local db_deleted=$(find "$DB_BACKUP_DIR" -name "*.sql*" -mtime +$RETENTION_DAYS -delete -print | wc -l)
        deleted_count=$((deleted_count + db_deleted))
    fi

    # Clean file backups
    if [ -d "$FILE_BACKUP_DIR" ]; then
        local file_deleted=$(find "$FILE_BACKUP_DIR" -name "*.tar*" -mtime +$RETENTION_DAYS -delete -print | wc -l)
        deleted_count=$((deleted_count + file_deleted))
    fi

    # Clean full backups
    if [ -d "$BACKUP_DIR" ]; then
        local full_deleted=$(find "$BACKUP_DIR" -name "full_backup_*" -mtime +$RETENTION_DAYS -delete -print | wc -l)
        deleted_count=$((deleted_count + full_deleted))
    fi

    print_success "Cleaned up $deleted_count old backup files"
    log_message "INFO" "Cleaned up $deleted_count old backup files"
}

# Function to verify backup integrity
verify_backup() {
    local backup_file=$1

    if [ -z "$backup_file" ]; then
        print_error "No backup file specified"
        return 1
    fi

    print_status "Verifying backup integrity: $backup_file"

    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        return 1
    fi

    # Check if file is compressed
    if [[ "$backup_file" == *.gz ]]; then
        if gzip -t "$backup_file"; then
            print_success "Compressed backup file is valid"
        else
            print_error "Compressed backup file is corrupted"
            return 1
        fi
    fi

    # For database backups, try to read the header
    if [[ "$backup_file" == *.sql* ]]; then
        local test_file="$backup_file"
        if [[ "$backup_file" == *.gz ]]; then
            test_file=$(mktemp)
            gunzip -c "$backup_file" > "$test_file"
        fi

        if head -n 1 "$test_file" | grep -q "PostgreSQL database dump"; then
            print_success "Database backup file is valid"
        else
            print_error "Database backup file appears to be corrupted"
            if [[ "$backup_file" == *.gz ]]; then
                rm "$test_file"
            fi
            return 1
        fi

        if [[ "$backup_file" == *.gz ]]; then
            rm "$test_file"
        fi
    fi

    print_success "Backup verification completed"
    log_message "INFO" "Backup verification completed: $backup_file"
}

# Function to show backup statistics
show_statistics() {
    print_status "Backup Statistics:"

    local total_size=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1 || echo "0")
    local db_count=$(find "$DB_BACKUP_DIR" -name "*.sql*" 2>/dev/null | wc -l)
    local file_count=$(find "$FILE_BACKUP_DIR" -name "*.tar*" 2>/dev/null | wc -l)
    local full_count=$(find "$BACKUP_DIR" -name "full_backup_*" 2>/dev/null | wc -l)

    echo "Total backup size: $total_size"
    echo "Database backups: $db_count"
    echo "File backups: $file_count"
    echo "Full backups: $full_count"
    echo "Retention period: $RETENTION_DAYS days"
}

# Main function
main() {
    local action=$1
    local backup_file=$2
    local restore_path=$3

    # Create backup directories
    create_backup_directories

    case "$action" in
        "backup")
            create_full_backup
            ;;
        "backup-db")
            backup_database
            ;;
        "backup-files")
            backup_files
            ;;
        "restore-db")
            restore_database "$backup_file"
            ;;
        "restore-files")
            restore_files "$backup_file" "$restore_path"
            ;;
        "list")
            list_backups
            ;;
        "cleanup")
            cleanup_old_backups
            ;;
        "verify")
            verify_backup "$backup_file"
            ;;
        "stats")
            show_statistics
            ;;
        *)
            echo "Usage: $0 {backup|backup-db|backup-files|restore-db|restore-files|list|cleanup|verify|stats}"
            echo ""
            echo "Commands:"
            echo "  backup          - Create full system backup"
            echo "  backup-db       - Backup database only"
            echo "  backup-files    - Backup files only"
            echo "  restore-db      - Restore database from backup file"
            echo "  restore-files   - Restore files from backup file"
            echo "  list            - List all available backups"
            echo "  cleanup         - Remove old backups"
            echo "  verify          - Verify backup file integrity"
            echo "  stats           - Show backup statistics"
            echo ""
            echo "Examples:"
            echo "  $0 backup"
            echo "  $0 restore-db ./backups/database/db_backup_20231201_120000.sql"
            echo "  $0 restore-files ./backups/files/files_backup_20231201_120000.tar.gz"
            exit 1
            ;;
    esac
}

# Check if action is provided
if [ -z "$1" ]; then
    main
else
    main "$@"
fi