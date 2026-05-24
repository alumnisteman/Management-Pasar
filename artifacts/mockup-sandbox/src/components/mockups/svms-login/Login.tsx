import { useState } from "react";
import { Shield, Eye, EyeOff, ArrowRight, Lock, Mail, AlertCircle, CheckCircle, Moon, Sun } from "lucide-react";

type Screen = "login" | "forgot" | "otp" | "reset" | "success";

export function Login() {
  const [screen, setScreen] = useState<Screen>("login");
  const [showPass, setShowPass] = useState(false);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPass, setNewPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");

  const bg = dark ? "#0D1117" : "#F8FAFC";
  const card = dark ? "#161B22" : "#FFFFFF";
  const border = dark ? "#30363D" : "#F1F5F9";
  const heading = dark ? "#F0F6FC" : "#0F172A";
  const body = dark ? "#8B949E" : "#64748B";
  const input = dark ? "#0D1117" : "#F8FAFC";
  const inputBorder = dark ? "#30363D" : "#E2E8F0";
  const inputText = dark ? "#F0F6FC" : "#0F172A";

  const handleLogin = () => {
    let hasErr = false;
    if (!email) { setEmailError("Email wajib diisi"); hasErr = true; } else setEmailError("");
    if (!password) { setPassError("Password wajib diisi"); hasErr = true; } else setPassError("");
    if (hasErr) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); }, 1800);
  };

  const handleForgot = () => {
    if (!email) { setEmailError("Masukkan email terlebih dahulu"); return; }
    setEmailError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setScreen("otp"); }, 1200);
  };

  const handleOtp = () => {
    if (otp.join("").length < 6) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setScreen("reset"); }, 1000);
  };

  const handleReset = () => {
    if (!newPass || newPass.length < 8) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setScreen("success"); }, 1000);
  };

  const inputStyle = (err?: string) => ({
    width: "100%",
    background: input,
    border: `1px solid ${err ? "#EF4444" : inputBorder}`,
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "14px",
    color: inputText,
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
  });

  const btnStyle = (disabled?: boolean) => ({
    width: "100%",
    background: disabled ? "#94A3B8" : "#F59E0B",
    color: disabled ? "#F8FAFC" : "#0F172A",
    fontWeight: "700" as const,
    padding: "13px 0",
    borderRadius: "10px",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "opacity 0.2s",
    opacity: disabled ? 0.7 : 1,
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      transition: "background 0.3s",
      position: "relative",
    }}>

      {/* BG decoration */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "50%",
        background: "linear-gradient(135deg, #020617 0%, #0F172A 100%)",
        zIndex: 0,
      }} />
      <div style={{
        position: "absolute",
        top: "120px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Dark toggle */}
      <button
        onClick={() => setDark(!dark)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          background: dark ? "#F59E0B" : "#1E293B",
          border: "none",
          borderRadius: "8px",
          padding: "8px",
          cursor: "pointer",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {dark
          ? <Sun style={{ width: "16px", height: "16px", color: "#0D1117" }} />
          : <Moon style={{ width: "16px", height: "16px", color: "#F59E0B" }} />
        }
      </button>

      {/* Card */}
      <div style={{
        background: card,
        borderRadius: "20px",
        border: `1px solid ${border}`,
        boxShadow: dark
          ? "0 24px 60px rgba(0,0,0,0.5)"
          : "0 24px 60px rgba(0,0,0,0.10)",
        width: "100%",
        maxWidth: "440px",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
        transition: "background 0.3s, border-color 0.3s",
      }}>

        {/* Top bar */}
        <div style={{
          background: "linear-gradient(135deg, #0F172A, #1E293B)",
          padding: "32px 32px 28px",
          textAlign: "center",
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#F59E0B",
            padding: "12px",
            borderRadius: "14px",
            marginBottom: "16px",
            boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
          }}>
            <Shield style={{ width: "28px", height: "28px", color: "#0F172A" }} />
          </div>
          <div style={{ fontWeight: "800", fontSize: "20px", color: "white", marginBottom: "4px" }}>
            Sistem Manajemen Pasar
          </div>
          <div style={{ color: "#64748B", fontSize: "13px" }}>
            v6.0 — Dinas Pengelolaan Pasar
          </div>
        </div>

        <div style={{ padding: "32px" }}>

          {/* ─── LOGIN SCREEN ─── */}
          {screen === "login" && (
            <>
              <div style={{ marginBottom: "28px" }}>
                <h2 style={{ fontWeight: "800", fontSize: "22px", color: heading, marginBottom: "6px", transition: "color 0.3s" }}>
                  Selamat Datang
                </h2>
                <p style={{ color: body, fontSize: "14px", transition: "color 0.3s" }}>
                  Masuk ke akun Anda untuk melanjutkan
                </p>
              </div>

              {/* Demo credentials banner */}
              <div style={{
                background: dark ? "rgba(245,158,11,0.1)" : "#FFFBEB",
                border: `1px solid ${dark ? "rgba(245,158,11,0.3)" : "#FDE68A"}`,
                borderRadius: "10px",
                padding: "10px 14px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
                <CheckCircle style={{ width: "14px", height: "14px", color: "#F59E0B", flexShrink: 0 }} />
                <span style={{ fontSize: "12px", color: dark ? "#FCD34D" : "#92400E" }}>
                  Demo: <strong>admin@dispasar.go.id</strong> / <strong>Admin@123</strong>
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Email */}
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: heading, display: "block", marginBottom: "6px", transition: "color 0.3s" }}>
                    Email
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail style={{
                      width: "16px", height: "16px", color: "#94A3B8",
                      position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)"
                    }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@dispasar.go.id"
                      style={{ ...inputStyle(emailError), paddingLeft: "38px" }}
                      onFocus={e => (e.target.style.borderColor = "#F59E0B")}
                      onBlur={e => (e.target.style.borderColor = emailError ? "#EF4444" : inputBorder)}
                    />
                  </div>
                  {emailError && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "5px" }}>
                      <AlertCircle style={{ width: "12px", height: "12px", color: "#EF4444" }} />
                      <span style={{ fontSize: "11px", color: "#EF4444" }}>{emailError}</span>
                    </div>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ fontSize: "13px", fontWeight: "600", color: heading, transition: "color 0.3s" }}>
                      Password
                    </label>
                    <button
                      onClick={() => setScreen("forgot")}
                      style={{ background: "transparent", border: "none", color: "#F59E0B", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                    >
                      Lupa password?
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <Lock style={{
                      width: "16px", height: "16px", color: "#94A3B8",
                      position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)"
                    }} />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ ...inputStyle(passError), paddingLeft: "38px", paddingRight: "40px" }}
                      onFocus={e => (e.target.style.borderColor = "#F59E0B")}
                      onBlur={e => (e.target.style.borderColor = passError ? "#EF4444" : inputBorder)}
                      onKeyDown={e => e.key === "Enter" && handleLogin()}
                    />
                    <button
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                        background: "transparent", border: "none", cursor: "pointer", color: "#94A3B8", padding: 0,
                      }}
                    >
                      {showPass
                        ? <EyeOff style={{ width: "16px", height: "16px" }} />
                        : <Eye style={{ width: "16px", height: "16px" }} />
                      }
                    </button>
                  </div>
                  {passError && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "5px" }}>
                      <AlertCircle style={{ width: "12px", height: "12px", color: "#EF4444" }} />
                      <span style={{ fontSize: "11px", color: "#EF4444" }}>{passError}</span>
                    </div>
                  )}
                </div>

                {/* Remember me */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input type="checkbox" id="remember" style={{ accentColor: "#F59E0B", width: "14px", height: "14px" }} />
                  <label htmlFor="remember" style={{ fontSize: "13px", color: body, cursor: "pointer", transition: "color 0.3s" }}>
                    Ingat saya selama 30 hari
                  </label>
                </div>

                {/* Submit */}
                <button
                  style={btnStyle(loading)}
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span style={{
                        width: "16px", height: "16px", border: "2px solid #0F172A",
                        borderTopColor: "transparent", borderRadius: "50%",
                        animation: "spin 0.7s linear infinite", display: "inline-block",
                      }} />
                      Memverifikasi...
                    </>
                  ) : (
                    <>Masuk <ArrowRight style={{ width: "16px", height: "16px" }} /></>
                  )}
                </button>
              </div>

              {/* Roles */}
              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${border}` }}>
                <p style={{ fontSize: "12px", color: body, textAlign: "center", marginBottom: "12px" }}>
                  Akses berdasarkan peran
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { role: "Administrator", color: "#F59E0B" },
                    { role: "Petugas", color: "#2563EB" },
                    { role: "Auditor", color: "#059669" },
                  ].map(r => (
                    <div key={r.role} style={{
                      flex: 1, textAlign: "center", padding: "8px 4px",
                      background: dark ? "#0D1117" : "#F8FAFC",
                      border: `1px solid ${border}`,
                      borderRadius: "8px",
                    }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: r.color, margin: "0 auto 4px" }} />
                      <div style={{ fontSize: "10px", color: body, fontWeight: "600" }}>{r.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ─── FORGOT PASSWORD ─── */}
          {screen === "forgot" && (
            <>
              <button
                onClick={() => { setScreen("login"); setEmailError(""); }}
                style={{ background: "transparent", border: "none", color: "#F59E0B", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginBottom: "20px", display: "flex", alignItems: "center", gap: "4px", padding: 0 }}
              >
                ← Kembali ke login
              </button>
              <h2 style={{ fontWeight: "800", fontSize: "20px", color: heading, marginBottom: "8px" }}>Lupa Password?</h2>
              <p style={{ color: body, fontSize: "14px", marginBottom: "24px", lineHeight: "1.6" }}>
                Masukkan email terdaftar Anda. Kami akan mengirimkan kode OTP 6 digit.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: heading, display: "block", marginBottom: "6px" }}>Email</label>
                  <div style={{ position: "relative" }}>
                    <Mail style={{ width: "16px", height: "16px", color: "#94A3B8", position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@dispasar.go.id"
                      style={{ ...inputStyle(emailError), paddingLeft: "38px" }}
                      onFocus={e => (e.target.style.borderColor = "#F59E0B")}
                      onBlur={e => (e.target.style.borderColor = emailError ? "#EF4444" : inputBorder)}
                    />
                  </div>
                  {emailError && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "5px" }}>
                      <AlertCircle style={{ width: "12px", height: "12px", color: "#EF4444" }} />
                      <span style={{ fontSize: "11px", color: "#EF4444" }}>{emailError}</span>
                    </div>
                  )}
                </div>
                <button style={btnStyle(loading)} onClick={handleForgot} disabled={loading}>
                  {loading ? (
                    <><span style={{ width: "16px", height: "16px", border: "2px solid #0F172A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Mengirim...</>
                  ) : "Kirim Kode OTP"}
                </button>
              </div>
            </>
          )}

          {/* ─── OTP SCREEN ─── */}
          {screen === "otp" && (
            <>
              <h2 style={{ fontWeight: "800", fontSize: "20px", color: heading, marginBottom: "8px" }}>Verifikasi OTP</h2>
              <p style={{ color: body, fontSize: "14px", marginBottom: "8px", lineHeight: "1.6" }}>
                Kode 6 digit telah dikirim ke
              </p>
              <p style={{ color: "#F59E0B", fontSize: "14px", fontWeight: "700", marginBottom: "28px" }}>
                {email || "admin@dispasar.go.id"}
              </p>

              <div style={{ display: "flex", gap: "10px", marginBottom: "24px", justifyContent: "center" }}>
                {otp.map((v, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={v}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/, "");
                      const next = [...otp];
                      next[i] = val;
                      setOtp(next);
                      if (val && i < 5) {
                        (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus();
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) {
                        (document.getElementById(`otp-${i - 1}`) as HTMLInputElement)?.focus();
                      }
                    }}
                    style={{
                      width: "46px", height: "52px", textAlign: "center", fontSize: "20px",
                      fontWeight: "700", borderRadius: "10px",
                      border: `2px solid ${v ? "#F59E0B" : inputBorder}`,
                      background: input, color: inputText, outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#F59E0B")}
                    onBlur={e => (e.target.style.borderColor = otp[i] ? "#F59E0B" : inputBorder)}
                  />
                ))}
              </div>

              <button style={btnStyle(loading || otp.join("").length < 6)} onClick={handleOtp} disabled={loading || otp.join("").length < 6}>
                {loading ? (
                  <><span style={{ width: "16px", height: "16px", border: "2px solid #0F172A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Memverifikasi...</>
                ) : "Verifikasi"}
              </button>

              <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: body }}>
                Tidak menerima kode?{" "}
                <button
                  onClick={() => setScreen("forgot")}
                  style={{ background: "transparent", border: "none", color: "#F59E0B", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}
                >
                  Kirim ulang
                </button>
              </p>
            </>
          )}

          {/* ─── RESET PASSWORD ─── */}
          {screen === "reset" && (
            <>
              <h2 style={{ fontWeight: "800", fontSize: "20px", color: heading, marginBottom: "8px" }}>Buat Password Baru</h2>
              <p style={{ color: body, fontSize: "14px", marginBottom: "24px" }}>
                Password minimal 8 karakter, kombinasi huruf dan angka.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: heading, display: "block", marginBottom: "6px" }}>Password Baru</label>
                  <div style={{ position: "relative" }}>
                    <Lock style={{ width: "16px", height: "16px", color: "#94A3B8", position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      style={{ ...inputStyle(), paddingLeft: "38px", paddingRight: "40px" }}
                      onFocus={e => (e.target.style.borderColor = "#F59E0B")}
                      onBlur={e => (e.target.style.borderColor = inputBorder)}
                    />
                    <button onClick={() => setShowNew(!showNew)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#94A3B8", padding: 0 }}>
                      {showNew ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {newPass.length > 0 && (
                    <div style={{ marginTop: "8px" }}>
                      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} style={{
                            flex: 1, height: "3px", borderRadius: "2px",
                            background: newPass.length >= i * 2
                              ? (newPass.length >= 8 ? "#22C55E" : newPass.length >= 5 ? "#F59E0B" : "#EF4444")
                              : (dark ? "#30363D" : "#E2E8F0"),
                            transition: "background 0.2s",
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: "11px", color: newPass.length >= 8 ? "#22C55E" : newPass.length >= 5 ? "#F59E0B" : "#EF4444" }}>
                        {newPass.length >= 8 ? "Kuat" : newPass.length >= 5 ? "Sedang" : "Lemah"}
                      </span>
                    </div>
                  )}
                </div>
                <button style={btnStyle(loading || newPass.length < 8)} onClick={handleReset} disabled={loading || newPass.length < 8}>
                  {loading ? (
                    <><span style={{ width: "16px", height: "16px", border: "2px solid #0F172A", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Menyimpan...</>
                  ) : "Simpan Password Baru"}
                </button>
              </div>
            </>
          )}

          {/* ─── SUCCESS ─── */}
          {screen === "success" && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{
                width: "72px", height: "72px", background: "#DCFCE7", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
              }}>
                <CheckCircle style={{ width: "36px", height: "36px", color: "#22C55E" }} />
              </div>
              <h2 style={{ fontWeight: "800", fontSize: "20px", color: heading, marginBottom: "8px" }}>Password Berhasil Diubah!</h2>
              <p style={{ color: body, fontSize: "14px", marginBottom: "28px", lineHeight: "1.6" }}>
                Password Anda telah diperbarui. Silakan masuk dengan password baru.
              </p>
              <button style={btnStyle()} onClick={() => { setScreen("login"); setNewPass(""); setOtp(["", "", "", "", "", ""]); }}>
                Kembali ke Login <ArrowRight style={{ width: "16px", height: "16px" }} />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Footer note */}
      <div style={{ position: "absolute", bottom: "20px", left: 0, right: 0, textAlign: "center", zIndex: 1 }}>
        <span style={{ fontSize: "12px", color: dark ? "#475569" : "#94A3B8" }}>
          SVMS v6.0 © 2025 Dinas Pengelolaan Pasar · Sistem dilindungi enkripsi SSL
        </span>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
