import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

export const AuthForms = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  
  return (
    <div className="max-w-md w-full mx-auto">
      <Tabs defaultValue="login" onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="animate-fade-in">
          <LoginForm selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
        </TabsContent>
        <TabsContent value="register" className="animate-fade-in">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const LoginForm = ({ 
  selectedRole, 
  setSelectedRole 
}: { 
  selectedRole: UserRole; 
  setSelectedRole: (role: UserRole) => void 
}) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, selectedRole);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const fillDemoCredentials = () => {
    switch(selectedRole) {
      case 'student':
        setEmail('demo.student@hostel.com');
        setPassword('student123');
        break;
      case 'mess':
        setEmail('demo.mess@hostel.com');
        setPassword('mess123');
        break;
      case 'office':
        setEmail('hosteloffice@mescoe.pune');
        setPassword('office123');
        break;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Login As</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                type="button" 
                variant={selectedRole === 'student' ? 'default' : 'outline'} 
                onClick={() => setSelectedRole('student')}
                className="w-full"
              >
                Student
              </Button>
              <Button 
                type="button" 
                variant={selectedRole === 'mess' ? 'default' : 'outline'} 
                onClick={() => setSelectedRole('mess')}
                className="w-full"
              >
                Mess
              </Button>
              <Button 
                type="button" 
                variant={selectedRole === 'office' ? 'default' : 'outline'} 
                onClick={() => setSelectedRole('office')}
                className="w-full"
              >
                Office
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button 
                variant="link" 
                size="sm" 
                type="button"
                onClick={fillDemoCredentials}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Use Demo Credentials
              </Button>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('[value="register"]')?.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
              );
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            Register Now
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

const RegisterForm = () => {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [parentContact, setParentContact] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await register({
        name,
        email,
        role: 'student',
        roomNumber,
        rollNumber,
        parentContact,
      });
      
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRoomNumber('');
      setRollNumber('');
      setParentContact('');
      
      document.querySelector('[value="login"]')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new student account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              placeholder="Enter your full name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reg-email">Email</Label>
            <Input 
              id="reg-email" 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="room">Room Number</Label>
              <Input 
                id="room" 
                placeholder="e.g., A-101" 
                value={roomNumber} 
                onChange={(e) => setRoomNumber(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roll">Roll Number</Label>
              <Input 
                id="roll" 
                placeholder="e.g., ST12345" 
                value={rollNumber} 
                onChange={(e) => setRollNumber(e.target.value)} 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="parent">Parent Contact</Label>
            <Input 
              id="parent" 
              type="tel" 
              placeholder="e.g., +1234567890" 
              value={parentContact} 
              onChange={(e) => setParentContact(e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reg-password">Password</Label>
            <Input 
              id="reg-password" 
              type="password" 
              placeholder="Create a password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              placeholder="Confirm your password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('[value="login"]')?.dispatchEvent(
                new MouseEvent('click', { bubbles: true })
              );
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            Login
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};
