'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Flame, 
  Star, 
  Award, 
  Calendar,
  TrendingUp,
  Target
} from 'lucide-react'

export default function ProgressPreview() {
  return (
    <section id="progress" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-kerala-green-50 to-backwater-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-marigold-100 to-kerala-green-100 border border-marigold-200 mb-6">
            <TrendingUp className="h-4 w-4 text-marigold-600 mr-2" />
            <span className="text-sm font-medium text-kerala-green-700">
              Track Your Learning Journey
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-kerala-green-700 to-backwater-blue-600 bg-clip-text text-transparent">
              Your Progress
            </span>
            <br />
            <span className="text-kerala-green-800">Visualized Beautifully</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Progress Card */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-cream-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-kerala-green-800">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-marigold-500 to-marigold-600 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  Current Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Level Progress */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-kerala-green-700">Level 3 - Basic Conversations</span>
                    <Badge className="bg-gradient-to-r from-marigold-500 to-marigold-600 text-white">
                      750 XP / 1000 XP
                    </Badge>
                  </div>
                  <Progress value={75} className="h-3" />
                </div>

                {/* Skills Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-kerala-green-600">Vocabulary</span>
                      <span className="text-sm font-medium text-kerala-green-800">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-kerala-green-600">Grammar</span>
                      <span className="text-sm font-medium text-kerala-green-800">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-kerala-green-600">Pronunciation</span>
                      <span className="text-sm font-medium text-kerala-green-800">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-kerala-green-600">Cultural Knowledge</span>
                      <span className="text-sm font-medium text-kerala-green-800">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Streak Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-marigold-500 to-marigold-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-sm opacity-90">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-cream-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-kerala-green-800">
                  <Award className="w-5 h-5 text-marigold-600" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-kerala-green-500 to-kerala-green-600 flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-kerala-green-800">Onam Master</div>
                    <div className="text-xs text-kerala-green-600">Completed festival lessons</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-backwater-blue-500 to-backwater-blue-600 flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-kerala-green-800">Pronunciation Pro</div>
                    <div className="text-xs text-kerala-green-600">Perfect pronunciation score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-cream-50">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-kerala-green-800">156</div>
                    <div className="text-sm text-kerala-green-600">Words Learned</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-kerala-green-800">42</div>
                    <div className="text-sm text-kerala-green-600">Lessons Done</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}