import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateOtp, register as registerUser, login } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "Register — Bengkel Harun" },
      { name: "description", content: "Buat akun Bengkel Harun." },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  email: z.string().trim().email("Email tidak valid").max(120),
  whatsapp: z.string().trim().regex(/^(\+?62|0)8\d{8,12}$/, "Nomor WhatsApp tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").max(80),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});
type Form = z.infer<typeof schema>;

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otpSent, setOtpSent] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [formData, setFormData] = useState<Form | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    await new Promise((r) => setTimeout(r, 400));
    const code = generateOtp();
    setOtpSent(code);
    setFormData(data);
    setStep("otp");
    toast.success(`Kode OTP telah dikirim ke WhatsApp (simulasi: ${code})`, { duration: 8000 });
  };

  const verifyOtp = async () => {
    if (otpInput !== otpSent) {
      toast.error("Kode OTP salah");
      return;
    }
    if (!formData) return;
    try {
      registerUser({
        fullName: formData.fullName,
        email: formData.email,
        whatsapp: formData.whatsapp,
        password: formData.password,
      });
      login(formData.email, formData.password, true);
      toast.success("Akun berhasil dibuat!");
      navigate({ to: "/" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Pendaftaran gagal");
    }
  };

  if (step === "otp") {
    return (
      <AuthLayout
        title="Verifikasi WhatsApp"
        subtitle={`Kami mengirim kode 6 digit ke ${formData?.whatsapp}. Masukkan di bawah.`}
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-accent/10 border border-accent/30 p-4 text-xs text-accent-foreground">
            <p className="flex items-center gap-2"><MessageCircle className="size-4 text-accent" /> <strong>Mode simulasi:</strong> kode OTP: <span className="font-mono font-bold">{otpSent}</span></p>
          </div>
          <div>
            <Label htmlFor="otp">Kode OTP</Label>
            <Input
              id="otp"
              maxLength={6}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="mt-1.5 text-center tracking-[0.5em] font-mono text-lg"
            />
          </div>
          <Button onClick={verifyOtp} className="w-full bg-gradient-to-r from-brand to-accent text-brand-foreground btn-glow h-11">
            Verifikasi & Daftar
          </Button>
          <button onClick={() => setStep("form")} className="w-full text-sm text-muted-foreground hover:text-foreground">
            ← Ganti data
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Daftar untuk akses booking lebih cepat dan riwayat servis."
      footer={<>Sudah punya akun? <Link to="/auth/login" className="text-brand hover:underline">Masuk</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Nama Lengkap</Label>
          <Input id="fullName" {...register("fullName")} placeholder="Budi Santoso" className="mt-1.5" />
          {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} placeholder="nama@email.com" className="mt-1.5" />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
          <Input id="whatsapp" type="tel" {...register("whatsapp")} placeholder="08xxxxxxxxxx" className="mt-1.5" />
          {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} className="mt-1.5" />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Konfirmasi</Label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="mt-1.5" />
            {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-brand to-accent text-brand-foreground btn-glow h-11">
          {isSubmitting && <Loader2 className="animate-spin" />} Lanjutkan
        </Button>
      </form>
    </AuthLayout>
  );
}
