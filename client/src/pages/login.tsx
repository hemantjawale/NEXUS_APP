import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await apiRequest("POST", "/api/login", {
        email: formData.email,
        password: formData.password,
      });

      const user = await response.json();
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.firstName || user.email}!`,
      });
      
      // Navigate to home page
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-nexus-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-2xl font-bold nexus-primary">NEXUS</span>
          </div>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                data-testid="input-login-email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                data-testid="input-login-password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-nexus-primary hover:bg-blue-800"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup">
                <Button variant="link" className="p-0 h-auto text-nexus-primary" data-testid="link-signup">
                  Sign up
                </Button>
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/">
              <Button variant="ghost" data-testid="button-back-home">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}