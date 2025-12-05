import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { secureStorage } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validatePassword, sanitizeInput } from "@/utils/validation";
import { Mail, Lock, Recycle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useSupabase } from "@/contexts/SupabaseContext";

const AuthSupabase = () => {
  const { user, loading } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const supabase = createClient();

  const [authLoading, setAuthLoading] = useState(false);

  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });
  const [signInRole, setSignInRole] = useState<"buyer" | "seller" | null>(
    secureStorage.getRole()
  );

  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer" as "buyer" | "seller",
  });
  const [lastSignedUpEmail, setLastSignedUpEmail] = useState("");
  const [showSignInButton, setShowSignInButton] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      // Validate inputs
      const sanitizedEmail = sanitizeInput(signInForm.email);
      const sanitizedPassword = sanitizeInput(signInForm.password);

      if (!validateEmail(sanitizedEmail)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return;
      }

      const passwordValidation = validatePassword(sanitizedPassword);
      if (!passwordValidation.valid) {
        toast({
          title: "Invalid Password",
          description: passwordValidation.errors.join(", "),
          variant: "destructive",
        });
        return;
      }

      console.log("AuthSupabase: attempting sign in with", sanitizedEmail);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      console.log("AuthSupabase: supabase response", { data, error });

      if (error || !data.session) {
        let description = error?.message || "Invalid email or password";

        if (error?.message?.toLowerCase().includes("invalid login credentials")) {
          description = "Account not found or incorrect password. Please sign up first or check your credentials.";
        } else if (error?.message?.toLowerCase().includes("email not confirmed")) {
          description = "Please confirm your email first, then try signing in again.";
        }

        console.error("AuthSupabase: sign in failed", error);
        toast({
          title: "Sign In Failed",
          description,
          variant: "destructive",
        });

        // Authentication failed, no fallback to demo account
        return;
      }

      console.log("AuthSupabase: sign in succeeded, session", data.session);
      toast({
        title: "Welcome back!",
        description: `Signed in as ${sanitizedEmail}`,
      });

      // Default to buyer; user can switch in marketplace
      const roleToSet = signInRole || "buyer";
      secureStorage.setRole(roleToSet);
      console.log("AuthSupabase: set role, waiting for Supabase user before navigating");

      // Retry loop: wait until Supabase context updates with the user
      let attempts = 0;
      const maxAttempts = 20; // 2 seconds max
      const checkUser = () => {
        attempts++;
        console.log(`AuthSupabase: checking Supabase user, attempt ${attempts}`);
        // Re-fetch current session to verify
        supabase.auth.getSession().then(({ data: { session } }) => {
          console.log("AuthSupabase: getSession result", !!session);
          if (session) {
            console.log("AuthSupabase: session exists, navigating to /marketplace");
            try {
              navigate("/marketplace");
              console.log("AuthSupabase: navigate called");
            } catch (navError) {
              console.error("AuthSupabase: navigate error", navError);
              console.log("AuthSupabase: fallback using window.location");
              window.location.href = "/marketplace";
            }
          } else if (attempts < maxAttempts) {
            setTimeout(checkUser, 100);
          } else {
            console.error("AuthSupabase: failed to get session after retries, forcing redirect");
            window.location.href = "/marketplace";
          }
        });
      };
      setTimeout(checkUser, 100);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      // Validate inputs
      const sanitizedEmail = sanitizeInput(signUpForm.email);
      const sanitizedPassword = sanitizeInput(signUpForm.password);
      const sanitizedConfirmPassword = sanitizeInput(signUpForm.confirmPassword);

      if (!validateEmail(sanitizedEmail)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return;
      }

      const passwordValidation = validatePassword(sanitizedPassword);
      if (!passwordValidation.valid) {
        toast({
          title: "Invalid Password",
          description: passwordValidation.errors.join(", "),
          variant: "destructive",
        });
        return;
      }

      if (sanitizedPassword !== sanitizedConfirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Please make sure your passwords are the same.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: sanitizedPassword,
        options: {
          emailConfirm: false,
          data: {},
        } as any,
      });

      if (error || !data.user) {
        toast({
          title: "Sign Up Failed",
          description: error?.message || "Unable to create account",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account created!",
        description: `You can now sign in as a ${signUpForm.role}.`,
      });

      // Store role and reset form
      secureStorage.setRole(signUpForm.role);
      setLastSignedUpEmail(signUpForm.email);
      setSignUpForm({ email: "", password: "", confirmPassword: "", role: "buyer" });
      setShowSignInButton(true);
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md p-8 shadow-xl text-center space-y-6">
          <div>
            <Recycle className="h-10 w-10 text-green-600 mx-auto mb-2" />
            <h2 className="text-2xl font-bold">You are already signed in</h2>
            <p className="text-gray-600 break-all">{user.email}</p>
          </div>
          <div className="space-y-3">
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => navigate("/marketplace")}>Go to Marketplace</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Recycle className="h-12 w-12 text-green-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Nairobi Waste Tracking
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Sign in or create an account to access the marketplace</p>
        </div>

        <Card className="shadow-xl">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg mb-6">
              <TabsTrigger value="signin" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="p-8">
              <form onSubmit={handleSignIn} className="space-y-6">
                {!signInRole && (
                  <div>
                    <Label>I am a:</Label>
                    <div className="flex gap-4 mt-2">
                      <Button
                        type="button"
                        variant={signInRole === "buyer" ? "default" : "outline"}
                        onClick={() => setSignInRole("buyer")}
                        className="flex-1"
                      >
                        Buyer
                      </Button>
                      <Button
                        type="button"
                        variant={signInRole === "seller" ? "default" : "outline"}
                        onClick={() => setSignInRole("seller")}
                        className="flex-1"
                      >
                        Seller
                      </Button>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signInForm.email}
                      onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Your password"
                      value={signInForm.password}
                      onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 py-3"
                  disabled={authLoading}
                >
                  {authLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="p-8">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div>
                  <Label>I am signing up as:</Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      type="button"
                      variant={signUpForm.role === "buyer" ? "default" : "outline"}
                      onClick={() => setSignUpForm({ ...signUpForm, role: "buyer" })}
                      className="flex-1"
                    >
                      Buyer
                    </Button>
                    <Button
                      type="button"
                      variant={signUpForm.role === "seller" ? "default" : "outline"}
                      onClick={() => setSignUpForm({ ...signUpForm, role: "seller" })}
                      className="flex-1"
                    >
                      Seller
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={signUpForm.password}
                        onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Repeat password"
                        value={signUpForm.confirmPassword}
                        onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                        className="pl-10"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 py-3"
                  disabled={authLoading}
                >
                  {authLoading ? "Creating account..." : "Create Account"}
                </Button>

                {showSignInButton && (
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full py-3"
                      onClick={() => {
                        setSignInForm({ email: lastSignedUpEmail, password: "" });
                        setShowSignInButton(false);
                      }}
                    >
                      Sign In Now
                    </Button>
                  </div>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </Card>

      </div>
    </div>
  );
};

export default AuthSupabase;
