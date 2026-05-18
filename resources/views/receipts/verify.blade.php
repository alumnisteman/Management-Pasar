<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Kuitansi SMOS - {{ $receipt_number ?? 'Tidak Valid' }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0b0f19;
            --card-bg: #151d30;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --success: #10b981;
            --success-glow: rgba(16, 185, 129, 0.15);
            --fail: #ef4444;
            --fail-glow: rgba(239, 68, 68, 0.15);
            --border: #1e293b;
            --accent: #3b82f6;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            overflow-x: hidden;
            position: relative;
        }

        /* Abstract Premium Background Elements */
        body::before {
            content: '';
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
            top: -100px;
            left: -100px;
            opacity: 0.15;
            z-index: 0;
            pointer-events: none;
        }

        body::after {
            content: '';
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, var(--success) 0%, transparent 70%);
            bottom: -100px;
            right: -100px;
            opacity: 0.1;
            z-index: 0;
            pointer-events: none;
        }

        .container {
            width: 100%;
            max-width: 520px;
            z-index: 10;
        }

        .card {
            background-color: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 40px 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
            position: relative;
            overflow: hidden;
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Status Header Badge */
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 0.875rem;
            margin-bottom: 24px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }

        .status-badge.verified {
            background-color: rgba(16, 185, 129, 0.1);
            color: var(--success);
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-badge.failed {
            background-color: rgba(239, 68, 68, 0.1);
            color: var(--fail);
            border: 1px solid rgba(239, 68, 68, 0.2);
        }

        /* Verification Circle Icon */
        .icon-circle {
            width: 96px;
            height: 96px;
            border-radius: 50%;
            margin: 0 auto 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }

        .icon-circle.verified {
            background-color: var(--success-glow);
            border: 2px solid var(--success);
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
        }

        .icon-circle.failed {
            background-color: var(--fail-glow);
            border: 2px solid var(--fail);
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
        }

        .icon-circle svg {
            width: 48px;
            height: 48px;
            stroke-width: 2.5;
        }

        .title {
            font-size: 1.75rem;
            font-weight: 800;
            margin-bottom: 8px;
            letter-spacing: -0.02em;
        }

        .subtitle {
            color: var(--text-secondary);
            font-size: 0.95rem;
            margin-bottom: 32px;
        }

        /* Detail List */
        .details-wrapper {
            border: 1px solid var(--border);
            border-radius: 16px;
            background-color: rgba(11, 15, 25, 0.4);
            margin-bottom: 28px;
            text-align: left;
            overflow: hidden;
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border);
            font-size: 0.95rem;
        }

        .detail-row:last-child {
            border-bottom: none;
        }

        .detail-label {
            color: var(--text-secondary);
            font-weight: 400;
        }

        .detail-value {
            font-weight: 600;
            color: var(--text-primary);
        }

        /* Security Verification Details */
        .security-box {
            background-color: rgba(59, 130, 246, 0.05);
            border: 1px dashed rgba(59, 130, 246, 0.2);
            border-radius: 16px;
            padding: 16px 20px;
            text-align: left;
            margin-bottom: 32px;
        }

        .security-title {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .security-hash {
            font-family: monospace;
            font-size: 0.75rem;
            color: var(--text-secondary);
            word-break: break-all;
            line-height: 1.4;
        }

        /* Footer Brand */
        .footer-brand {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            font-size: 0.85rem;
            color: var(--text-secondary);
        }

        .footer-brand span {
            font-weight: 800;
            color: var(--text-primary);
        }

        /* Scan Animations */
        .scan-line {
            width: 100%;
            height: 2px;
            background: linear-gradient(to right, transparent, var(--success), transparent);
            position: absolute;
            left: 0;
            top: 0;
            animation: scan 3s infinite linear;
            pointer-events: none;
        }

        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
    </style>
</head>
<body>

<div class="container">
    <div class="card">
        @if($success && $is_authentic)
            <div class="scan-line"></div>

            <div class="status-badge verified">
                ✓ Terverifikasi Asli
            </div>

            <div class="icon-circle verified">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>

            <h1 class="title">Kuitansi Valid</h1>
            <p class="subtitle">Kuitansi ini resmi terdaftar di sistem retribusi SMOS.</p>

            <div class="details-wrapper">
                <div class="detail-row">
                    <span class="detail-label">Nomor Kuitansi</span>
                    <span class="detail-value">{{ $receipt_number }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Pedagang</span>
                    <span class="detail-value">{{ $transaction['trader'] }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Nominal Retribusi</span>
                    <span class="detail-value">Rp {{ number_format($transaction['amount'], 0, ',', '.') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Kode Lapak / Slot</span>
                    <span class="detail-value">{{ $transaction['slot'] }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Lokasi Pasar</span>
                    <span class="detail-value">{{ $transaction['market'] }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Waktu Transaksi</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($transaction['transaction_time'])->isoFormat('D MMMM YYYY, HH:mm') }} WIB</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Metode Pembayaran</span>
                    <span class="detail-value" style="text-transform: uppercase;">{{ $transaction['payment_method'] }}</span>
                </div>
            </div>

            <div class="security-box">
                <div class="security-title">
                    <svg xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Tanda Tangan Kriptografis (HMAC-SHA256)
                </div>
                <div class="security-hash">
                    {{ $security['signature'] }}
                </div>
            </div>
        @else
            <div class="status-badge failed">
                ✗ Verifikasi Gagal
            </div>

            <div class="icon-circle failed">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>

            <h1 class="title">Kuitansi Tidak Sah</h1>
            <p class="subtitle" style="margin-bottom: 24px;">Data kuitansi ini telah diubah, palsu, atau tidak terdaftar secara resmi.</p>
            
            <p class="detail-label" style="text-align: center; margin-bottom: 32px; font-size: 0.95rem;">
                {{ $message ?? 'Kunci kriptografi kuitansi tidak valid atau tidak cocok dengan basis data SMOS.' }}
            </p>
        @endif

        <div class="footer-brand">
            Platform Retribusi Digital <span>SMOS Enterprise v6</span>
        </div>
    </div>
</div>

</body>
</html>
