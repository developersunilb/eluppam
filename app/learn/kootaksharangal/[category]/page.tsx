import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LearnLayout from '@/components/LearnLayout';
import { kootaksharamData } from '@/lib/kootaksharam-data';
import KootaksharamClient from '@/components/Kootaksharam-Client';

// This function generates the static paths for all categories at build time
export async function generateStaticParams() {
  // Create a reverse map for easy lookup from base to slug
  const reverseCategoryMap: { [key: string]: string } = {
      'ക': 'ka',
      'ഗ': 'ga',
      'ങ': 'nga',
      'ച': 'cha',
      'ജ': 'ja',
      'ഞ': 'nja',
      'ട': 'tta',
      'ഡ': 'dda',
      'ണ': 'nna',
      'ത': 'ta',
      'ദ': 'da',
      'ന': 'na',
      'പ': 'pa',
      'മ': 'ma',
      'യ': 'ya',
      'ര': 'ra',
      'ല': 'la',
      'വ': 'va',
      'ശ': 'sha',
      'സ': 'sa',
      'ഹ': 'ha',
      'ള': 'la2',
      'ഴ': 'zha',
      'റ': 'ra2',
  };

  // Get all unique base consonants from the data
  const uniqueBases = [...new Set(kootaksharamData.map(item => item.base))];

  // Map the unique bases to the params object expected by Next.js
  return uniqueBases.map(base => ({
    category: reverseCategoryMap[base],
  })).filter(param => param.category); // Filter out any undefined categories
}


export default function KootaksharamCategoryPage({ params }: { params: { category: string } }) {
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

  const baseConsonant = categoryMap[params.category];
  
  const filteredData = kootaksharamData.filter(item => item.base === baseConsonant);

  if (filteredData.length === 0) {
    notFound();
  }

  return (
    <LearnLayout title={`Kootaksharangal: ${baseConsonant} group`}>
      <div className="mb-8">
          <Link
            href="/learn/kootaksharangal"
            className="inline-flex items-center text-sm font-medium text-kerala-green-700 hover:text-kerala-green-900"
            legacyBehavior>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Kootaksharangal Menu
          </Link>
      </div>
      <KootaksharamClient data={filteredData} moduleId={`kootaksharangal-${params.category}`} />
    </LearnLayout>
  );
}
