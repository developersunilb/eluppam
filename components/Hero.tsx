'use client'

import { Button } from '@/components/ui/button'
import { Play, Star, Users, Award } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function Hero() {
  const { login } = useAuth();

  return (
    <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-50 via-marigold-50 to-kerala-green-50 opacity-60" />
<div className="absolute inset-0 bg-[var(--bg-pattern-hero)]" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-marigold-100 to-kerala-green-100 border border-marigold-200 mb-8">
            <Star className="h-4 w-4 text-marigold-600 mr-2" />
            <span className="text-sm font-medium text-kerala-green-700">
              Experience the Beauty of Malayalam
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-kerala-green-700 via-backwater-blue-600 to-marigold-600 bg-clip-text text-transparent">
              Learn Malayalam with ease
            </span>
            <br />
            <span className="text-kerala-green-800">
              Through Fun & Games
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-kerala-green-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Immerse yourself in the rich heritage of Kerala while mastering Malayalam through 
            gamified lessons, cultural stories, and interactive experiences that make learning 
            feel like a celebration.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 px-8"
              onClick={() => login('guestUser', 'Guest', 'guest@example.com')}
            >
              Begin Your Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-kerala-green-300 text-kerala-green-700 hover:bg-kerala-green-50 hover:border-kerala-green-400 px-8"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-marigold-100 to-marigold-200 rounded-full">
                <Users className="w-8 h-8 text-marigold-600" />
              </div>
              <div className="text-2xl font-bold text-kerala-green-800">10K+</div>
              <div className="text-sm text-kerala-green-600">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-kerala-green-100 to-kerala-green-200 rounded-full">
                <Award className="w-8 h-8 text-kerala-green-600" />
              </div>
              <div className="text-2xl font-bold text-kerala-green-800">500+</div>
              <div className="text-sm text-kerala-green-600">Interactive Lessons</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-backwater-blue-100 to-backwater-blue-200 rounded-full">
                <Star className="w-8 h-8 text-backwater-blue-600" />
              </div>
              <div className="text-2xl font-bold text-kerala-green-800">4.9</div>
              <div className="text-sm text-kerala-green-600">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}