import KootaksharamCategoryPageClient from '@/components/KootaksharamCategoryPageClient';

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

// This function generates the static paths and is required for `output: export`
export function generateStaticParams() {
  return Object.keys(categoryMap).map(slug => ({
    category: slug,
  }));
}

// This is the Server Component page
export default function KootaksharamCategoryPage() {
  // It renders the Client Component which will handle all the logic
  return <KootaksharamCategoryPageClient />;
}