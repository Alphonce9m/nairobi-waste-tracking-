import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/contexts/SupabaseContext";
import { authService } from "@/services/authService";
import { Loader2, Mail, Lock, User, Phone, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { user, loading } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(false);

  // Sign In Form
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  });

  // Sign Up Form
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: '',
    contactPerson: '',
    phoneNumber: '',
    address: '',
  });

  // Reset Password Form
  const [resetEmail, setResetEmail] = useState('');

  // If already logged in, redirect to marketplace
  if (user && !loading) {
    navigate('/marketplace');
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      await authService.signIn(signInForm.email, signInForm.password);
      toast({
        title: "Welcome back!",
        description: "You've been successfully signed in",
      });
      navigate('/marketplace');
    } catch (error: unknown) {
      const errorData = error as { message: string };
      toast({
        title: "Sign in failed",
        description: errorData.message,
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      setAuthLoading(false);
      return;
    }

    try {
      await authService.signUp(signUpForm.email, signUpForm.password, {
        business_name: signUpForm.businessName,
        business_type: signUpForm.businessType,
        contact_person: signUpForm.contactPerson,
        phone_number: signUpForm.phoneNumber,
        address: signUpForm.address,
      });

      toast({
        title: "Account created! 🎉",
        description: (
          <div className="space-y-2">
            <p>We've sent a verification email to <strong>{signUpForm.email}</strong></p>
            <p className="font-semibold text-yellow-600">Important: Check your inbox and click the verification link to activate your account.</p>
            <p className="text-sm text-muted-foreground">Can't find the email? Check your spam/junk folder.</p>
          </div>
        ),
        duration: 10000, // Show for 10 seconds
      });

      // Reset form
      setSignUpForm({
        email: '',
        password: '',
        confirmPassword: '',
        businessName: '',
        businessType: '',
        contactPerson: '',
        phoneNumber: '',
        address: '',
      });
    } catch (error: unknown) {
      const errorData = error as { message: string };
      toast({
        title: "Sign up failed",
        description: errorData.message,
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      await authService.resetPassword(resetEmail);
      toast({
        title: "Reset email sent",
        description: "Check your email for password reset instructions",
      });
      setResetEmail('');
    } catch (error: unknown) {
      const errorData = error as { message: string };
      toast({
        title: "Reset failed",
        description: errorData.message,
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error: unknown) {
      const errorData = error as { message: string };
      toast({
        title: "Google sign in failed",
        description: errorData.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Nairobi Waste Marketplace
            </h1>
            <p className="text-muted-foreground">
              Connect, trade, and transform waste into value
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="reset">Reset</TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={signInForm.email}
                      onChange={(e) => setSignInForm({...signInForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={signInForm.password}
                      onChange={(e) => setSignInForm({...signInForm, password: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business-name">Business Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="business-name"
                        placeholder="Your business name"
                        className="pl-10"
                        value={signUpForm.businessName}
                        onChange={(e) => setSignUpForm({...signUpForm, businessName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="business-type">Business Type</Label>
                    <select
                      id="business-type"
                      className="w-full p-2 border rounded-md"
                      value={signUpForm.businessType}
                      onChange={(e) => setSignUpForm({...signUpForm, businessType: e.target.value})}
                      required
                    >
                      <option value="">Select type</option>
                      <option value="recycler">Recycler</option>
                      <option value="manufacturer">Manufacturer</option>
                      <option value="retailer">Retailer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact-person">Contact Person</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contact-person"
                        placeholder="Full name"
                        className="pl-10"
                        value={signUpForm.contactPerson}
                        onChange={(e) => setSignUpForm({...signUpForm, contactPerson: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+254 700 000 000"
                        className="pl-10"
                        value={signUpForm.phoneNumber}
                        onChange={(e) => setSignUpForm({...signUpForm, phoneNumber: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Your business address in Nairobi"
                    value={signUpForm.address}
                    onChange={(e) => setSignUpForm({...signUpForm, address: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={signUpForm.password}
                        onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={signUpForm.confirmPassword}
                        onChange={(e) => setSignUpForm({...signUpForm, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Reset Password Tab */}
            <TabsContent value="reset" className="mt-6">
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="reset-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset email...
                    </>
                  ) : (
                    "Send Reset Email"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
