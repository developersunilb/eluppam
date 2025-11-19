import React from 'react';
import { Trophy, User } from 'lucide-react';
import { mockLeaderboardData } from '@/lib/data'; // Import mock data

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <Trophy className="h-12 w-12 text-yellow-500 mr-4" />
          <h1 className="text-4xl font-bold text-kerala-green-800">Leaderboard</h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            {mockLeaderboardData.map((user, index) => (
              <div key={user.id} className="flex items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                <div className="w-12 text-2xl font-bold text-kerala-green-700">{index + 1}</div> {/* Dynamic rank */}
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-white" />
                  )}
                </div>
                <div className="flex-grow">
                  <div className="text-lg font-semibold text-kerala-green-800">{user.name}</div>
                </div>
                <div className="text-xl font-bold text-marigold-600">{user.score} XP</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-gray-600 mt-8">This is a mock leaderboard using static data. Real-time data integration is coming soon!</p>
      </div>
    </div>
  );
};

export default LeaderboardPage;
