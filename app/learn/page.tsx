import Link from 'next/link';
import { BookOpen, ChevronRight, Hash, Globe, User, Brush } from 'lucide-react';

const learningModules = [
  {
    title: 'Swaraksharangal (Vowels)',
    description: 'Start your journey with the foundational sounds of Malayalam.',
    href: '/learn/vowels',
    icon: BookOpen,
  },
  {
    title: 'Vyanjanaaksharangal (Consonants)',
    description: 'Learn the building blocks of Malayalam words.',
    href: '/learn/consonants',
    icon: BookOpen,
  },
  {
    title: 'Chillaksharangal (Pure Consonants)',
    description: 'Master the special consonant forms.',
    href: '/learn/chillaksharangal',
    icon: BookOpen,
  },
  {
    title: 'Kootaksharangal (Conjuncts)',
    description: 'Combine consonants to form new sounds.',
    href: '/learn/kootaksharangal',
    icon: BookOpen,
  },
  {
    title: 'Numbers',
    description: 'Learn to count in Malayalam.',
    href: '/learn/numbers',
    icon: Hash,
  },
  {
    title: 'Common Words',
    description: 'Learn words for festivals, seasons, and cities.',
    href: '/learn/common-words',
    icon: Globe,
  },
  {
    title: 'Introduce Yourself',
    description: 'Learn to share basic information about yourself.',
    href: '/learn/about-yourself',
    icon: User,
  },
  {
    title: 'Writing Practice',
    description: 'Practice writing Malayalam characters with guided strokes.',
    href: '/learn/writing-practice',
    icon: Brush,
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-kerala-green-800 mb-8 text-center">Learning Dashboard</h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learningModules.map((module) => (
              <Link href={module.href} key={module.title} legacyBehavior>
                <div className="block bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 border-t-4 border-marigold-500 min-h-60 overflow-hidden"> {/* Added min-h-60 and overflow-hidden */}
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
                      <div className="flex items-center justify-end text-marigold-600 font-semibold">
                        Start Learning <ChevronRight className="h-5 w-5 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}