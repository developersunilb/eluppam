import React from 'react';

const ArtsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-kerala-green-800 mb-4">Classical Arts</h1>
        <p className="text-lg text-gray-700 mb-8">This is a placeholder for the 16 lessons on Kerala's classical arts. The lessons will explore Kathakali, Mohiniyattam, and artistic expressions.</p>
        {/* Placeholder for lesson list */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-kerala-green-700 mb-4">Lessons</h2>
          <ul>
            {[...Array(16)].map((_, i) => (
              <li key={i} className="border-b py-2">Lesson {i + 1}: Coming Soon</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ArtsPage;
