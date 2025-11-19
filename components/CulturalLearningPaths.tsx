'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight, Film, Anchor, CookingPot, Theater } from 'lucide-react';

const culturalModules = [
  {
    title: 'The Magic of Onam',
    description: 'Learn Malayalam while discovering Kerala\'s harvest festival.',
    href: '/culture/onam',
    icon: BookOpen,
    lessons: 15,
    status: 'Not Started',
  },
  {
    title: 'Backwater Tales',
    description: 'Navigate Kerala\'s serene waterways while learning directional vocabulary.',
    href: '/culture/backwaters',
    icon: Anchor,
    lessons: 12,
    status: 'Not Started',
  },
  {
    title: 'Temple Traditions',
    description: 'Discover ancient customs and religious vocabulary through temple visits.',
    href: '/culture/temples',
    icon: Film,
    lessons: 18,
    status: 'Not Started',
  },
  {
    title: 'Spice Route Stories',
    description: 'Follow historical trade routes and learn food-related Malayalam terms.',
    href: '/culture/spiceroute',
    icon: CookingPot,
    lessons: 14,
    status: 'Not Started',
  },
  {
    title: 'Classical Arts',
    description: 'Explore Kathakali, Mohiniyattam, and learn artistic expressions.',
    href: '/culture/arts',
    icon: Theater,
    lessons: 16,
    status: 'Not Started',
  },
];

export default function CulturalLearningPaths() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-kerala-green-800 mb-8 text-center">Cultural Learning Paths</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {culturalModules.map((module) => (
          <Link href={module.href} key={module.title}>
            <div className="block bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 border-t-4 border-marigold-500 min-h-60 overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex-shrink-0">
                  <div className="inline-block bg-marigold-500 text-white p-3 rounded-lg">
                    <module.icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="flex-grow mt-4">
                  <h2 className="text-xl font-bold text-kerala-green-700">{module.title}</h2>
                  <p className="mt-2 text-base text-gray-600">{module.description}</p>
                </div>
                <div className="mt-4 flex-shrink-0">
                  <div className="flex items-center justify-between text-marigold-600 font-semibold">
                    <span>{module.lessons} lessons</span>
                    <div className="flex items-center">
                      Start Learning <ChevronRight className="h-5 w-5 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
