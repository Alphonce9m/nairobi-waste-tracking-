import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { secureStorage } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validatePassword, sanitizeInput } from "@/utils/validation";
import { Mail, Lock, Recycle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { AuthState, initialAuthState, SignInFormData, SignUpFormData, UserRole } from "@/types/auth";
import { useSupabase } from "@/contexts/SupabaseContext";

// Use types from @/types/auth

const Auth: React.FC = () => {
  const { user, loading } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const supabase = createClient();

  const [state, setState] = useState<AuthState>(initialAuthState);
  
  // Destructure state for easier access
  const {
    signIn,
    signUp,
    resetEmail,
    resetStatus,
    signInRole,
    showForgotPassword,
    showSignInButton,
    lastSignedUpEmail,
    authLoading
  } = state;

  // Helper function to update state
  const updateState = (updates: Partial<AuthState>): void => {
    setState(prev => ({
      ...prev,
      ...updates,
      // Handle nested state updates
      ...(updates.signIn && { signIn: { ...prev.signIn, ...updates.signIn } }),
      ...(updates.signUp && { signUp: { ...prev.signUp, ...updates.signUp } }),
    }));
  };

  // Handle role selection
  const handleRoleSelect = (role: UserRole) => {
    if (role) {
      updateState({
        signInRole: role
      });
      // Optionally store the role in secure storage if needed
      // secureStorage.setRole(role);
    }
  };

  // Handle form input changes
  const handleSignInEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({
      signIn: {
        ...signIn,
        email: e.target.value
      }
    });
  };

  const handleSignInPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({
      signIn: {
        ...signIn,
        password: e.target.value
      }
    });
  };

  // Handle sign up form changes
  const handleSignUpEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({
      signUp: {
        ...signUp,
        email: e.target.value
      }
    });
  };

  const handleSignUpPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({
      signUp: {
        ...signUp,
        password: e.target.value
      }
    });
  };

  const handleSignUpConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({
      signUp: {
        ...signUp,
        confirmPassword: e.target.value
      }
    });
  };

  const handleForgotPassword = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateEmail(resetEmail)) {
      updateState({
        resetStatus: { type: 'error', message: 'Please enter a valid email address' },
      });
      return;
    }

    updateState({ 
      authLoading: true,
      resetStatus: null
    });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      updateState({
        resetStatus: {
        type: 'success',
        message: 'Password reset email sent! Please check your inbox.',
      },
      authLoading: false
    });
    } catch (error) {
      updateState({
        resetStatus: {
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to send reset email',
        },
        authLoading: false
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(signIn.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validatePassword(signIn.password)) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    updateState({ authLoading: true });
    try {
      const sanitizedEmail = sanitizeInput(signIn.email);
      const sanitizedPassword = sanitizeInput(signIn.password);

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

      // Handle role selection
  const handleRoleSelect = (role: UserRole) => {
    if (role) {
      updateState({
        signInRole: role
      });
      secureStorage.setRole(role);
    }
  };

  // Set the role for sign in
  if (signInRole) {
    secureStorage.setRole(signInRole);
  }

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
      updateState({ authLoading: false });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(signUp.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validatePassword(signUp.password)) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (signUp.password !== signUp.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    updateState({ authLoading: true });

    try {
      const sanitizedEmail = sanitizeInput(signUp.email);
      const sanitizedPassword = sanitizeInput(signUp.password);

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: sanitizedPassword,
        options: {
          data: {
            full_name: signUp.fullName,
            role: signUp.role,
            phone: signUp.phone,
          },
        },
      });

      if (error || !data.user) {
        throw error || new Error("Failed to create user");
      }

      // Create user profile in the database
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            email: sanitizedEmail,
            full_name: signUp.fullName,
            role: signUp.role,
            phone: signUp.phone,
            updated_at: new Date().toISOString(),
          });

        if (profileError) throw profileError;
      }

      toast({
        title: "Account created!",
        description: `You can now sign in as a ${signUp.role}.`,
      });

      // Reset form
      updateState({
        lastSignedUpEmail: signUp.email,
        signUp: {
          ...signUp,
          email: "",
          password: "",
          confirmPassword: ""
        },
        showSignInButton: true,
        authLoading: false
      });

    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Error creating account",
        description: error?.message || "Unable to create account",
        variant: "destructive",
      });
      updateState({ authLoading: false });
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
                        onClick={() => handleRoleSelect("buyer")}
                        className="flex-1"
                      >
                        Buyer
                      </Button>
                      <Button
                        type="button"
                        variant={signInRole === "seller" ? "default" : "outline"}
                        onClick={() => handleRoleSelect("seller")}
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
                      value={signIn.email}
                      onChange={handleSignInEmailChange}
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
                      value={signIn.password}
                      onChange={handleSignInPasswordChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={authLoading}>
                    {authLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => updateState({ showForgotPassword: true })}
                    className="text-sm text-blue-600 hover:underline text-center"
                  >
                    Forgot password?
                  </button>
                </div>
              </form>
            </TabsContent>

            {showForgotPassword && (
              <TabsContent value="signin">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                      Reset Password
                    </CardTitle>
                    <CardDescription className="text-center">
                      Enter your email and we'll send you a link to reset your password.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resetStatus && (
                      <div className={`p-3 rounded-md ${
                        resetStatus.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {resetStatus.message}
                      </div>
                    )}
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="your@email.com"
                          value={resetEmail}
                          onChange={(e) => updateState({ resetEmail: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button type="submit" className="w-full" disabled={authLoading}>
                          {authLoading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                        <button
                          type="button"
                          onClick={() => updateState({ showForgotPassword: false, resetStatus: null })}
                          className="text-sm text-gray-600 hover:underline text-center"
                        >
                          Back to Sign In
                        </button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="signup" className="p-8">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div>
                  <Label>I am signing up as:</Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      type="button"
                      variant={signUp.role === "buyer" ? "default" : "outline"}
                      onClick={() => updateState({
                        signUp: {
                          ...signUp,
                          role: "buyer"
                        }
                      })}
                      className="flex-1"
                    >
                      Buyer
                    </Button>
                    <Button
                      type="button"
                      variant={signUp.role === "seller" ? "default" : "outline"}
                      onClick={() => updateState({
                        signUp: {
                          ...signUp,
                          role: "seller"
                        }
                      })}
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
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={signUp.email}
                      onChange={handleSignUpEmailChange}
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
                        value={signUp.password}
                        onChange={handleSignUpPasswordChange}
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
                        value={signUp.confirmPassword}
                        onChange={handleSignUpConfirmPasswordChange}
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
                        updateState({
                          signIn: {
                            ...signIn,
                            email: lastSignedUpEmail,
                            password: ""
                          },
                          showSignInButton: false
                        });
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

export default Auth;
