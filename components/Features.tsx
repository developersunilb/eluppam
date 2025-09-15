'use client'

import { Card, CardContent } from '@/components/ui/card'
import { 
  BookOpen, 
  Gamepad2, 
  Volume2, 
  Users, 
  Trophy, 
  Sparkles,
  Heart,
  Globe
} from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    description: "Learn Malayalam script, vocabulary, and grammar through engaging, bite-sized lessons designed for quick daily progress.",
    color: "from-marigold-500 to-marigold-600"
  },
  {
    icon: Gamepad2,
    title: "Gamified Learning",
    description: "Earn XP, unlock achievements, and climb leaderboards while building your Malayalam fluency through fun challenges.",
    color: "from-kerala-green-500 to-kerala-green-600"
  },
  {
    icon: Volume2,
    title: "Native Pronunciation",
    description: "Practice with authentic Malayalam audio from native speakers and get instant feedback on your pronunciation.",
    color: "from-backwater-blue-500 to-backwater-blue-600"
  },
  {
    icon: Heart,
    title: "Cultural Stories",
    description: "Discover Kerala's rich traditions, festivals, and folklore while learning the language in meaningful context.",
    color: "from-traditional-red-500 to-traditional-red-600"
  },
  {
    icon: Trophy,
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics, skill assessments, and personalized study recommendations.",
    color: "from-kasavu-gold-500 to-kasavu-gold-600"
  },
  {
    icon: Users,
    title: "Community Learning",
    description: "Connect with fellow learners, join study groups, and practice conversations with native speakers worldwide.",
    color: "from-lotus-pink-500 to-lotus-pink-600"
  }
]

export default function Features() {
  return (
    <section id="learn" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-marigold-100 to-kerala-green-100 border border-marigold-200 mb-6">
            <Sparkles className="h-4 w-4 text-marigold-600 mr-2" />
            <span className="text-sm font-medium text-kerala-green-700">
              Features That Make Learning Fun
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-kerala-green-700 to-backwater-blue-600 bg-clip-text text-transparent">
              Master Malayalam
            </span>
            <br />
            <span className="text-kerala-green-800">The Smart Way</span>
          </h2>
          <p className="text-lg text-kerala-green-600 max-w-2xl mx-auto">
            Our proven methodology combines modern language learning science with the rich 
            cultural heritage of Kerala to create an unforgettable learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index} 
                className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-cream-50"
              >
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-kerala-green-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-kerala-green-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}