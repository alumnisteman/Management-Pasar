# SMOS Skill (Smart Market Operating System)

This skill allows OpenClaw to monitor and manage market operations for SVMS v6.0.

## API Configuration
- **Base URL**: `http://103.175.219.57:8001/api`
- **Auth**: Bearer Token required for protected actions.

## Available Actions

### 1. get_market_pulse
**Description**: Get a real-time summary of revenue, occupancy, and violations.
**Endpoint**: `GET /market/occupancy` and `GET /market/payments`
**Prompt**: "Berikan ringkasan performa pasar hari ini."

### 2. check_violations
**Description**: List all suspended stalls or illegal traders.
**Endpoint**: `GET /market/occupancy` (suspended count) or `GET /reports`
**Prompt**: "Apakah ada pelanggaran atau kios yang disuspensi hari ini?"

### 3. verify_trader
**Description**: Check if a permit number is valid and active.
**Endpoint**: `GET /verify-smos/{permit_number}`
**Arguments**: `permit_number`
**Prompt**: "Verifikasi izin pedagang dengan nomor {permit_number}."

### 4. issue_broadcast
**Description**: Send a notification to all dashboard users (Admin/Officer).
**Endpoint**: `POST /market/broadcast`
**Arguments**: `message`
**Prompt**: "Kirim pesan broadcast ke semua petugas: {message}"

### 5. audit_logs
**Description**: View recent system activity logs.
**Endpoint**: `GET /market/audit`
**Prompt**: "Tampilkan log audit sistem terbaru."

## Execution Logic
1. OpenClaw uses `curl` or `fetch` to interact with the endpoints.
2. For `verify_trader`, parse the JSON response: `status: true` means valid.
3. For `get_market_pulse`, summarize: "Okupansi {occupancy_rate}%, Pendapatan Rp {total_revenue}."

## Security Notes
- Use `admin@svms.id` token for broadcast and settings.
- Only report public data if unauthorized.
