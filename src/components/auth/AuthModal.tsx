import { useState, useCallback } from "react";
import { Eye, EyeOff, ShieldCheck, User, Mail, Phone, Lock, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldGroup } from "@/components/ui/input";
import { login, register } from "@/lib/auth";

type Mode = "login" | "register";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultMode?: Mode;
}

const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: "Minimal 8 karakter" },
  { test: (p: string) => /[A-Z]/.test(p), label: "Mengandung huruf kapital" },
  { test: (p: string) => /[0-9]/.test(p), label: "Mengandung angka" },
];

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  const colors = ["bg-red-500", "bg-amber-500", "bg-emerald-500"];
  const labels = ["Lemah", "Sedang", "Kuat"];
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < passed ? colors[passed - 1] : "bg-zinc-700"}`}
          />
        ))}
      </div>
      <p className="text-xs text-zinc-400">
        Kekuatan: <span className={`font-medium ${passed === 3 ? "text-emerald-400" : passed === 2 ? "text-amber-400" : "text-red-400"}`}>{labels[passed - 1] ?? "–"}</span>
      </p>
      <ul className="space-y-1">
        {PASSWORD_RULES.map((r, i) => (
          <li key={i} className={`text-xs flex items-center gap-1.5 ${r.test(password) ? "text-emerald-400" : "text-zinc-500"}`}>
            <span className="text-[10px]">{r.test(password) ? "✓" : "○"}</span>
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AuthModal({ open, onClose, defaultMode = "login" }: Props) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [remember, setRemember] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regForm, setRegForm] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const resetState = useCallback(() => {
    setError("");
    setSuccess("");
    setFieldErrors({});
    setShowPw(false);
    setLoading(false);
  }, []);

  const switchMode = (m: Mode) => {
    setMode(m);
    resetState();
  };

  // Validate email format
  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  // Validate WA number
  const isValidWA = (w: string) => /^(\+62|62|0)8[0-9]{8,12}$/.test(w.replace(/\s/g, ""));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginEmail.trim() || !loginPassword) {
      setError("Isi semua field.");
      return;
    }
    if (!isValidEmail(loginEmail)) {
      setError("Format email tidak valid.");
      return;
    }
    setLoading(true);
    try {
      await login(loginEmail, loginPassword, remember);
      setSuccess("Login berhasil!");
      setTimeout(() => {
        onClose();
        resetState();
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const errs: Record<string, string> = {};

    if (!regForm.fullName.trim()) errs.fullName = "Nama wajib diisi.";
    else if (regForm.fullName.trim().length < 3) errs.fullName = "Nama minimal 3 karakter.";

    if (!regForm.email.trim()) errs.email = "Email wajib diisi.";
    else if (!isValidEmail(regForm.email)) errs.email = "Format email tidak valid.";

    if (!regForm.whatsapp.trim()) errs.whatsapp = "Nomor WhatsApp wajib diisi.";
    else if (!isValidWA(regForm.whatsapp)) errs.whatsapp = "Nomor WA tidak valid. Format: 08xx...";

    if (!regForm.password) errs.password = "Password wajib diisi.";
    else if (regForm.password.length < 8) errs.password = "Password minimal 8 karakter.";
    else if (!PASSWORD_RULES.every((r) => r.test(regForm.password)))
      errs.password = "Password belum memenuhi semua syarat.";

    if (regForm.password !== regForm.confirmPassword)
      errs.confirmPassword = "Password tidak cocok.";

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      await register({
        fullName: regForm.fullName,
        email: regForm.email,
        whatsapp: regForm.whatsapp,
        password: regForm.password,
      });
      setSuccess("Akun berhasil dibuat! Silakan login.");
      setTimeout(() => {
        switchMode("login");
        setLoginEmail(regForm.email);
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="sm">
      {/* Tabs */}
      <div className="flex rounded-xl bg-zinc-800/60 p-1 mb-6">
        {(["login", "register"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              mode === m ? "bg-amber-500 text-black shadow" : "text-zinc-400 hover:text-white"
            }`}
          >
            {m === "login" ? "Masuk" : "Daftar"}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-3 mb-4 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-sm">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 p-3 mb-4 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-sm">
          <ShieldCheck size={16} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {mode === "login" ? (
        <form onSubmit={handleLogin} noValidate className="space-y-4">
          <FieldGroup>
            <Label required>Email</Label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                type="email"
                placeholder="nama@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="email"
                className="pl-9"
                required
              />
            </div>
          </FieldGroup>

          <FieldGroup>
            <Label required>Password</Label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                className="pl-9 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                tabIndex={-1}
                aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </FieldGroup>

          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-zinc-600 bg-zinc-800 accent-amber-500 cursor-pointer"
            />
            <label htmlFor="remember" className="text-sm text-zinc-400 cursor-pointer">
              Ingat saya di perangkat ini
            </label>
          </div>

          <Button type="submit" size="lg" className="w-full mt-2" loading={loading}>
            Masuk
          </Button>

          <p className="text-center text-xs text-zinc-500">
            Belum punya akun?{" "}
            <button type="button" onClick={() => switchMode("register")} className="text-amber-400 hover:underline">
              Daftar sekarang
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister} noValidate className="space-y-3.5">
          <FieldGroup>
            <Label required>Nama Lengkap</Label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Nama Lengkap"
                value={regForm.fullName}
                onChange={(e) => setRegForm((f) => ({ ...f, fullName: e.target.value }))}
                error={fieldErrors.fullName}
                className="pl-9"
                autoComplete="name"
              />
            </div>
          </FieldGroup>

          <FieldGroup>
            <Label required>Email</Label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                type="email"
                placeholder="nama@email.com"
                value={regForm.email}
                onChange={(e) => setRegForm((f) => ({ ...f, email: e.target.value }))}
                error={fieldErrors.email}
                className="pl-9"
                autoComplete="email"
              />
            </div>
          </FieldGroup>

          <FieldGroup>
            <Label required>Nomor WhatsApp</Label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={regForm.whatsapp}
                onChange={(e) => setRegForm((f) => ({ ...f, whatsapp: e.target.value }))}
                error={fieldErrors.whatsapp}
                className="pl-9"
                autoComplete="tel"
              />
            </div>
          </FieldGroup>

          <FieldGroup>
            <Label required>Password</Label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                type={showPw ? "text" : "password"}
                placeholder="Min. 8 karakter"
                value={regForm.password}
                onChange={(e) => setRegForm((f) => ({ ...f, password: e.target.value }))}
                error={fieldErrors.password}
                className="pl-9 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-4 text-zinc-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <PasswordStrength password={regForm.password} />
          </FieldGroup>

          <FieldGroup>
            <Label required>Konfirmasi Password</Label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                type={showPw ? "text" : "password"}
                placeholder="Ulangi password"
                value={regForm.confirmPassword}
                onChange={(e) => setRegForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                error={fieldErrors.confirmPassword}
                className="pl-9"
                autoComplete="new-password"
              />
            </div>
          </FieldGroup>

          <Button type="submit" size="lg" className="w-full mt-1" loading={loading}>
            Buat Akun
          </Button>

          <p className="text-center text-xs text-zinc-500">
            Sudah punya akun?{" "}
            <button type="button" onClick={() => switchMode("login")} className="text-amber-400 hover:underline">
              Masuk
            </button>
          </p>
        </form>
      )}
    </Modal>
  );
}
