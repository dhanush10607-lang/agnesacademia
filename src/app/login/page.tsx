"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { BookOpen, GraduationCap, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100svh-4rem)] w-full flex flex-col bg-background lg:flex-row">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col overflow-hidden border-r bg-primary/5 p-8 dark:bg-primary/10 lg:flex xl:p-10">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen" />
        </div>

        <Link href="/" className="relative z-20 flex items-center gap-2 w-max group">
          <div className="bg-primary p-2 rounded-xl text-primary-foreground group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight">AGNES ACADEMIA</span>
        </Link>

        <div className="relative z-20 mt-auto flex flex-col gap-4 xl:gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-3 xl:space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur border text-sm font-medium shadow-sm">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span>St. Agnes College (Autonomous)</span>
            </div>
            <h1 className="text-4xl font-heading font-bold leading-[1.1] tracking-tight xl:text-5xl">
              Your gateway to academic excellence.
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Access your personalized dashboard, course materials, question papers, and stay updated with the latest college announcements.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col">
        {/* Form Container */}
        <div className="flex flex-1 items-center justify-center p-4 sm:p-8 lg:p-7 xl:p-12">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto flex w-full max-w-[400px] flex-col justify-center space-y-4 lg:space-y-3 xl:space-y-6"
          >
            <motion.div variants={fadeUp} className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-heading font-bold tracking-tight xl:text-3xl">
                Welcome back
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your credentials to sign in to your account
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <LoginForm />
            </motion.div>

            <motion.div variants={fadeUp} className="pt-2 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-4 flex justify-center border-t pt-4 xl:mt-8 xl:pt-6">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
