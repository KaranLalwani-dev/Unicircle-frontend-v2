import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Users, Mail, Lock, Eye, EyeOff, User, Phone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const YEARS = ["FIRST_YEAR", "SECOND_YEAR", "THIRD_YEAR", "FOURTH_YEAR"];
const BRANCHES = ["CSE", "AI", "DS", "CYS", "IT", "ECE", "ME", "CE", "EE"];

const formatYear = (val: string) => {
  switch (val) {
    case "FIRST_YEAR": return "1st Year";
    case "SECOND_YEAR": return "2nd Year";
    case "THIRD_YEAR": return "3rd Year";
    case "FOURTH_YEAR": return "4th Year";
    default: return val;
  }
};

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [instagramId, setInstagramId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();
    const trimmedInstagram = instagramId.trim();
    const trimmedPhone = phoneNumber.trim();
    
    // 1. Basic empty check
    if (isLogin) {
      if (!trimmedEmail || !trimmedPassword) {
        setError("Please enter both email and password.");
        return;
      }
    } else {
      if (!trimmedEmail || !trimmedPassword || !trimmedName || !year || !branch) {
        setError("Please fill out all required fields.");
        return;
      }
    }

    // 2. Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@learner\.manipal\.edu$/i.test(trimmedEmail)) {
      setError("Please login with your college email ID (@learner.manipal.edu).");
      return;
    }

    // 3. Name & Phone validation (for signup)
    if (!isLogin) {
      if (trimmedName.length < 2) {
        setError("Name must be at least 2 characters long.");
        return;
      }
      if (/^\d/.test(trimmedName)) {
        setError("Name cannot start with a number.");
        return;
      }
      if (!/[a-zA-Z]/.test(trimmedName)) {
        setError("Name must contain at least one letter.");
        return;
      }
      if (trimmedPhone && !/^\+?[0-9]{10,15}$/.test(trimmedPhone)) {
        setError("Please enter a valid phone number.");
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login({ username: trimmedEmail, password: trimmedPassword });
        navigate("/discover");
      } else {
        await signup({
          username: trimmedEmail,
          password: trimmedPassword,
          name: trimmedName,
          year,
          branch,
          instagramId: trimmedInstagram || undefined,
          phoneNumber: trimmedPhone || undefined
        });
        toast({ 
          title: "Sign up successful!", 
          description: "Please log in to your new account to continue." 
        });
        setIsLogin(true);
        setPassword(""); // Clear password for security, let them re-enter to login
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.status === 400) {
        setError(err.message || "Invalid input data. Please check your details.");
      } else if (err.status === 401) {
        setError("The email or password you entered is incorrect.");
      } else if (err.status === 408) {
        setError("The server took too long to respond. Please try again.");
      } else if (err.status === 409) {
        setError("An account with this email already exists.");
      } else {
        if (isLogin) {
          toast({ title: "Account not found", description: "Please create an account to join the community." });
          setIsLogin(false);
        } else {
          toast({ variant: "destructive", title: "Error", description: err.message || "A network error occurred. Please try again." });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Users className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Unicircle</h1>
          <p className="mt-2 text-muted-foreground">MIT Bengaluru — Find your crew</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{isLogin ? "Sign in" : "Sign up"}</CardTitle>
            <CardDescription>
              {isLogin ? "Enter your credentials to continue" : "Create an account to join the community"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <Label>Year *</Label>
                      <Select value={year} onValueChange={setYear}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{formatYear(y)}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Branch *</Label>
                      <Select value={branch} onValueChange={setBranch}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram ID (Optional)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                      <Input id="instagram" value={instagramId} onChange={(e) => setInstagramId(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@learner.manipal.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Please use your college email ID ending with @learner.manipal.edu
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Sign in" : "Sign up"}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button type="button" onClick={toggleMode} className="font-medium text-primary hover:underline">
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
