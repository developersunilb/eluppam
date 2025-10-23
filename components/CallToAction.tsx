'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Sparkles, Users, Calendar } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function CallToAction() {
  const { login } = useAuth();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-kerala-green-50 via-marigold-50 to-backwater-blue-50">
      <div className="max-w-4xl mx-auto text-center">
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-cream-50 overflow-hidden">
          <CardContent className="p-12">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-marigold-500 via-kerala-green-500 to-backwater-blue-500" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-marigold-100 to-marigold-200 rounded-full opacity-50" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-kerala-green-100 to-kerala-green-200 rounded-full opacity-30" />
            
            <div className="relative">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-marigold-100 to-kerala-green-100 border border-marigold-200 mb-6">
                <Sparkles className="h-4 w-4 text-marigold-600 mr-2" />
                <span className="text-sm font-medium text-kerala-green-700">
                  Join Thousands of Happy Learners
                </span>
              </div>

              {/* Main Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-kerala-green-700 to-backwater-blue-600 bg-clip-text text-transparent">
                  Start Your Malayalam
                </span>
                <br />
                <span className="text-kerala-green-800">Journey Today</span>
              </h2>

              {/* Description */}
              <p className="text-lg text-kerala-green-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Experience the joy of learning Malayalam through Kerala&apos;s rich culture, 
                beautiful stories, and proven gamification techniques. Your linguistic 
                adventure awaits!
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-marigold-500 to-marigold-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-kerala-green-700 font-medium">Daily 15-min lessons</span>
                </div>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-kerala-green-500 to-kerala-green-600 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-kerala-green-700 font-medium">Community support</span>
                </div>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-backwater-blue-500 to-backwater-blue-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-kerala-green-700 font-medium">Gamified experience</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 px-8"
                  onClick={() => login('guestUser', 'Guest', 'guest@example.com')}
                >
                  Begin Learning Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Link href="/#learn">
                  {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                  }
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-kerala-green-300 text-kerala-green-700 hover:bg-kerala-green-50 hover:border-kerala-green-400 px-8"
                  >
                    Explore Features
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-kerala-green-100">
                <p className="text-sm text-kerala-green-500 mb-4">Trusted by learners worldwide</p>
                <div className="flex items-center justify-center space-x-8 opacity-60">
                  <div className="text-xs text-kerala-green-400">★★★★★ App Store</div>
                  <div className="w-px h-4 bg-kerala-green-200" />
                  <div className="text-xs text-kerala-green-400">★★★★★ Play Store</div>
                  <div className="w-px h-4 bg-kerala-green-200" />
                  <div className="text-xs text-kerala-green-400">10K+ Active Users</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}