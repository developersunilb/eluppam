'use client';

import LearnLayout from '@/components/LearnLayout';
import dynamic from 'next/dynamic';

const HandwritingRecognition = dynamic(
  () => import('@/components/HandwritingRecognition'),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

export default function HandwritingPracticePage() {
  return (
    <LearnLayout title="Handwriting Recognition">
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold text-kerala-green-800 mb-8">Practice Your Malayalam Writing</h1>
        <HandwritingRecognition />
      </div>
    </LearnLayout>
  );
}
