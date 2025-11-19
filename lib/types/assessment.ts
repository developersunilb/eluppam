export interface AssessmentQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-in-the-blank' | 'pronunciation';
  question: string;
  options?: string[]; // For multiple-choice
  correctAnswer?: string | string[]; // For fill-in-the-blank or pronunciation target
  audioSrc?: string; // For pronunciation questions
  imageSrc?: string; // Optional image for question
}

export interface AssessmentResult {
  assessmentId: string;
  userId: string;
  timestamp: number;
  score: number; // Percentage or raw score
  details: {
    questionId: string;
    userAnswer: string | string[];
    isCorrect: boolean;
    feedback?: string; // Specific feedback for the answer
  }[];
  skillBreakdown: {
    vocabulary: number; // Percentage
    grammar: number; // Percentage
    pronunciation: number; // Percentage
    culturalKnowledge: number; // Percentage
  };
}

export interface StudyRecommendation {
  type: 'lesson' | 'game' | 'practice' | 'cultural-path';
  id: string; // ID of the recommended item (e.g., moduleId, gameId, culturalPathId)
  title: string;
  reason: string; // Why this is recommended (e.g., "Based on your grammar assessment, focus on...")
  priority: 'high' | 'medium' | 'low';
  link: string; // URL to the recommended item
}

export interface UserRecommendations {
  userId: string;
  lastUpdated: number;
  recommendations: StudyRecommendation[];
}
