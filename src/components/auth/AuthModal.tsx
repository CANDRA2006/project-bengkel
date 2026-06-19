import { useState, useCallback, useEffect } from "react";
import { Eye, EyeOff, ShieldCheck, User, Mail, Phone, Lock, AlertTriangle, RefreshCw, ArrowLeft, CheckCircle2, Crown } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { login, register, verifyOtp, resendOtp, forgotPassword } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type Mode = "login" | "register" | "otp" | "forgot" | "forgot-sent";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: "Minimal 8 karakter" },
  { test: (p: string) => /[A-Z]/.test(p), label: "Huruf kapital" },
  { test: (p: string) => /[0-9]/.test(p), label: "Mengandung angka" },
];

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const colors = ["bg-red-500", "bg-amber-500", "bg-emerald-500"];
  const labels = ["Lemah", "Sedang", "Kuat"];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0,1,2].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < passed ? colors[passed-1] : "bg-zinc-700"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-500">Kekuatan password:</span>
        <span className={`font-medium ${passed===3?"text-emerald-400":passed===2?"text-amber-400":"text-red-400"}`}>{labels[passed-1]??"-"}</span>
      </div>
    </div>
  );
}

export function AuthModal({ open, onClose, defaultMode = "login" }: Props) {
  const { t } = useTranslation();
  const { refresh } = useAuth();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // Register
  const [regForm, setRegForm] = useState({ fullName: "", email: "", whatsapp: "", password: "", confirmPassword: "" });

  // OTP
  const [otpEmail, setOtpEmail] = useState("");
  const [otpValues, setOtpValues] = useState(["","","","","",""]);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [devOtp, setDevOtp] = useState(""); // Dev mode: show OTP

  // Forgot
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    if (open) { setMode(defaultMode); setError(""); setSuccess(""); }
  }, [open, defaultMode]);

  useEffect(() => {
    if (otpCountdown > 0) { const t = setTimeout(() => setOtpCountdown(c => c - 1), 1000); return () => clearTimeout(t); }
  }, [otpCountdown]);

  const resetErr = () => { setError(""); setSuccess(""); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); resetErr();
    if (!loginEmail || !loginPassword) { setError("Isi semua field."); return; }
    setLoading(true);
    try {
      await login(loginEmail, loginPassword, remember);
      refresh();
      onClose();
    } catch (err: any) {
      const msg: string = err.message || "";
      if (msg.startsWith("EMAIL_NOT_VERIFIED:")) {
        const email = msg.split(":")[1];
        setOtpEmail(email);
        setMode("otp");
        const newOtp = await resendOtp(email);
        setDevOtp(newOtp);
        setOtpCountdown(60);
      } else {
        setError(msg);
      }
    } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); resetErr();
    const { fullName, email, whatsapp, password, confirmPassword } = regForm;
    if (!fullName || !email || !whatsapp || !password) { setError("Isi semua field."); return; }
    if (password !== confirmPassword) { setError("Password tidak cocok."); return; }
    if (password.length < 8) { setError("Password minimal 8 karakter."); return; }
    setLoading(true);
    try {
      const { otp } = await register({ fullName, email, whatsapp, password });
      setOtpEmail(email);
      setDevOtp(otp);
      setOtpCountdown(60);
      setMode("otp");
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleOtpInput = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otpValues];
    next[idx] = val.slice(-1);
    setOtpValues(next);
    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx+1}`);
      nextInput?.focus();
    }
    // Auto-submit when all filled
    if (next.every(v => v) && val) handleVerifyOtp(next.join(""));
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[idx] && idx > 0) {
      document.getElementById(`otp-${idx-1}`)?.focus();
    }
  };

  const handleVerifyOtp = async (code?: string) => {
    const otp = code || otpValues.join("");
    if (otp.length !== 6) { setError("Masukkan 6 digit OTP."); return; }
    setLoading(true); resetErr();
    try {
      await verifyOtp(otpEmail, otp);
      setSuccess("Email terverifikasi! Silakan login.");
      setTimeout(() => setMode("login"), 1500);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleResendOtp = async () => {
    if (otpCountdown > 0) return;
    setLoading(true); resetErr();
    try {
      const newOtp = await resendOtp(otpEmail);
      setDevOtp(newOtp);
      setOtpCountdown(60);
      setSuccess("OTP baru telah dikirim.");
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault(); resetErr();
    if (!forgotEmail) { setError("Masukkan email."); return; }
    setLoading(true);
    try {
      const token = await forgotPassword(forgotEmail);
      setResetToken(token);
      setMode("forgot-sent");
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full bg-zinc-900/80 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all duration-200";

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(245,158,11,0.35)]">
            {mode === "otp" ? <ShieldCheck size={22} className="text-[#0a0a0a]" /> :
             mode === "forgot" || mode === "forgot-sent" ? <Lock size={22} className="text-[#0a0a0a]" /> :
             <User size={22} className="text-[#0a0a0a]" />}
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === "login" ? t("auth.login") :
             mode === "register" ? t("auth.register") :
             mode === "otp" ? t("auth.otpTitle") :
             mode === "forgot" ? t("auth.forgotTitle") :
             "Email Terkirim"}
          </h2>
          {mode === "otp" && (
            <p className="text-sm text-zinc-400 mt-1">
              {t("auth.otpDesc", { email: otpEmail })}
            </p>
          )}
          {mode === "login" && (
            <p className="text-xs text-zinc-600 mt-2 bg-zinc-900 rounded-lg px-3 py-2 text-left">
              <span className="text-amber-500">Demo:</span> {t("auth.adminEmail")}<br/>
              <span className="text-amber-500">Demo:</span> {t("auth.adminPass")}
            </p>
          )}
        </div>

        {/* Error/Success */}
        {error && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
            <AlertTriangle size={14} /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm animate-fade-in">
            <CheckCircle2 size={14} /> {success}
          </div>
        )}

        {/* Dev OTP notice */}
        {devOtp && mode === "otp" && (
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
            <p className="font-semibold mb-1">🔧 Mode Demo — OTP:</p>
            <p className="font-mono text-xl text-blue-400 font-bold tracking-widest">{devOtp}</p>
            <p className="text-xs text-blue-500/70 mt-1">Dalam produksi, OTP dikirim ke email</p>
          </div>
        )}

        {/* Login Form */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="email" placeholder={t("auth.email")} value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className={cn(inputCls, "pl-10")} />
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type={showPw ? "text" : "password"} placeholder={t("auth.password")} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className={cn(inputCls, "pl-10 pr-10")} />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-3.5 h-3.5 accent-amber-500" />
                {t("auth.rememberMe")}
              </label>
              <button type="button" onClick={() => { setMode("forgot"); resetErr(); }} className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                {t("auth.forgotPassword")}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all duration-200 shadow-[0_4px_16px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {loading ? <span className="flex items-center justify-center gap-2"><RefreshCw size={14} className="animate-spin" /> Memproses...</span> : t("auth.loginBtn")}
            </button>
            <p className="text-center text-sm text-zinc-500">
              {t("auth.noAccount")}{" "}
              <button type="button" onClick={() => { setMode("register"); resetErr(); }} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                {t("auth.registerBtn")}
              </button>
            </p>
          </form>
        )}

        {/* Register Form */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="text" placeholder={t("auth.fullName")} value={regForm.fullName} onChange={e => setRegForm(p => ({...p, fullName: e.target.value}))} className={cn(inputCls, "pl-10")} />
            </div>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="email" placeholder={t("auth.email")} value={regForm.email} onChange={e => setRegForm(p => ({...p, email: e.target.value}))} className={cn(inputCls, "pl-10")} />
            </div>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="tel" placeholder={t("auth.whatsapp")} value={regForm.whatsapp} onChange={e => setRegForm(p => ({...p, whatsapp: e.target.value}))} className={cn(inputCls, "pl-10")} />
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type={showPw ? "text" : "password"} placeholder={t("auth.password")} value={regForm.password} onChange={e => setRegForm(p => ({...p, password: e.target.value}))} className={cn(inputCls, "pl-10 pr-10")} />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {regForm.password && <PasswordStrength password={regForm.password} />}
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="password" placeholder="Konfirmasi password" value={regForm.confirmPassword} onChange={e => setRegForm(p => ({...p, confirmPassword: e.target.value}))} className={cn(inputCls, "pl-10")} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all duration-200 shadow-[0_4px_16px_rgba(245,158,11,0.3)] disabled:opacity-50 text-sm">
              {loading ? <span className="flex items-center justify-center gap-2"><RefreshCw size={14} className="animate-spin" /> Memproses...</span> : t("auth.registerBtn")}
            </button>
            <p className="text-center text-sm text-zinc-500">
              {t("auth.hasAccount")}{" "}
              <button type="button" onClick={() => { setMode("login"); resetErr(); }} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                {t("auth.loginBtn")}
              </button>
            </p>
          </form>
        )}

        {/* OTP Form */}
        {mode === "otp" && (
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              {otpValues.map((v, i) => (
                <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={v}
                  onChange={e => handleOtpInput(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className={cn(
                    "w-12 h-14 text-center text-xl font-bold rounded-xl border transition-all duration-200 focus:outline-none",
                    v ? "bg-amber-500/10 border-amber-500/50 text-amber-400" : "bg-zinc-900 border-white/[0.08] text-white",
                    "focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  )}
                />
              ))}
            </div>
            <button onClick={() => handleVerifyOtp()} disabled={loading || otpValues.some(v => !v)} className="w-full py-3 rounded-xl font-bold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500 disabled:opacity-50 text-sm transition-all duration-200">
              {loading ? <span className="flex items-center justify-center gap-2"><RefreshCw size={14} className="animate-spin" /> Memverifikasi...</span> : t("auth.otpVerify")}
            </button>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-zinc-500">{t("auth.otpResend")}</span>
              {otpCountdown > 0
                ? <span className="text-amber-500 font-mono">{otpCountdown}s</span>
                : <button onClick={handleResendOtp} disabled={loading} className="text-amber-400 hover:text-amber-300 font-medium transition-colors">Kirim ulang</button>
              }
            </div>
            <button onClick={() => setMode("login")} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 mx-auto transition-colors">
              <ArrowLeft size={14} /> Kembali ke Login
            </button>
          </div>
        )}

        {/* Forgot Password Form */}
        {mode === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-sm text-zinc-400">{t("auth.forgotDesc")}</p>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="email" placeholder={t("auth.email")} value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className={cn(inputCls, "pl-10")} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-[#0a0a0a] bg-gradient-to-r from-amber-400 to-orange-500 disabled:opacity-50 text-sm">
              {loading ? "Memproses..." : "Kirim Link Reset"}
            </button>
            <button type="button" onClick={() => { setMode("login"); resetErr(); }} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 mx-auto transition-colors">
              <ArrowLeft size={14} /> Kembali ke Login
            </button>
          </form>
        )}

        {/* Forgot Sent */}
        {mode === "forgot-sent" && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} className="text-emerald-400" />
            </div>
            <p className="text-zinc-300">Email reset password telah dikirim ke <span className="text-white font-medium">{forgotEmail}</span></p>
            {resetToken && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-left">
                <p className="text-xs text-blue-400 font-semibold mb-1">🔧 Mode Demo — Reset Token:</p>
                <p className="font-mono text-xs text-blue-300 break-all">{resetToken}</p>
              </div>
            )}
            <button onClick={() => { setMode("login"); resetErr(); }} className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors">
              Kembali ke Login
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
