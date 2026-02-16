#!/bin/bash

# Opsis Installation Script
# This script automates the installation of Opsis skills and hooks for AiderDesk

set -e  # Exit on error
set -u  # Exit on undefined variable

# Configuration
SKILLS_DIR="skills"
SKILLS_PREFIX="opsis"
AIDERDESK_DIR="$HOME/.aider-desk"
AIDERDESK_SKILLS_DIR="${AIDERDESK_DIR}/skills"
AIDERDESK_HOOKS_DIR="${AIDERDESK_DIR}/hooks"
HOOKS_DIR="hooks"
PROJECT_DATA_DIR=".aider-desk/opsis"
LOGS_DIR="logs"
MIN_SKILLS_EXPECTED=20
MIN_HOOKS_EXPECTED=3
SKILLS_PATTERNS=("${SKILLS_PREFIX}-*" "using-${SKILLS_PREFIX}")

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions for colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Check if script is run from the opsis directory
check_project_dir() {
    if [ ! -f "README.md" ] || [ ! -d "${SKILLS_DIR}" ] || [ ! -d "${HOOKS_DIR}" ]; then
        print_error "This script must be run from the Opsis project directory"
        print_info "Please navigate to the Opsis directory and run: ./install.sh"
        exit 1
    fi
    print_success "Opsis project directory verified"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check if AiderDesk directory exists
    if [ ! -d "${AIDERDESK_DIR}" ]; then
        print_error "AiderDesk directory not found: ${AIDERDESK_DIR}"
        print_info "Please install AiderDesk first"
        exit 1
    fi
    
    # Check if AiderDesk skills directory exists
    if [ ! -d "${AIDERDESK_SKILLS_DIR}" ]; then
        print_error "AiderDesk skills directory not found: ${AIDERDESK_SKILLS_DIR}"
        print_info "Please install AiderDesk first"
        exit 1
    fi
    print_success "AiderDesk installation found"
    
    # Check write permissions
    if [ ! -w "${AIDERDESK_DIR}" ]; then
        print_error "No write permission for: ${AIDERDESK_DIR}"
        exit 1
    fi
    print_success "Write permissions verified"
}

# Get list of Opsis skill directories
get_opsis_skills() {
    local skills_dir="$1"
    local -n skills_array=$2
    
    # Build array of skill directories using configured patterns
    for pattern in "${SKILLS_PATTERNS[@]}"; do
        for skill_dir in "$skills_dir"/$pattern; do
            if [ -d "$skill_dir" ]; then
                skills_array+=("$(basename "$skill_dir")")
            fi
        done
    done
    
    # Sort the array using mapfile
    local -a sorted_skills
    mapfile -t sorted_skills < <(printf '%s\n' "${skills_array[@]}" | sort)
    skills_array=("${sorted_skills[@]}")
}

