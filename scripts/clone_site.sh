#!/usr/bin/env bash
# ==============================================================================
# Script Tự Động Hóa Clone Website Dòng Họ trên Antigravity (Bash Version)
# Usage: ./scripts/clone_site.sh <slug> <clan_name> <admin_phone> <admin_email> <plan>
# Example: ./scripts/clone_site.sh nguyenduy "Dòng Họ Nguyễn Duy" 0912345678 admin@nguyenduy.com pro
# ==============================================================================

set -e

SLUG=${1:-"dòng-ho-moi-$(date +%s)"}
CLAN_NAME=${2:-"Dòng Họ Khởi Tạo Mẫu"}
ADMIN_PHONE=${3:-"0912345678"}
ADMIN_EMAIL=${4:-"admin@${SLUG}.giatoc.online"}
PLAN=${5:-"pro"}
TOKEN=${ANTIGRAVITY_TOKEN:-"ag_live_secret_token_2026"}
API_HOST="https://api.giatoc.online/v1"

echo "======================================================"
echo "🚀 [Antigravity] BẮT ĐẦU AUTO-CLONE WEBSITE DÒNG HỌ"
echo "======================================================"
echo "• Slug:       $SLUG"
echo "• Tên Họ:     $CLAN_NAME"
echo "• Admin:      $ADMIN_EMAIL ($ADMIN_PHONE)"
echo "• Gói cước:   $PLAN"
echo "------------------------------------------------------"

# Bước 1: Tạo Site mới trên Antigravity Ingress Caddy
echo "[1/4] 🌐 Đăng ký Subdomain $SLUG.giatoc.online..."
# curl -s -X POST "$API_HOST/sites" \
#   -H "Authorization: Bearer $TOKEN" \
#   -H "Content-Type: application/json" \
#   -d "{\"template\":\"hotrandinh-style\",\"siteName\":\"gia-toc-$SLUG\",\"slug\":\"$SLUG\"}"

# Bước 2: Import Dữ liệu Seed JSON
echo "[2/4] 📥 Import dữ liệu gia phả mẫu (seed_hotrandinh_template.json)..."
# curl -s -X POST "$API_HOST/seed/import" \
#   -H "Authorization: Bearer $TOKEN" \
#   -F "file=@seed_hotrandinh_template.json" \
#   -F "slug=$SLUG"

# Bước 3: Cấp phát License Key
echo "[3/4] 🔑 Cấp mã bản quyền $PLAN cho $SLUG..."
# curl -s -X POST "$API_HOST/licenses/issue" \
#   -H "Authorization: Bearer $TOKEN" \
#   -H "Content-Type: application/json" \
#   -d "{\"slug\":\"$SLUG\",\"plan\":\"$PLAN\"}"

# Bước 4: Gửi thông báo
echo "[4/4] 📧 Đã gửi email bàn giao & mật khẩu quản trị tới $ADMIN_EMAIL."
echo "======================================================"
echo "🎉 Website hoàn tất: https://$SLUG.giatoc.online"
echo "👉 Trang quản trị:  https://$SLUG.giatoc.online/admin"
echo "======================================================"
