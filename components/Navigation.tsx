'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, BookOpen, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { useAuth } from '@/context/AuthContext'; // Import useAuth

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoggedIn, login, logout, loading: authLoading } = useAuth(); // Use useAuth hook

  const handleLogin = async () => {
    const inputUserId = prompt("Enter your User ID (e.g., user123):");
    if (!inputUserId) return;
    const inputUsername = prompt("Enter your preferred username:");
    if (!inputUsername) return;
    const inputEmail = prompt("Enter your email (optional):");

    await login(inputUserId, inputUsername, inputEmail || undefined);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b-8 border-kasavu-gold-500 shadow-[inset_0_-1px_0_0_#EF4444]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-gradient-to-r from-marigold-500 to-marigold-600 p-2 rounded-xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-kerala-green-700 to-backwater-blue-600 bg-clip-text text-transparent">
              Eluppam എളുപ്പം
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/learn" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Learn
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/practice" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Practice
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/review" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Review
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/games" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Games
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/culture" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Culture
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/progress" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Progress
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {authLoading ? (
              <span>Loading...</span>
            ) : isLoggedIn ? (
              <>
                <span className="text-kerala-green-700 text-sm">Hello, {user?.username || user?.userId}</span>
                <Button onClick={handleLogout} variant="ghost" className="text-kerala-green-700 hover:bg-marigold-50">
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={handleLogin} variant="ghost" className="text-kerala-green-700 hover:bg-marigold-50">
                Sign In
              </Button>
            )}
            <Link href="/learn" legacyBehavior>
              <Button className="bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-white shadow-lg hover:shadow-xl transition-all">
                Start Learning
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-marigold-50 transition-colors"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-kerala-green-700" />
            ) : (
              <Menu className="h-6 w-6 text-kerala-green-700" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-kerala-green-200/30">
          <div className="px-4 py-6 space-y-4">
            <Link href="/learn" className="block text-kerala-green-700 hover:text-marigold-600 transition-colors font-medium">
              Learn
            </Link>
            <Link href="/practice" className="block text-kerala-green-700 hover:text-marigold-600 transition-colors font-medium">
              Practice
            </Link>
            <Link href="/review" className="block text-kerala-green-700 hover:text-marigold-600 transition-colors font-medium">
              Review
            </Link>
            <Link href="/games" className="block text-kerala-green-700 hover:text-marigold-600 transition-colors font-medium">
              Games
            </Link>
            <Link href="/culture" className="block text-kerala-green-700 hover:text-marigold-600 transition-colors font-medium">
              Culture
            </Link>
            <Link
              href="/progress"
              className="block text-kerala-green-700 hover:text-marigold-600 transition-colors font-medium"
              legacyBehavior> {/* Simplified Link */}
              Progress
            </Link>
            <div className="pt-4 space-y-3">
              {authLoading ? (
                <span>Loading...</span>
              ) : isLoggedIn ? (
                <>
                  <span className="block text-kerala-green-700 text-sm">Hello, {user?.username || user?.userId}</span>
                  <Button onClick={handleLogout} variant="ghost" className="w-full text-kerala-green-700 hover:bg-marigold-50">
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={handleLogin} variant="ghost" className="w-full text-kerala-green-700 hover:bg-marigold-50">
                  Sign In
                </Button>
              )}
              <Link href="/learn" className="w-full" legacyBehavior>
                <Button className="w-full bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-white">
                  Start Learning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
