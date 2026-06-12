import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [{ title: "Lupa Password — Bengkel Harun" }, { name: "description", content: "Reset password Bengkel Harun." }],
  }),
  component: ForgotPasswordPage,
});

const schema = z.object({ email: z.string().trim().email("Email tidak valid") });
type Form = z.infer<typeof schema>;

function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success(`Tautan reset password (simulasi) dikirim ke ${data.email}`);
    reset();
  };

  return (
    <AuthLayout
      title="Lupa Password?"
      subtitle="Masukkan email Anda, kami akan mengirim instruksi reset password."
      footer={<>Ingat password? <Link to="/auth/login" className="text-brand hover:underline">Masuk</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} placeholder="nama@email.com" className="mt-1.5" />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-brand to-accent text-brand-foreground btn-glow h-11">
          {isSubmitting && <Loader2 className="animate-spin" />} Kirim Instruksi
        </Button>
      </form>
    </AuthLayout>
  );
}
