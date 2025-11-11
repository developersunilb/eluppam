'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LearnLayout from '@/components/LearnLayout';
import { kootaksharamData } from '@/lib/data';
import KootaksharamClient from '@/components/Kootaksharam-Client';

const categoryMap: { [key: string]: string } = {
    ka: 'ക',
    ga: 'ഗ',
    nga: 'ങ',
    cha: 'ച',
    ja: 'ജ',
    nja: 'ഞ',
    tta: 'ട',
    dda: 'ഡ',
    nna: 'ണ',
    ta: 'ത',
    da: 'ദ',
    na: 'ന',
    pa: 'പ',
    ma: 'മ',
    ya: 'യ',
    ra: 'ര',
    la: 'ല',
    va: 'വ',
    sha: 'ശ',
    sa: 'സ',
    ha: 'ഹ',
    la2: 'ള',
    zha: 'ഴ',
    ra2: 'റ',
};

export default function KootaksharamCategoryPageClient() {
  const params = useParams();
  const category = params.category as string;
  const baseConsonant = categoryMap[category];
  
  const filteredData = kootaksharamData.filter(item => item.base === baseConsonant);

  // In recent Next.js versions, notFound() can be used in client components.
  // If it causes issues, it can be replaced with a redirect or a simple message.
  if (!baseConsonant || filteredData.length === 0) {
    notFound();
  }

  return (
    <LearnLayout title={`Kootaksharangal: ${baseConsonant} group`}>
      <div className="mb-8">
          <Link
            href="/learn/kootaksharangal"
            className="inline-flex items-center text-sm font-medium text-kerala-green-700 hover:text-kerala-green-900">
            <ArrowLeft className="w-4 h-4 mr-2" />Back to Kootaksharangal Menu
          </Link>
      </div>
      <KootaksharamClient data={filteredData} moduleId={`kootaksharangal-${category}`} />
    </LearnLayout>
  );
}
