import Dexie, { Table } from 'dexie';
import { UserProgress } from './types/progress';

export interface ActiveUserSession {
  id: string; // Fixed key, e.g., 'activeUser'
  userId: string;
  username: string; // New field
  email?: string;   // New optional field
}

export interface Feedback {
  id?: number; // Auto-incrementing primary key
  moduleId: string;
  feedback: string;
  timestamp: number;
}

export class MathrebashaDexie extends Dexie {
  userProgress!: Table<UserProgress>;
  userSessions!: Table<ActiveUserSession>; // Updated table type
  feedback!: Table<Feedback>;

  constructor() {
    super('MathrebashaDB');
    this.version(4).stores({
      userProgress: 'userId,modules,badges,games',
    }).upgrade(tx => {
      return tx.table('userProgress').toCollection().modify(progress => {
        if (progress.games === undefined) {
          progress.games = [];
        }
      });
    });
    this.version(3).stores({
      userProgress: 'userId,modules,badges', // Add badges to schema
      userSessions: 'id',
      feedback: '++id,moduleId,timestamp',
    }).upgrade(tx => {
      // For existing users, ensure badges array is initialized
      tx.table('userProgress').toCollection().modify(progress => {
        if (!progress.badges) {
          progress.badges = [];
        }
      });
    });
    this.version(2).stores({
      feedback: '++id,moduleId,timestamp',
    }).upgrade(tx => {
      // No changes needed for userProgress and userSessions tables
    });
    this.version(1).stores({
      userProgress: 'userId', // Primary key is userId
      userSessions: 'id',     // Primary key is 'id' (e.g., 'activeUser')
    });

  }
}

let dbInstance: MathrebashaDexie | undefined;

function getDb(): MathrebashaDexie {
  if (typeof window === 'undefined') {
    // This is a server-side rendering context, return a dummy or throw an error
    // Throwing an error is better to catch misuse early.
    throw new Error('Dexie (IndexedDB) cannot be accessed on the server-side.');
  }
  if (!dbInstance) {
    dbInstance = new MathrebashaDexie();
  }
  return dbInstance;
}

// Helper function to add feedback
export async function addFeedback(moduleId: string, feedback: string): Promise<void> {
  const db = getDb();
  try {
    await db.feedback.add({
      moduleId,
      feedback,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Dexie: Error adding feedback:', error);
  }
}

// Helper function to get or create user progress
export async function getOrCreateUserProgress(userId: string): Promise<UserProgress> {
  const db = getDb();
  return db.transaction('rw', db.userProgress, async () => {
    try {
      let progress = await db.userProgress.get(userId);
      if (!progress) {
        progress = {
          userId,
          modules: [],
          badges: [], // Initialize badges array
          games: [], // Initialize games array
          lastUpdated: Date.now(),
        };
        await db.userProgress.add(progress);
      }
      return progress;
    } catch (error) {
      console.error('Dexie: Error getting or creating user progress for userId:', userId, error);
      throw error; // Re-throw to propagate the error
    }
  });
}

// Helper function to update user progress
export async function saveUserProgressToDb(progress: UserProgress): Promise<void> {
  const db = getDb();
  try {
    progress.lastUpdated = Date.now();
    await db.userProgress.put(progress);
  } catch (error) {
    console.error('Dexie: Error saving user progress to DB for userId:', progress.userId, error);
    if (error instanceof Error) {
      console.error('Dexie: Error name:', error.name);
      console.error('Dexie: Error message:', error.message);
      if (error.stack) {
        console.error('Dexie: Error stack:', error.stack);
      }
    }
    throw error; // Re-throw to propagate the error
  }
}

// Helper functions for active user session
const ACTIVE_USER_KEY = 'activeUser';

export async function saveActiveUser(userId: string, username: string, email?: string): Promise<void> {
  const db = getDb();
  await db.userSessions.put({ id: ACTIVE_USER_KEY, userId, username, email });
}

export async function getActiveUser(): Promise<ActiveUserSession | null> {
  const db = getDb();
  const session = await db.userSessions.get(ACTIVE_USER_KEY);
  return session || null;
}

export async function clearActiveUser(): Promise<void> {
  const db = getDb();
  await db.userSessions.delete(ACTIVE_USER_KEY);
}
