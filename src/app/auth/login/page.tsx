'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Sign in failed');
      }

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: 'google' | 'github') => {
    console.log(`Sign in with ${provider}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150"></div>
            <Image
              src="/genie-logo-2.png"
              alt="Genie"
              width={48}
              height={48}
              className="h-12 w-auto relative z-10"
            />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center mb-1 tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Sign in to your account to continue
        </p>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('google')}
            className="flex items-center justify-center gap-2 h-10 rounded-lg border border-border/60 bg-background/60 hover:bg-accent/40 transition-colors text-sm font-medium text-foreground"
          >
            <FcGoogle className="h-4 w-4" />
            Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn('github')}
            className="flex items-center justify-center gap-2 h-10 rounded-lg border border-border/60 bg-background/60 hover:bg-accent/40 transition-colors text-sm font-medium text-foreground"
          >
            <FaGithub className="h-4 w-4" />
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/40"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card/50 backdrop-blur-xl px-2 text-xs uppercase tracking-widest text-muted-foreground/60">
              or
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-xs uppercase tracking-widest text-muted-foreground/70"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full h-10 rounded-md border border-border/40 bg-background/50 px-3 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-xs uppercase tracking-widest text-muted-foreground/70"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                minLength={6}
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full h-10 rounded-md border border-border/40 bg-background/50 px-3 pr-9 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors disabled:cursor-not-allowed"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 flex items-center justify-center rounded-md genie-gradient-bg text-primary-foreground font-semibold hover:opacity-90 transition-all genie-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-primary font-semibold hover:text-primary/80">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
