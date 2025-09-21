import Link from 'next/link';
import { BookOpen, ChevronRight, Edit, Hash, Globe, User } from 'lucide-react';

const practiceModules = [
  {
    title: 'Swaraksharangal (Vowels) Practice',
    description: 'Practice typing and recognizing Malayalam vowels.',
    href: '/practice/vowels',
    icon: Edit,
  },
  {
    title: 'Vyanjanaaksharangal (Consonants) Practice',
    description: 'Practice typing and recognizing Malayalam consonants.',
    href: '/practice/consonants',
    icon: Edit,
  },
  {
    title: 'Chillaksharangal (Pure Consonants) Practice',
    description: 'Practice typing and recognizing Malayalam pure consonants.',
    href: '/practice/chillaksharangal',
    icon: Edit,
  },
  {
    title: 'Kootaksharangal (Conjuncts) Practice',
    description: 'Practice typing and recognizing Malayalam conjunct consonants.',
    href: '/practice/kootaksharangal',
    icon: Edit,
  },
  {
    title: 'Numbers Practice',
    description: 'Practice typing and recognizing Malayalam numbers.',
    href: '/practice/numbers',
    icon: Hash,
  },
  {
    title: 'Common Words Practice',
    description: 'Practice typing and recognizing common Malayalam words.',
    href: '/practice/common-words',
    icon: Globe,
  },
  {
    title: 'Introduce Yourself Practice',
    description: 'Practice typing sentences to introduce yourself.',
    href: '/practice/about-yourself',
    icon: User,
  },
  // More practice modules will be added here
];

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-kerala-green-800 mb-8 text-center">Practice Dashboard</h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practiceModules.map((module) => (
              <Link
                href={module.href}
                key={module.title}>
                <div className="block bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 border-t-4 border-marigold-500">
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
                        Start Practice <ChevronRight className="h-5 w-5 ml-1" />
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
