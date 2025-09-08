"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiGithub, SiGoogle } from "react-icons/si";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { isCredentialsAuthEnabled } from "@/lib/auth";

export default function SignForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const t = useTranslations();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Registration
        if (password !== confirmPassword) {
          setError(t('sign_modal.password_mismatch'));
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, nickname: nickname || email.split('@')[0] }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || t('sign_modal.registration_error'));
          setLoading(false);
          return;
        }

        // After successful registration, sign in
        const signInResult = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (signInResult?.error) {
          setError(signInResult.error);
        } else {
          window.location.reload();
        }
      } else {
        // Sign in
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid email or password');
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Something went wrong');
    }

    setLoading(false);
  };

  const credentialsEnabled = isCredentialsAuthEnabled();
  const googleEnabled = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true";
  const githubEnabled = process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === "true";
  const hasOAuthProviders = googleEnabled || githubEnabled;


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {isSignUp ? t("sign_modal.sign_up_title") : t("sign_modal.sign_in_title")}
          </CardTitle>
          <CardDescription>
            {isSignUp ? t("sign_modal.sign_up_description") : t("sign_modal.sign_in_description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* OAuth Providers */}
            {hasOAuthProviders && (
              <div className="flex flex-col gap-4">
                {googleEnabled && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => signIn("google")}
                  >
                    <SiGoogle className="w-4 h-4" />
                    {t("sign_modal.google_sign_in")}
                  </Button>
                )}
                {githubEnabled && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => signIn("github")}
                  >
                    <SiGithub className="w-4 h-4" />
                    {t("sign_modal.github_sign_in")}
                  </Button>
                )}
              </div>
            )}

            {/* Divider */}
            {credentialsEnabled && hasOAuthProviders && (
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  {t("sign_modal.or")}
                </span>
              </div>
            )}

            {/* Email/Password Form */}
            {credentialsEnabled && (
              <form onSubmit={handleEmailAuth} className="grid gap-4">
                {error && (
                  <div className="text-sm text-red-500 text-center">{error}</div>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="email">{t("sign_modal.email_title")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("sign_modal.email_placeholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {isSignUp && (
                  <div className="grid gap-2">
                    <Label htmlFor="nickname">Nickname (optional)</Label>
                    <Input
                      id="nickname"
                      type="text"
                      placeholder="Your display name"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">{t("sign_modal.password_title")}</Label>
                    {!isSignUp && (
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        {t("sign_modal.forgot_password")}
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("sign_modal.password_placeholder")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {isSignUp && (
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">{t("sign_modal.confirm_password_title")}</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("sign_modal.confirm_password_placeholder")}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t("sign_modal.loading") : (isSignUp ? t("sign_modal.sign_up_button") : t("sign_modal.sign_in_button"))}
                </Button>
              </form>
            )}

            {/* Toggle between sign in and sign up */}
            {credentialsEnabled && (
              <div className="text-center text-sm">
                {isSignUp ? t("sign_modal.have_account") : t("sign_modal.no_account")}{" "}
                <button
                  type="button"
                  className="underline underline-offset-4 hover:text-primary"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  disabled={loading}
                >
                  {isSignUp ? t("sign_modal.sign_in_link") : t("sign_modal.sign_up_link")}
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{" "}
        <a href="/terms-of-service" target="_blank">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" target="_blank">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
