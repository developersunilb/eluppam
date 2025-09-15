'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react'

export default function CulturalHighlight() {
  return (
    <section id="culture" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-marigold-100 to-kerala-green-100 border border-marigold-200 mb-6">
            <MapPin className="h-4 w-4 text-marigold-600 mr-2" />
            <span className="text-sm font-medium text-kerala-green-700">
              Discover Kerala's Rich Heritage
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-kerala-green-700 to-backwater-blue-600 bg-clip-text text-transparent">
              Learn Through
            </span>
            <br />
            <span className="text-kerala-green-800">Cultural Stories</span>
          </h2>
          <p className="text-lg text-kerala-green-600 max-w-2xl mx-auto">
            Immerse yourself in Kerala's vibrant traditions, festivals, and folklore 
            while naturally acquiring Malayalam vocabulary and cultural understanding.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Featured Cultural Content */}
          <Card className="border-0 shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
            <div className="aspect-video bg-gradient-to-br from-marigold-500 via-marigold-400 to-kerala-green-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 bg-[url(data:image/svg+xml,%3Csvg%20width='40'%20height='40'%20viewBox='0%200%2040%2040'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='%23ffffff'%20fill-opacity='0.1'%3E%3Cpath%20d='M20%2020c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10zm10%200c0-5.5-4.5-10-10-10s-10%204.5-10%2010%204.5%2010%2010%2010%2010-4.5%2010-10z'/%3E%3C/g%3E%3C/svg%3E)] opacity-30" />
              <div className="absolute bottom-4 left-4 right-4">
                <Badge className="bg-white/20 text-white border-white/30 mb-2">
                  Festival Special
                </Badge>
                <h3 className="text-xl font-bold text-white mb-1">
                  The Magic of Onam
                </h3>
                <p className="text-white/90 text-sm">
                  Learn Malayalam while discovering Kerala's harvest festival
                </p>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 text-sm text-kerala-green-600 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>15 lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Beginner friendly</span>
                </div>
              </div>
              <p className="text-kerala-green-700 mb-4">
                Explore the vibrant Onam celebration through interactive stories, learn traditional 
                greetings, and understand the cultural significance behind Kerala's most beloved festival.
              </p>
              <Button className="bg-gradient-to-r from-marigold-500 to-marigold-600 hover:from-marigold-600 hover:to-marigold-700 text-white w-full">
                Start Cultural Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Learning Path Preview */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-kerala-green-800 mb-6">
              Cultural Learning Paths
            </h3>
            
            {[
              {
                title: "Backwater Tales",
                description: "Navigate Kerala's serene waterways while learning directional vocabulary",
                color: "from-backwater-blue-500 to-backwater-blue-600",
                lessons: 12
              },
              {
                title: "Temple Traditions",
                description: "Discover ancient customs and religious vocabulary through temple visits",
                color: "from-traditional-red-500 to-traditional-red-600",
                lessons: 18
              },
              {
                title: "Spice Route Stories",
                description: "Follow historical trade routes and learn food-related Malayalam terms",
                color: "from-kerala-green-500 to-kerala-green-600",
                lessons: 14
              },
              {
                title: "Classical Arts",
                description: "Explore Kathakali, Mohiniyattam, and learn artistic expressions",
                color: "from-kasavu-gold-500 to-kasavu-gold-600",
                lessons: 16
              }
            ].map((path, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-x-2">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${path.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-lg">{path.lessons}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-kerala-green-800 mb-1">
                        {path.title}
                      </h4>
                      <p className="text-sm text-kerala-green-600">
                        {path.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-kerala-green-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
