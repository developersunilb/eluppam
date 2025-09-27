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

export const db = new MathrebashaDexie();

// Helper function to add feedback
export async function addFeedback(moduleId: string, feedback: string): Promise<void> {
  await db.feedback.add({
    moduleId,
    feedback,
    timestamp: Date.now(),
  });
}

// Helper function to get or create user progress
export async function getOrCreateUserProgress(userId: string): Promise<UserProgress> {
  let progress = await db.userProgress.get(userId);
  if (!progress) {
    progress = {
      userId,
      modules: [],
      badges: [], // Initialize badges array
      lastUpdated: Date.now(),
    };
    await db.userProgress.add(progress);
  }
  return progress;
}

// Helper function to update user progress
export async function updateUserProgress(progress: UserProgress): Promise<void> {
  progress.lastUpdated = Date.now();
  await db.userProgress.put(progress);
}

// Helper functions for active user session
const ACTIVE_USER_KEY = 'activeUser';

export async function saveActiveUser(userId: string, username: string, email?: string): Promise<void> {
  await db.userSessions.put({ id: ACTIVE_USER_KEY, userId, username, email });
}

export async function getActiveUser(): Promise<ActiveUserSession | null> {
  const session = await db.userSessions.get(ACTIVE_USER_KEY);
  return session || null;
}

export async function clearActiveUser(): Promise<void> {
  await db.userSessions.delete(ACTIVE_USER_KEY);
}
