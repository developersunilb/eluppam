'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [currentImageSrc, setCurrentImageSrc] = useState('/game/parrotmascot0.gif');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAdmin = () => {
        const adminStatus = sessionStorage.getItem('isAdmin');
        setIsAdmin(adminStatus === 'true');
        if (adminStatus === 'true') {
          setAdminUsername(sessionStorage.getItem('adminUsername') || '');
        }
      };

      checkAdmin();

      window.addEventListener('adminLogin', checkAdmin);

      return () => {
        window.removeEventListener('adminLogin', checkAdmin);
      };
    }
  }, []);

  const handleLogin = async () => {
    const inputUsername = prompt("Enter your username:");
    if (!inputUsername) return;

    const ADMIN_USERNAMES = ['SunilB', 'AshlyS'];

    if (ADMIN_USERNAMES.includes(inputUsername)) {
      router.push('/admin/login');
    } else {
      // Regular user login flow
      const inputUserId = inputUsername; // Use username as userId for regular users
      const inputEmail = prompt("Enter your email:");
      if (!inputEmail) return;
      await login(inputUserId, inputUsername, inputEmail);
    }
  };

  const handleLogout = async () => {
    await logout();
    // Clear admin status on logout
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('adminUsername');
    window.dispatchEvent(new Event('adminLogin')); // Notify navigation
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
            <img
              src={currentImageSrc}
              alt="Parrot Mascot"
              className="hidden md:block h-20 w-20 lg:h-32 lg:w-32 fixed top-2 left-4 z-50"
              onMouseEnter={() => {
                setCurrentImageSrc('/game/parrotmascot1.png');
                const audio = new Audio('/audio/eluppampadikkaam.mp3');
                audio.play();
              }}
              onMouseLeave={() => setCurrentImageSrc('/game/parrotmascot0.gif')}
            />

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
              {isAdmin && (
                <NavigationMenuItem>
                  <Link href="/admin" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Admin
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAdmin ? (
              <>
                <span className="text-kerala-green-700 text-sm">Hello, {adminUsername} (Admin)</span>
                <Button onClick={handleLogout} variant="ghost" className="text-kerala-green-700 hover:bg-marigold-50">
                  Logout
                </Button>
              </>
            ) : authLoading ? (
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
            <Button asChild className="bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-white shadow-lg hover:shadow-xl transition-all">
              <Link href="/learn">Start Learning</Link>
            </Button>
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
                            className="block text-kerala-green-700 hover:text-marigold-600 transition-colors font-medium">
                            Progress
                          </Link>
                        {isAdmin && (
                          <Link href="/admin" className="block text-kerala-green-700 hover:text-marigold-600 transition-colors font-medium">
                            Admin
                          </Link>
                        )}            <div className="pt-4 space-y-3">
              {isAdmin ? (
                <span className="block text-kerala-green-700 text-sm">Hello, {adminUsername} (Admin)</span>
              ) : authLoading ? (
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
              <Button asChild className="w-full bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-white">
                <Link href="/learn">Start Learning</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
