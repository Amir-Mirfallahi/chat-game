import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  Baby,
  Globe,
  ArrowUp10,
  FileText,
} from "lucide-react";
import type { RegisterRequest } from "@/services/auth";
import { Textarea } from "@/components/ui/textarea";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "other", label: "Other" },
];

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    childName: "",
    childAge: "",
    conversationPrompt: "",
    // childnative_language: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register, isAuthenticated } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Child age validation
    if (!formData.childAge) {
      newErrors.childAge = "Child's age is required";
    } else {
      const age = parseInt(formData.childAge);
      if (isNaN(age) || age < 1 || age > 8) {
        newErrors.childAge = "Please enter a valid age between 1 and 8";
      }
    }

    // Child name validation
    if (!formData.childName) {
      newErrors.childName = "Child's name is required";
    } else if (formData.childName.length <= 3) {
      newErrors.childName = "Child's name must have at least 3 characters";
    }

    // Native language validation
    // if (!formData.childnative_language) {
    //   newErrors.childnative_language =
    //     "Please select your child's native language";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  // const handleSelectChange =
  //   (field: keyof typeof formData) => (value: string) => {
  //     setFormData((prev) => ({ ...prev, [field]: value }));
  //     // Clear error when user makes selection
  //     if (errors[field]) {
  //       setErrors((prev) => ({ ...prev, [field]: "" }));
  //     }
  //   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check the form fields and try again",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.username, formData.password, formData.email, [
        {
          age: parseInt(formData.childAge),
          name: formData.childName,
          conversation_prompt: formData.conversationPrompt,
          native_language: "en",
        },
      ]);
      toast({
        title: "Welcome aboard! 🎉",
        description: "Your account has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
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
            Join the Adventure!
          </h1>
          <p className="text-muted-foreground">
            Create your account and start learning 🌟
          </p>
        </div>

        {/* Registration Form */}
        <Card className="card-playful">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-base font-semibold">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange("username")}
                    placeholder="Choose a username"
                    className={`h-12 text-lg rounded-xl border-2 focus:border-primary pl-12 ${
                      errors.username ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    placeholder="Enter your email"
                    className={`h-12 text-lg rounded-xl border-2 focus:border-primary pl-12 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    placeholder="Create a password"
                    className={`h-12 text-lg rounded-xl border-2 focus:border-primary pl-12 pr-12 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-base font-semibold"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange("confirmPassword")}
                    placeholder="Confirm your password"
                    className={`h-12 text-lg rounded-xl border-2 focus:border-primary pl-12 pr-12 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Child Profile Section */}
              <div className="border-t pt-4 mt-6">
                <h3 className="text-lg font-semibold mb-4 text-center text-foreground">
                  About Your Child 👶
                </h3>

                {/* Child Name Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="childName"
                    className="text-base font-semibold"
                  >
                    Child's Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="childName"
                      type="text"
                      value={formData.childName}
                      onChange={handleInputChange("childName")}
                      placeholder="Enter child's name"
                      className={`h-12 text-lg rounded-xl border-2 focus:border-primary pl-12 ${
                        errors.childName ? "border-red-500" : ""
                      }`}
                      disabled={isLoading}
                    />
                    <Baby className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                  {errors.childName && (
                    <p className="text-red-500 text-sm">{errors.childName}</p>
                  )}
                </div>

                {/* Child Age Field */}
                <div className="space-y-2">
                  <Label htmlFor="childAge" className="text-base font-semibold">
                    Child's Age
                  </Label>
                  <div className="relative">
                    <Input
                      id="childAge"
                      type="number"
                      min="1"
                      max="8"
                      value={formData.childAge}
                      onChange={handleInputChange("childAge")}
                      placeholder="Enter age (1-8)"
                      className={`h-12 text-lg rounded-xl border-2 focus:border-primary pl-12 ${
                        errors.childAge ? "border-red-500" : ""
                      }`}
                      disabled={isLoading}
                    />
                    <ArrowUp10 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                  {errors.childAge && (
                    <p className="text-red-500 text-sm">{errors.childAge}</p>
                  )}
                </div>

                {/* Child Custom Conversation Prompt */}
                <div className="space-y-2">
                  <Label
                    htmlFor="conversationPrompt"
                    className="text-base font-semibold"
                  >
                    Custom Conversation Prompt (optional)
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="conversationPrompt"
                      value={formData.conversationPrompt}
                      onChange={handleInputChange("conversationPrompt")}
                      placeholder="Enter a custom prompt for each conversation"
                      className={`h-12 rounded-xl border-2 focus:border-primary pl-12 ${
                        errors.conversationPrompt ? "border-red-500" : ""
                      }`}
                      disabled={isLoading}
                    />
                    <FileText className="absolute left-3 top-5 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                  {errors.conversationPrompt && (
                    <p className="text-red-500 text-sm">
                      {errors.conversationPrompt}
                    </p>
                  )}
                </div>

                {/* Native Language Field */}
                {/* <div className="space-y-2">
                  <Label
                    htmlFor="childnative_language"
                    className="text-base font-semibold"
                  >
                    Child's Native Language
                  </Label>
                  <div className="relative">
                    <Select
                      value={formData.childnative_language}
                      onValueChange={handleSelectChange("childnative_language")}
                      disabled={isLoading}
                    >
                      <SelectTrigger
                        className={`h-12 text-lg rounded-xl border-2 focus:border-primary pl-12 ${
                          errors.childnative_language ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select native language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                  {errors.childnative_language && (
                    <p className="text-red-500 text-sm">
                      {errors.childnative_language}
                    </p>
                  )}
                </div> */}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="btn-playful w-full h-14 text-xl mt-6"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  "Start Learning! 🚀"
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
