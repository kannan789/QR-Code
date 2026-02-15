import React, { useState } from 'react';
import { useApp } from '@/app/context/AppContext';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { NotebookPen, Loader2 } from 'lucide-react';

export function LoginScreen() {
  const { login } = useApp();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Determine role based on email for demo
    const role = email.includes('admin') ? 'ADMIN' : 'USER';
    
    try {
        await login(email, role);
    } catch (error) {
        // Error handling is done in context toast
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                <NotebookPen className="text-white h-7 w-7" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
            </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
            </Button>
            <div className="text-center text-sm text-slate-500">
                <p>Try <span className="font-mono text-indigo-600">admin@example.com</span> for Admin</p>
                <p>Try <span className="font-mono text-indigo-600">sarah@example.com</span> for User</p>
            </div>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
