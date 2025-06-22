#!/usr/bin/env bash

# Multi-workers deploy script for hono-builder
# Demonstrates bundle-size optimized splitting

set -e

echo "🚀 Hono-Builder Multi-Workers Deploy Script"
echo "============================================="

# Helper function for colored output
log_info() {
    echo -e "\033[36m[INFO]\033[0m $1"
}

log_success() {
    echo -e "\033[32m[SUCCESS]\033[0m $1"
}

log_error() {
    echo -e "\033[31m[ERROR]\033[0m $1"
}

# Check if bun is available
if ! command -v bun &> /dev/null; then
    log_error "bun could not be found. Please ensure mise is activated: eval \"\$(mise activate zsh --shims)\""
    exit 1
fi

# Function to build and deploy a specific entry
deploy_entry() {
    local entry=$1
    local config_file="wrangler.${entry}.jsonc"
    
    log_info "Deploying ${entry}..."
    
    # Build the specific entry
    log_info "Building ${entry}..."
    bun run "build:${entry}"
    
    # Deploy with wrangler
    log_info "Deploying ${entry} to Cloudflare Workers..."
    if [ "$DRY_RUN" = "true" ]; then
        npx wrangler deploy --config "$config_file" --dry-run
    else
        npx wrangler deploy --config "$config_file"
    fi
    
    log_success "${entry} deployment completed!"
    echo ""
}

# Function to show bundle size comparison
show_bundle_stats() {
    log_info "Bundle Size Analysis (Bundle Size Optimized Splitting):"
    echo "--------------------------------------------------------"
    
    if [ -f "dist/dev/index.js" ]; then
        dev_size=$(ls -lh dist/dev/index.js | awk '{print $5}')
        echo "📦 dev      (r1-r9): ${dev_size}"
    fi
    
    if [ -f "dist/entry1/index.js" ]; then
        entry1_size=$(ls -lh dist/entry1/index.js | awk '{print $5}')
        echo "📦 entry1   (r1-r3): ${entry1_size}"
    fi
    
    if [ -f "dist/entry2/index.js" ]; then
        entry2_size=$(ls -lh dist/entry2/index.js | awk '{print $5}')
        echo "📦 entry2   (r4-r6): ${entry2_size}"
    fi
    
    if [ -f "dist/entry3/index.js" ]; then
        entry3_size=$(ls -lh dist/entry3/index.js | awk '{print $5}')
        echo "📦 entry3   (r7-r9): ${entry3_size}"
    fi
    
    echo "--------------------------------------------------------"
    echo "Notice: Individual entries are smaller than the full bundle!"
    echo ""
}

# Parse command line arguments
ENTRY=""
DRY_RUN="false"
SHOW_STATS="false"

while [[ $# -gt 0 ]]; do
    case $1 in
        --entry)
            ENTRY="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN="true"
            shift
            ;;
        --stats)
            SHOW_STATS="true"
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --entry <name>    Deploy specific entry (dev, entry1, entry2, entry3)"
            echo "  --dry-run         Perform a dry run deployment"
            echo "  --stats           Show bundle size statistics"
            echo "  --help           Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                          # Deploy all entries"
            echo "  $0 --entry entry1          # Deploy only entry1"
            echo "  $0 --dry-run               # Dry run all entries"
            echo "  $0 --entry entry2 --dry-run # Dry run entry2"
            echo "  $0 --stats                 # Show bundle statistics"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Show stats if requested
if [ "$SHOW_STATS" = "true" ]; then
    show_bundle_stats
    exit 0
fi

# Deploy specific entry or all entries
if [ -n "$ENTRY" ]; then
    case $ENTRY in
        dev|entry1|entry2|entry3)
            deploy_entry "$ENTRY"
            ;;
        *)
            log_error "Invalid entry: $ENTRY. Must be one of: dev, entry1, entry2, entry3"
            exit 1
            ;;
    esac
else
    log_info "Deploying all entries..."
    echo ""
    
    # Deploy all entries
    for entry in entry1 entry2 entry3; do
        deploy_entry "$entry"
    done
    
    log_success "All entries deployed successfully!"
    echo ""
    show_bundle_stats
fi
