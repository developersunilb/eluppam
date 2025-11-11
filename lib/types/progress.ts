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
}

export interface ModuleProgress {
  moduleId: string;
  moduleType: 'learn' | 'practice';
  status: 'not-started' | 'in-progress' | 'completed';
  score?: number; // Overall module score (e.g., average practice score, or completion score)
  lastAccessed?: number; // Timestamp
  lessons: LessonProgress[];
  practiceAttempts: PracticeAttempt[];
  lastAccessedLessonId?: string;
  practiceState?: {
    currentIndex: number;
    correctAnswersCount: number;
  };
}

export interface GameLevel {
  id: string;
  title: string;
  description: string;
  href: string;
  prerequisite?: string;
  sublevels?: GameLevel[];
}

export interface Badge {
  id: string;
  name: string;
  image: string; // Data URL of the badge image
  dateEarned: number; // Timestamp
}

export interface GameProgress {
  gameName: string;
  score: number;
  date: number;
}

export interface UserProgress {
  userId: string;
  modules: ModuleProgress[];
  badges: Badge[]; // New field
  games: GameProgress[];
  lastUpdated: number;
}
