'use client';

import LearnLayout from '@/components/LearnLayout';
import HandwritingPractice from '@/components/HandwritingPractice';

export default function WritingPracticePage() {
  return (
    <LearnLayout title="Writing Practice">
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold text-kerala-green-800 mb-8">Practice Your Malayalam Writing</h1>
        <HandwritingPractice character="അ" />
      </div>
    </LearnLayout>
  );
}
