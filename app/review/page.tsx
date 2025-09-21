import Link from 'next/link';
import { BookOpen, ChevronRight, Eye } from 'lucide-react';

const reviewModules = [
  {
    title: 'All Letters & Words Review',
    description: 'Review all Malayalam letters, conjuncts, and common words learned.',
    href: '/review/all',
    icon: Eye,
  },
  // More review modules could be added here later
];

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-kerala-green-800 mb-8 text-center">Review Zone</h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviewModules.map((module) => (
              <Link
                href={module.href}
                key={module.title}
                className="block bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 border-t-4 border-marigold-500"
                legacyBehavior>
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
                      Start Review <ChevronRight className="h-5 w-5 ml-1" />
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
