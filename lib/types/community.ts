export interface CommunityUser {
  id: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  // Add other relevant user profile fields
}

export interface ForumPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: number; // Timestamp
  updatedAt?: number; // Timestamp
  tags?: string[];
  likes?: string[]; // Array of user IDs who liked the post
  comments?: ForumComment[];
}

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: number; // Timestamp
  updatedAt?: number; // Timestamp
  likes?: string[]; // Array of user IDs who liked the comment
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: string[]; // Array of user IDs
  createdAt: number; // Timestamp
  // Add fields for scheduled sessions, resources, etc.
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId?: string; // For direct messages
  groupId?: string; // For group chats
  content: string;
  timestamp: number;
}
