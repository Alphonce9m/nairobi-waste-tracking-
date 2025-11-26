import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User, Phone, Building, Recycle, Truck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock user storage (in real app, this would be in a database/backend)
const mockUsers = [
  {
    id: 'demo-user-1',
    email: 'demo@nairobwaste.com',
    password: 'demo123', // In production, use hashed passwords
    name: 'Demo User',
    businessName: 'Demo Waste Collection',
    phone: '+254723065707',
    role: 'customer'
  },
  {
    id: 'collector-1',
    email: 'collector@nairobwaste.com',
    password: 'collector123', // In production, use hashed passwords
    name: 'John Collector',
    businessName: 'Quick Collect Services',
    phone: '+254712345678',
    role: 'collector'
  }
];

const AuthWorking = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
    phone: '',
    name: '',
  });

  // Check if user is already signed in (from localStorage)
  useState(() => {
    const savedUser = localStorage.getItem('nairobiWasteUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsSignedIn(true);
    }
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock database
      const user = mockUsers.find(
        u => u.email === signInForm.email && u.password === signInForm.password
      );

      if (user) {
        // Save user to localStorage
        const userToSave = { ...user, password: undefined }; // Remove password from saved user
        localStorage.setItem('nairobiWasteUser', JSON.stringify(userToSave));
        setCurrentUser(userToSave);
        setIsSignedIn(true);

        toast({
          title: "Welcome back! 🎉",
          description: `Successfully signed in as ${user.name}`,
        });

        // Navigate to home page
        navigate('/home');
      } else {
        toast({
          title: "Sign In Failed ❌",
          description: "Invalid email or password. Try demo@nairobwaste.com / demo123",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sign In Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      // Validate passwords match
      if (signUpForm.password !== signUpForm.confirmPassword) {
        toast({
          title: "Passwords Don't Match",
          description: "Please make sure your passwords match.",
          variant: "destructive",
        });
        setAuthLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === signUpForm.email);
      if (existingUser) {
        toast({
          title: "Account Already Exists",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
        setAuthLoading(false);
        return;
      }

      // Create new user (in real app, this would save to database)
      const newUser = {
        id: `user-${Date.now()}`,
        email: signUpForm.email,
        name: signUpForm.name,
        businessName: signUpForm.businessName,
        phone: signUpForm.phone,
        role: 'customer'
      };

      // Save to localStorage
      localStorage.setItem('nairobiWasteUser', JSON.stringify(newUser));
      setCurrentUser(newUser);
      setIsSignedIn(true);

      toast({
        title: "Account Created! 🎉",
        description: `Welcome to Nairobi Waste Tracking, ${newUser.name}!`,
      });

      // Navigate to home page
      navigate('/home');

    } catch (error) {
      toast({
        title: "Sign Up Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('nairobiWasteUser');
    setCurrentUser(null);
    setIsSignedIn(false);
    
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });

    navigate('/auth');
  };

  // If already signed in, show profile page
  if (isSignedIn && currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-600">{currentUser.name}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{currentUser.email}</p>
              </div>
            </div>
            
            {currentUser.businessName && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Business</p>
                  <p className="font-medium">{currentUser.businessName}</p>
                </div>
              </div>
            )}
            
            {currentUser.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{currentUser.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Recycle className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium capitalize">{currentUser.role || 'Customer'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/home')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              🏠 Go to Dashboard
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              🚪 Sign Out
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Recycle className="h-12 w-12 text-green-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Nairobi Waste Tracking
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            🌍 Sign in to manage your waste collection services
          </p>
        </div>

        <Card className="shadow-xl">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg mb-6">
              <TabsTrigger value="signin" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                🚪 Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                ✨ Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin" className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back! 👋</h2>
                <p className="text-gray-600">Sign in to access your waste collection dashboard</p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <Label htmlFor="signin-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
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
                      placeholder="Enter your password"
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
                  {authLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "🚪 Sign In"
                  )}
                </Button>
              </form>

              {/* Demo Account Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-2">🧪 Demo Account:</p>
                <p className="text-sm text-blue-700">Email: <code>demo@nairobwaste.com</code></p>
                <p className="text-sm text-blue-700">Password: <code>demo123</code></p>
              </div>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account! 🎉</h2>
                <p className="text-gray-600">Join Nairobi's leading waste management platform</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signUpForm.name}
                        onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="john@example.com"
                        value={signUpForm.email}
                        onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="254712345678"
                        value={signUpForm.phone}
                        onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-business">Business Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-business"
                        type="text"
                        placeholder="Your Business Ltd"
                        value={signUpForm.businessName}
                        onChange={(e) => setSignUpForm({ ...signUpForm, businessName: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
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
                        placeholder="Confirm your password"
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
                  {authLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "✨ Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Features */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <Truck className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">Quick Collection</h3>
            <p className="text-sm text-gray-600">Fast waste pickup services</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <Recycle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Eco-Friendly</h3>
            <p className="text-sm text-gray-600">Sustainable waste management</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">Track Orders</h3>
            <p className="text-sm text-gray-600">Real-time order tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthWorking;
