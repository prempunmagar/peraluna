import { PeralunaLogo } from '@/components/auth/peraluna-logo';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl shadow-primary/5 backdrop-blur-sm">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <PeralunaLogo />
          </div>

          {/* Welcome Text */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue planning your perfect trip
            </p>
          </div>

          {/* Login Form */}
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          By continuing, you agree to Peraluna&apos;s Terms of Service and
          Privacy Policy
        </p>
      </div>
    </div>
  );
}
