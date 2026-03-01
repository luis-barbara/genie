'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup') {
      setMode('signup');
    }
  }, [searchParams]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setError('');
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setError('');
  };

  const handleLoginSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
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

  const handleSignupSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Sign up failed');
      }

      setMode('login');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthClick = (provider: 'google' | 'github') => {
    console.log(`${mode} with ${provider}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl scale-150"></div>
            <Image
              src="/genie-logo-2.png"
              alt="Genie"
              width={48}
              height={48}
              className="h-12 w-auto relative z-10"
            />
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-1 mb-8 p-1.5 bg-background/40 rounded-xl border border-border/60 backdrop-blur-sm">
          <button
            onClick={() => {
              setMode('login');
              router.push('/auth/login');
            }}
            className={`flex-1 h-10 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-secondary text-secondary-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              router.push('/auth/login?mode=signup');
            }}
            className={`flex-1 h-10 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-secondary text-secondary-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center mb-1 tracking-tight">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {mode === 'login'
            ? 'Sign in to your account to continue'
            : 'Sign up to get started with Genie'}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="login-email"
                className="text-xs uppercase tracking-widest text-muted-foreground/70"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@company.com"
                value={loginData.email}
                onChange={(e) =>
                  handleLoginChange({
                    ...e,
                    target: { ...e.target, id: 'email' },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                required
                disabled={loading}
                className="w-full h-11 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm px-4 text-sm placeholder:text-muted-foreground/60 transition-all focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50 focus-visible:outline-none focus-visible:bg-card hover:border-border/70 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="login-password"
                className="text-xs uppercase tracking-widest text-muted-foreground/70"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  minLength={6}
                  value={loginData.password}
                  onChange={(e) =>
                    handleLoginChange({
                      ...e,
                      target: { ...e.target, id: 'password' },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                  required
                  disabled={loading}
                  className="w-full h-11 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm px-4 pr-11 text-sm placeholder:text-muted-foreground/60 transition-all focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50 focus-visible:outline-none focus-visible:bg-card hover:border-border/70 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors disabled:cursor-not-allowed cursor-pointer"
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
              className="w-full h-11 flex items-center justify-center rounded-lg genie-gradient-bg text-primary-foreground font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 cursor-pointer genie-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card/50 backdrop-blur-xl px-2 text-xs uppercase tracking-widest text-muted-foreground/60">
                  or
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthClick('google')}
                className="flex items-center justify-center gap-2 h-11 rounded-lg border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-200 text-sm font-semibold text-foreground cursor-pointer hover:shadow-md hover:shadow-primary/10"
              >
                <FcGoogle className="h-5 w-5" />
                Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuthClick('github')}
                className="flex items-center justify-center gap-2 h-11 rounded-lg border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-200 text-sm font-semibold text-foreground cursor-pointer hover:shadow-md hover:shadow-primary/10"
              >
                <FaGithub className="h-5 w-5" />
                GitHub
              </button>
            </div>
          </form>
        )}

        {/* Signup Form */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="signup-name"
                className="text-xs uppercase tracking-widest text-muted-foreground/70"
              >
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                placeholder="John Doe"
                value={signupData.name}
                onChange={(e) =>
                  handleSignupChange({
                    ...e,
                    target: { ...e.target, id: 'name' },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                required
                disabled={loading}
                className="w-full h-11 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm px-4 text-sm placeholder:text-muted-foreground/60 transition-all focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50 focus-visible:outline-none focus-visible:bg-card hover:border-border/70 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="signup-email"
                className="text-xs uppercase tracking-widest text-muted-foreground/70"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@company.com"
                value={signupData.email}
                onChange={(e) =>
                  handleSignupChange({
                    ...e,
                    target: { ...e.target, id: 'email' },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                required
                disabled={loading}
                className="w-full h-11 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm px-4 text-sm placeholder:text-muted-foreground/60 transition-all focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50 focus-visible:outline-none focus-visible:bg-card hover:border-border/70 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="signup-password"
                className="text-xs uppercase tracking-widest text-muted-foreground/70"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  minLength={6}
                  value={signupData.password}
                  onChange={(e) =>
                    handleSignupChange({
                      ...e,
                      target: { ...e.target, id: 'password' },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                  required
                  disabled={loading}
                  className="w-full h-11 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm px-4 pr-11 text-sm placeholder:text-muted-foreground/60 transition-all focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50 focus-visible:outline-none focus-visible:bg-card hover:border-border/70 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors disabled:cursor-not-allowed cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="signup-confirm"
                className="text-xs uppercase tracking-widest text-muted-foreground/70"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="signup-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  minLength={6}
                  value={signupData.confirmPassword}
                  onChange={(e) =>
                    handleSignupChange({
                      ...e,
                      target: { ...e.target, id: 'confirmPassword' },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                  required
                  disabled={loading}
                  className="w-full h-11 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm px-4 pr-11 text-sm placeholder:text-muted-foreground/60 transition-all focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50 focus-visible:outline-none focus-visible:bg-card hover:border-border/70 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors disabled:cursor-not-allowed cursor-pointer"
                >
                  {showConfirmPassword ? (
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
              className="w-full h-11 flex items-center justify-center rounded-lg genie-gradient-bg text-primary-foreground font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 cursor-pointer genie-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card/50 backdrop-blur-xl px-2 text-xs uppercase tracking-widest text-muted-foreground/60">
                  or
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthClick('google')}
                className="flex items-center justify-center gap-2 h-11 rounded-lg border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-200 text-sm font-semibold text-foreground cursor-pointer hover:shadow-md hover:shadow-primary/10"
              >
                <FcGoogle className="h-5 w-5" />
                Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuthClick('github')}
                className="flex items-center justify-center gap-2 h-11 rounded-lg border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-200 text-sm font-semibold text-foreground cursor-pointer hover:shadow-md hover:shadow-primary/10"
              >
                <FaGithub className="h-5 w-5" />
                GitHub
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
