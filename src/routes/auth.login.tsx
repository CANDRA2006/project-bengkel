import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Login — Bengkel Harun" },
      { name: "description", content: "Masuk ke akun Bengkel Harun." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  remember: z.boolean().optional(),
});
type Form = z.infer<typeof schema>;

function LoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { remember: true },
  });

  const onSubmit = async (data: Form) => {
    try {
      await new Promise((r) => setTimeout(r, 500));
      const user = login(data.email, data.password, !!data.remember);
      toast.success(`Selamat datang, ${user.fullName.split(" ")[0]}!`);
      navigate({ to: "/" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Login gagal");
    }
  };

  return (
    <AuthLayout
      title="Selamat Datang"
      subtitle="Masuk untuk mengakses booking dan riwayat servis Anda."
      footer={<>Belum punya akun? <Link to="/auth/register" className="text-brand hover:underline">Daftar di sini</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="nama@email.com" {...register("email")} className="mt-1.5" />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1.5">
            <Input id="password" type={show ? "text" : "password"} placeholder="••••••••" {...register("password")} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox {...register("remember")} defaultChecked />
            <span>Remember me</span>
          </label>
          <Link to="/auth/forgot-password" className="text-sm text-brand hover:underline">Lupa password?</Link>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-brand to-accent text-brand-foreground btn-glow h-11">
          {isSubmitting && <Loader2 className="animate-spin" />} Masuk
        </Button>
      </form>
    </AuthLayout>
  );
}
