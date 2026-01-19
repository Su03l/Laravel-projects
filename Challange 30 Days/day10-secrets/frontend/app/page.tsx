'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import Button from '@/components/ui/Button';
import { Shield, ArrowRight, Check, Lock, User, Zap } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const features = [
    {
      icon: Lock,
      title: 'Secure Authentication',
      description: 'Token-based auth with Laravel Sanctum',
    },
    {
      icon: User,
      title: 'Dual Login',
      description: 'Login with email or username',
    },
    {
      icon: Zap,
      title: 'Fast & Modern',
      description: 'Built with Next.js 16+ and TypeScript',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-neutral-900">Identity Hub</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-full text-sm text-neutral-600 mb-6">
            <Check className="w-4 h-4 text-green-600" />
            Secure & Modern Authentication
          </div>

          <h1 className="text-5xl font-bold text-neutral-900 leading-tight">
            Identity Management<br />
            <span className="text-neutral-400">Made Simple</span>
          </h1>

          <p className="mt-6 text-lg text-neutral-500 max-w-2xl mx-auto">
            A powerful, secure authentication system with dual login support,
            profile management, and token-based security built on Laravel Sanctum.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg">
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900">Features</h2>
            <p className="mt-3 text-neutral-500">Everything you need for secure authentication</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-2xl border border-neutral-200"
              >
                <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-neutral-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-500 text-sm">
            <Shield className="w-4 h-4" />
            Identity Hub
          </div>
          <p className="text-sm text-neutral-400">
            30 Days Challenge - Day 10
          </p>
        </div>
      </footer>
    </div>
  );
}
