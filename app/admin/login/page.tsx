
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ADMIN_USERS = [
    { username: 'SunilB', email: 'developersunilb@gmail.com', password: '@dm1n270978' },
    { username: 'AshlyS', email: 'developerashly@gmail.com', password: '@dm1n170284' },
];

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleUsernameEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const admin = ADMIN_USERS.find(user => user.username === username && user.email === email);
        if (admin) {
            setShowPassword(true);
            setError('');
        } else {
            setError('Invalid username or email.');
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const admin = ADMIN_USERS.find(user => user.username === username && user.email === email && user.password === password);
        if (admin) {
            sessionStorage.setItem('isAdmin', 'true');
            sessionStorage.setItem('adminUsername', admin.username);
            window.dispatchEvent(new Event('adminLogin')); // Notify navigation
            router.push('/admin');
        } else {
            setError('Incorrect password.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
                </CardHeader>
                <CardContent>
                    {!showPassword ? (
                        <form onSubmit={handleUsernameEmailSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Next</Button>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" type="text" value={username} disabled />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} disabled />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Login</Button>
                        </form>
                    )}
                    {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                </CardContent>
            </Card>
        </div>
    );
}
