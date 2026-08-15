import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Calendar, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signInWithUsername, signUpWithUsername } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginUsername || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await signInWithUsername(loginUsername, loginPassword);
    setLoading(false);

    if (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please check your username and password.');
    } else {
      toast.success('Login successful!');
      navigate('/');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupUsername || !signupPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (signupPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (signupPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const { error } = await signUpWithUsername(signupUsername, signupPassword);

    if (error) {
      setLoading(false);
      toast.error(error.message || 'Signup failed');
    } else {
      // Auto-login after signup
      const { error: loginError } = await signInWithUsername(signupUsername, signupPassword);
      setLoading(false);

      if (loginError) {
        toast.error('Account created but login failed. Please try logging in.');
      } else {
        toast.success('Account created successfully!');
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/30 px-4 py-12 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <Calendar className="h-10 w-10 text-primary group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(0,191,255,0.8)]" />
            <span className="font-bold text-3xl gradient-text tracking-tighter">Smart Timetable</span>
          </Link>
          <p className="text-muted-foreground font-medium">Elevate your academic scheduling</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="glass-effect border-primary/20">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold tracking-tight">Login</CardTitle>
                  <CardDescription>Enter your credentials to access your timetable</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username or Email</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="e.g., aishwarya2007ps"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      disabled={loading}
                      autoComplete="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={loading}
                        autoComplete="current-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
                    <p>Default login: <span className="text-primary font-mono select-all">aishwarya2007ps</span></p>
                    <p className="mt-1">Hint: Password is the one you recently set.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full neon-glow font-semibold" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Log into System'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card className="glass-effect border-primary/20">
              <form onSubmit={handleSignup}>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold tracking-tight">Sign Up</CardTitle>
                  <CardDescription>Create a new account to get started</CardDescription>
                  <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-md">
                    <p className="text-xs text-primary font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Admin Tip: The first user to sign up will automatically become the system Administrator.
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="Choose a username"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Only letters, numbers, and underscores allowed
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Choose a password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      At least 6 characters
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full neon-glow font-semibold" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Initialize Account'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
