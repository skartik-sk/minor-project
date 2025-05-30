"use client";

import { auth, googleProvider, db } from "@/lib/utils";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import SessionLoading from "@/components/session-checking";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FirebaseError } from "firebase/app";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCriteria, setShowCriteria] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [enrollment, setEnrollment] = useState("");

  const router = useRouter();

  const ADMIN_EMAIL = "admin.cse@gmail.com";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if user is admin and redirect accordingly
        if (user.email === ADMIN_EMAIL) {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard");
        }
      } else setCheckingAuth(false);
    });
    return () => unsub();
  }, [router]);

  const criteria = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "Uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "Lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "Number",
      valid: /[0-9]/.test(password),
    },
    {
      label: "Special character",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const allValid = criteria.every((c) => c.valid);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Redirect based on user role
      if (user.email === ADMIN_EMAIL) {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      const code = (error as FirebaseError).code || "auth/unknown";
      const shortCode = code.replace("auth/", "");
      const formattedMessage = shortCode
        .replaceAll("-", " ")
        .replace(/^./, (str: string) => str.toUpperCase());
      toast.error(formattedMessage);
    }
  };

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        enrollment,
      });
      
      // Redirect based on user role
      if (user.email === ADMIN_EMAIL) {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      const code = (error as FirebaseError).code || "auth/unknown";
      const shortCode = code.replace("auth/", "");
      const formattedMessage = shortCode
        .replaceAll("-", " ")
        .replace(/^./, (str: string) => str.toUpperCase());
      toast.error(formattedMessage);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
      });
      
      // Redirect based on user role
      if (user.email === ADMIN_EMAIL) {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(`${mode} with Google failed:`, error); // Log the full error for debugging
      let errorMessage = "Google authentication failed. Please try again.";
      if (error instanceof FirebaseError) {
        const shortCode = error.code.replace("auth/", "");
        errorMessage = shortCode
          .replaceAll("-", " ")
          .replace(/^./, (str: string) => str.toUpperCase());
      } else if (error instanceof Error) {
        // Fallback for other types of errors
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === "login") {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return <SessionLoading />;
  }
  return (
    <div className="flex min-h-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {mode === "login" ? "Login" : "Create an account"}
          </CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Enter your credentials to sign in"
              : "Fill the form to create a new account"}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollment">Enrollment Number</Label>
                  <Input
                    id="enrollment"
                    placeholder="Enter your enrollment number"
                    value={enrollment}
                    onChange={(e) => setEnrollment(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                
              </div>
                   <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => mode === "signup" && setShowCriteria(true)}
                required
              />

                  {mode === "signup" && showCriteria && (
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {criteria.map((c) => (
                    <Badge
                      key={c.label}
                      variant={c.valid ? "outline" : "destructive"}
                      className="flex items-center space-x-2"
                    >
                      {c.valid ? <Check size={16} /> : <X size={16} />}
                      <span className="text-sm">{c.label}</span>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading || (mode === "signup" && !allValid)
              }
            >
              {isLoading
                ? mode === "login"
                  ? "Logging in..."
                  : "Creating account..."
                : mode === "login"
                ? "Login"
                : "Create account"}
            </Button>
            {/* <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              {isLoading
                ? mode === "login"
                  ? "Signing in with Google..."
                  : "Signing up with Google..."
                : "Continue with Google"}
            </Button> */}
            <p className="text-sm text-center text-muted-foreground pt-2">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <span
                    className="text-primary hover:underline font-medium cursor-pointer"
                    onClick={() => setMode("signup")}
                  >
                    Sign up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    className="text-primary hover:underline font-medium cursor-pointer"
                    onClick={() => setMode("login")}
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