# Install skills
install_skills() {
    print_header "Installing Opsis Skills"
    
    local -a installed_skills=()
    
    # Copy all skills
    if cp -r "${SKILLS_DIR}"/* "${AIDERDESK_SKILLS_DIR}/"; then
        # Get list of installed skills
        get_opsis_skills "${AIDERDESK_SKILLS_DIR}" installed_skills
        local skills_count=${#installed_skills[@]}
        print_success "Installed $skills_count Opsis skills to ${AIDERDESK_SKILLS_DIR}"
    else
        print_error "Failed to copy skills"
        exit 1
    fi
    
    # Verify installation
    if [ "$skills_count" -lt "$MIN_SKILLS_EXPECTED" ]; then
        print_warning "Expected at least $MIN_SKILLS_EXPECTED skills, found $skills_count"
    fi
    
    # List installed skills
    print_info "Installed skills:"
    local display_max="$MIN_SKILLS_EXPECTED"
    local i=0
    for skill in "${installed_skills[@]}"; do
        echo "  - $skill"
        i=$((i + 1))
        if [ "$i" -ge "$display_max" ]; then
            local remaining=$((skills_count - display_max))
            if [ "$remaining" -gt 0 ]; then
                echo "  ... and $remaining more"
            fi
            break
        fi
    done
}

# Install hooks
install_hooks() {
    print_header "Installing Opsis Hooks"
    
    if [ -d "${HOOKS_DIR}" ]; then
        # Create AiderDesk hooks directory if it doesn't exist
        mkdir -p "${AIDERDESK_HOOKS_DIR}"
        
        if cp -r "${HOOKS_DIR}"/* "${AIDERDESK_HOOKS_DIR}/"; then
            print_success "Installed hooks to ${AIDERDESK_HOOKS_DIR}/"
            
            # List installed hooks
            print_info "Installed hooks:"
            find "${AIDERDESK_HOOKS_DIR}" -maxdepth 1 -type f -printf "  - %f\n" | sort
        else
            print_error "Failed to copy hooks"
            exit 1
        fi
    else
        print_error "Hooks directory not found"
        exit 1
    fi
}

# Create directories
create_directories() {
    print_header "Creating Directory Structure"
    
    # Create outputs directory
    mkdir -p "${PROJECT_DATA_DIR}/outputs"
    print_success "Created: ${PROJECT_DATA_DIR}/outputs"
    
    # Create archive directory
    mkdir -p "${PROJECT_DATA_DIR}/archive"
    print_success "Created: ${PROJECT_DATA_DIR}/archive"
    
    # Create logs directory
    mkdir -p "${LOGS_DIR}/sessions"
    print_success "Created: ${LOGS_DIR}/sessions"
    
    # Create instructions directory
    mkdir -p "${PROJECT_DATA_DIR}/instructions/workflows"
    print_success "Created: ${PROJECT_DATA_DIR}/instructions/workflows"
    
    mkdir -p "${PROJECT_DATA_DIR}/instructions/core"
    print_success "Created: ${PROJECT_DATA_DIR}/instructions/core"
}

# Create default config
create_config() {
    print_header "Creating Default Configuration"
    
    local config_file="${AIDERDESK_HOOKS_DIR}/config.json"
    
    if [ ! -f "$config_file" ]; then
        cat > "$config_file" << 'EOF'
{
  "skill-suggester": {
    "maxSuggestions": 3,
    "confidenceThreshold": 0.3,
    "autoLoadTopSkills": true
  },
  "mode-tracker": {
    "planningThreshold": 0.6,
    "implementationThreshold": 0.6,
    "maxViolations": 3
  },
  "verification-gate": {
    "completionThreshold": 0.75,
    "evidenceRequired": true
  },
  "session-tracker": {
    "enableLogging": true,
    "maxLogFileSize": 10485760,
    "maxLogFiles": 5
  }
}
EOF
        print_success "Created default configuration: hooks/config.json"
    else
        print_warning "Configuration file already exists, skipping"
    fi
}

# Verify installation
verify_installation() {
    print_header "Verifying Installation"
    
    local errors=0
    
    # Check skills
    local -a verified_skills=()
    get_opsis_skills "${AIDERDESK_SKILLS_DIR}" verified_skills
    local skills_count=${#verified_skills[@]}
    if [ "$skills_count" -ge "$MIN_SKILLS_EXPECTED" ]; then
        print_success "Skills installation verified ($skills_count skills found)"
    else
        print_error "Skills installation incomplete (only $skills_count skills found)"
        errors=$((errors + 1))
    fi
    
    # Check hooks
    local hooks_count
    hooks_count=$(find "${AIDERDESK_HOOKS_DIR}" -maxdepth 1 -name "*.js" 2>/dev/null | wc -l)
    if [ -d "${AIDERDESK_HOOKS_DIR}" ] && [ "$hooks_count" -ge "$MIN_HOOKS_EXPECTED" ]; then
        print_success "Hooks installation verified"
    else
        print_error "Hooks installation incomplete"
        errors=$((errors + 1))
    fi
    
    # Check directories
    local dirs_ok=true
    for dir in "${PROJECT_DATA_DIR}/outputs" "${PROJECT_DATA_DIR}/archive" "${LOGS_DIR}/sessions"; do
        if [ ! -d "$dir" ]; then
            print_error "Missing directory: $dir"
            dirs_ok=false
            errors=$((errors + 1))
        fi
    done
    if [ "$dirs_ok" = true ]; then
        print_success "Directory structure verified"
    fi
    
    return $errors
}

# Print summary
print_summary() {
    local exit_code=$1
    
    print_header "Installation Summary"
    
    if [ "$exit_code" -eq 0 ]; then
        print_success "Opsis installation completed successfully!"
        echo ""
        print_info "Next steps:"
        echo "  1. Start AiderDesk"
        echo "  2. Load a skill: Load skill: using-opsis"
        echo "  3. Read individual skill documentation in skills/*/SKILL.md"
        echo "  4. Review ARCHITECTURE.md for system design"
        echo ""
        print_info "For troubleshooting, see INSTALL.md"
    else
        print_error "Installation completed with errors"
        print_info "Please check the error messages above and try again"
        print_info "For detailed troubleshooting, see INSTALL.md"
    fi
    
    return "$exit_code"
}

# Main execution
main() {
    print_header "Opsis Installation Script"
    print_info "This script will install Opsis skills and hooks for AiderDesk"
    echo ""
    
    # Check for help flag
    if [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
        echo "Usage: ./install.sh [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --skip-config  Skip creating default configuration"
        echo "  --verify-only  Only verify existing installation"
        echo ""
        exit 0
    fi
    
    # Verify-only mode
    if [ "${1:-}" = "--verify-only" ]; then
        check_prerequisites
        verify_installation
        print_summary $?
        exit $?
    fi
    
    # Run installation steps
    check_project_dir
    check_prerequisites
    install_skills
    install_hooks
    create_directories
    
    # Skip config if requested
    if [ "${1:-}" != "--skip-config" ]; then
        create_config
    fi
    
    # Verify and summarize
    verify_installation
    print_summary $?
    exit $?
}

# Run main function with all arguments
main "$@"
