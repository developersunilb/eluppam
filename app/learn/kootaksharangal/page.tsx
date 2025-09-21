'use client';

import Link from 'next/link';
import LearnLayout from '@/components/LearnLayout';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const categories = [
  {
    name: 'Conjuncts from ക (ka)',
    description: 'Combinations starting with the consonant ക',
    href: '/learn/kootaksharangal/ka',
    icon: 'ക',
  },
  {
    name: 'Conjuncts from ഗ (ga)',
    description: 'Combinations starting with the consonant ഗ',
    href: '/learn/kootaksharangal/ga',
    icon: 'ഗ',
  },
  {
    name: 'Conjuncts from ങ (nga)',
    description: 'Combinations starting with the consonant ങ',
    href: '/learn/kootaksharangal/nga',
    icon: 'ങ',
  },
  {
    name: 'Conjuncts from ച (cha)',
    description: 'Combinations starting with the consonant ച',
    href: '/learn/kootaksharangal/cha',
    icon: 'ച',
  },
  {
    name: 'Conjuncts from ജ (ja)',
    description: 'Combinations starting with the consonant ജ',
    href: '/learn/kootaksharangal/ja',
    icon: 'ജ',
  },
  {
    name: 'Conjuncts from ഞ (ña)',
    description: 'Combinations starting with the consonant ഞ',
    href: '/learn/kootaksharangal/nja',
    icon: 'ഞ',
  },
  {
    name: 'Conjuncts from ട (ṭa)',
    description: 'Combinations starting with the consonant ട',
    href: '/learn/kootaksharangal/tta',
    icon: 'ട',
  },
  {
    name: 'Conjuncts from ഡ (ḍa)',
    description: 'Combinations starting with the consonant ഡ',
    href: '/learn/kootaksharangal/dda',
    icon: 'ഡ',
  },
  {
    name: 'Conjuncts from ണ (ṇa)',
    description: 'Combinations starting with the consonant ണ',
    href: '/learn/kootaksharangal/nna',
    icon: 'ണ',
  },
  {
    name: 'Conjuncts from ദ (da)',
    description: 'Combinations starting with the consonant ദ',
    href: '/learn/kootaksharangal/da',
    icon: 'ദ',
  },
  {
    name: 'Conjuncts from ന (na)',
    description: 'Combinations starting with the consonant ന',
    href: '/learn/kootaksharangal/na',
    icon: 'ന',
  },
  {
    name: 'Conjuncts from പ (pa)',
    description: 'Combinations starting with the consonant പ',
    href: '/learn/kootaksharangal/pa',
    icon: 'പ',
  },
  {
    name: 'Conjuncts from മ (ma)',
    description: 'Combinations starting with the consonant മ',
    href: '/learn/kootaksharangal/ma',
    icon: 'മ',
  },
  {
    name: 'Conjuncts from യ (ya)',
    description: 'Combinations starting with the consonant യ',
    href: '/learn/kootaksharangal/ya',
    icon: 'യ',
  },
  {
    name: 'Conjuncts from ര (ra)',
    description: 'Combinations starting with the consonant ര',
    href: '/learn/kootaksharangal/ra',
    icon: 'ര',
  },
  {
    name: 'Conjuncts from ല (la)',
    description: 'Combinations starting with the consonant ല',
    href: '/learn/kootaksharangal/la',
    icon: 'ല',
  },
  {
    name: 'Conjuncts from വ (va)',
    description: 'Combinations starting with the consonant വ',
    href: '/learn/kootaksharangal/va',
    icon: 'വ',
  },
  {
    name: 'Conjuncts from ശ (śa)',
    description: 'Combinations starting with the consonant ശ',
    href: '/learn/kootaksharangal/sha',
    icon: 'ശ',
  },
  {
    name: 'Conjuncts from സ (sa)',
    description: 'Combinations starting with the consonant സ',
    href: '/learn/kootaksharangal/sa',
    icon: 'സ',
  },
  {
    name: 'Conjuncts from ഹ (ha)',
    description: 'Combinations starting with the consonant ഹ',
    href: '/learn/kootaksharangal/ha',
    icon: 'ഹ',
  },
  {
    name: 'Conjuncts from ള (ḷa)',
    description: 'Combinations starting with the consonant ള',
    href: '/learn/kootaksharangal/la2',
    icon: 'ള',
  },
  {
    name: 'Conjuncts from ഴ (ḻa)',
    description: 'Combinations starting with the consonant ഴ',
    href: '/learn/kootaksharangal/zha',
    icon: 'ഴ',
  },
  {
    name: 'Conjuncts from റ (ṟa)',
    description: 'Combinations starting with the consonant റ',
        href: '/learn/kootaksharangal/ra2',
    icon: 'റ',
  },
  // ... more categories will be added here
];

export default function KootaksharangalMenu() {
  const router = useRouter();
  return (
    <LearnLayout title="Kootaksharangal (Conjuncts)">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <Link
            href={category.href}
            key={category.name}
            className="block hover:no-underline"
            legacyBehavior>
            <Card className="h-full flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:border-kerala-green-500/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="text-4xl font-bold text-kerala-green-700 mr-4">{category.icon}</div>
                        <div>
                            <CardTitle className="text-xl font-bold text-kerala-green-800">{category.name}</CardTitle>
                            <p className="text-gray-500 mt-1">{category.description}</p>
                        </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-gray-400" />
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-8 text-center">
         <p className="text-gray-500">More categories will be added soon.</p>
       </div>
      <div className="mt-8 flex justify-center">
        <Button onClick={() => router.push('/learn')} variant="outline">
          Back to Learn Dashboard
        </Button>
      </div>
    </LearnLayout>
  );
}