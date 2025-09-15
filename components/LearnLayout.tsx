import React from 'react';

interface LearnLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function LearnLayout({ title, children }: LearnLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50">
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-kerala-green-800 mb-6 text-center">{title}</h1>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
