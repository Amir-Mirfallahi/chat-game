import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast({
        title: t("translations:login_toast_missing_info_title"),
        description: t("translations:login_toast_missing_info_desc"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
      toast({
        title: t("translations:login_toast_welcome_title"),
        description: t("translations:login_toast_welcome_desc"),
      });
    } catch (error) {
      toast({
        title: t("translations:login_toast_failed_title"),
        description: t("translations:login_toast_failed_desc"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 bounce-in">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t("translations:login_welcome_title")}
          </h1>
          <p className="text-muted-foreground">
            {t("translations:login_subtitle")}
          </p>
        </div>

        {/* Login Form */}
        <Card className="card-playful">
          <CardHeader>
            <CardTitle className="text-center text-xl">{t("translations:login_sign_in")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-base font-semibold">
                  {t("translations:login_username")}
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t("translations:login_placeholder_username")}
                  className="h-12 text-lg rounded-xl border-2 focus:border-primary"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold">
                  {t("translations:login_password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("translations:login_placeholder_password")}
                    className="h-12 text-lg rounded-xl border-2 focus:border-primary pr-12"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="btn-playful w-full h-14 text-xl"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : t("translations:login_button")}
              </Button>
            </form>
            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {t("translations:login_no_account")} {" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  {t("translations:login_sign_up_here")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
