import React from 'react';
import { ClipboardList, BarChart2, Zap, Lightbulb, BookOpen } from 'lucide-react';
import { StudyRecommendation } from '@/lib/types/assessment'; // Import the new type

const mockRecommendations: StudyRecommendation[] = [
  {
    type: 'lesson',
    id: 'vowels',
    title: 'Review Vowels Module',
    reason: 'Your recent assessment showed some difficulty with basic vowel recognition. This module will help reinforce foundational sounds.',
    priority: 'high',
    link: '/learn/vowels',
  },
  {
    type: 'game',
    id: 'word-find',
    title: 'Play Word Find Game',
    reason: 'To improve your vocabulary retention, try the Word Find game focusing on common words.',
    priority: 'medium',
    link: '/games/word-find',
  },
  {
    type: 'cultural-path',
    id: 'onam',
    title: 'Explore The Magic of Onam',
    reason: 'You expressed interest in cultural topics. Dive into the Onam festival to learn related vocabulary and traditions.',
    priority: 'low',
    link: '/culture/onam',
  },
];

const AssessmentPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <ClipboardList className="h-12 w-12 text-blue-500 mr-4" />
          <h1 className="text-4xl font-bold text-kerala-green-800">Skill Assessment</h1>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md text-center mb-12">
          <h2 className="text-2xl font-bold text-kerala-green-700 mb-4">Assess Your Malayalam Proficiency</h2>
          <p className="text-lg text-gray-700 mb-8">
            This feature is under active development! We've laid the groundwork with robust data structures for assessments and personalized recommendations. Soon, you'll be able to take comprehensive skill assessments to pinpoint your strengths and areas for improvement in Malayalam.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="flex items-start">
              <BarChart2 className="h-8 w-8 text-marigold-500 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-kerala-green-800">Detailed Analytics</h3>
                <p className="text-gray-600">Get a detailed breakdown of your performance in different skill areas.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Zap className="h-8 w-8 text-marigold-500 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-kerala-green-800">Personalized Recommendations</h3>
                <p className="text-gray-600">Receive tailored suggestions for lessons and games to focus on.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Trophy className="h-8 w-8 text-marigold-500 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-kerala-green-800">Track Your Improvement</h3>
                <p className="text-gray-600">See how your skills improve over time with regular assessments.</p>
              </div>
            </div>
          </div>
          <button
            disabled
            className="mt-12 bg-gray-400 text-white font-bold py-3 px-8 rounded-lg cursor-not-allowed"
          >
            Start Assessment (Coming Soon)
          </button>
        </div>

        {/* Placeholder for Personalized Recommendations */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <Lightbulb className="h-10 w-10 text-purple-500 mr-4" />
            <h2 className="text-3xl font-bold text-kerala-green-800">Personalized Recommendations</h2>
          </div>
          <p className="text-lg text-gray-700 mb-6">
            Based on your progress and (future) assessment results, here are some tailored suggestions to help you on your learning journey:
          </p>
          <div className="space-y-4">
            {mockRecommendations.map((rec, index) => (
              <div key={index} className="flex items-start p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                <div className="mr-4 mt-1">
                  {rec.priority === 'high' && <Zap className="h-6 w-6 text-red-500" />}
                  {rec.priority === 'medium' && <Lightbulb className="h-6 w-6 text-orange-500" />}
                  {rec.priority === 'low' && <BookOpen className="h-6 w-6 text-green-500" />}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-kerala-green-800">{rec.title}</h3>
                  <p className="text-gray-700 mb-2">{rec.reason}</p>
                  <a href={rec.link} className="text-blue-600 hover:underline font-medium">
                    Go to {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8">These recommendations are currently mock data. They will be dynamically generated based on your performance once assessments are fully implemented.</p>
        </div>
      </div>
    </div>
  );
};

import { Trophy } from 'lucide-react'; // Ensure Trophy is imported

export default AssessmentPage;
