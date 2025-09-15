export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score?: number; // e.g., for quizzes within a lesson
  lastAttempted?: number; // Timestamp
}

export interface PracticeAttempt {
  attemptId: string; // Unique ID for each attempt
  timestamp: number; // When the attempt was made
  score: number; // Score for this practice attempt (e.g., percentage, number correct)
  // You can add more details here, e.g., questionsAttempted: string[], answersGiven: string[], etc.
}

export interface ModuleProgress {
  moduleId: string;
  moduleType: 'learn' | 'practice';
  status: 'not-started' | 'in-progress' | 'completed';
  score?: number; // Overall module score (e.g., average practice score, or completion score)
  lastAccessed?: number; // Timestamp
  lessons: LessonProgress[];
  practiceAttempts: PracticeAttempt[]; // New field for practice attempts
  lastAccessedLessonId?: string; // New field to store the last accessed lesson within the module
  practiceState?: { // New field to store in-progress practice state
    currentIndex: number;
    correctAnswersCount: number;
  };
}

export interface UserProgress {
  userId: string;
  modules: ModuleProgress[];
  lastUpdated: number; // Timestamp of last update to any progress
}
