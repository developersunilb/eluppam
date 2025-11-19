import React from 'react';
import Link from 'next/link';
import { Users, MessageSquare, BookUser, PlusCircle, Heart, MessageCircle } from 'lucide-react';
import { ForumPost, StudyGroup } from '@/lib/types/community'; // Import the new types

const mockForumPosts: ForumPost[] = [
  {
    id: 'post1',
    authorId: 'user1',
    title: 'Tips for learning Malayalam vowels?',
    content: 'I\'m struggling with some of the vowel sounds. Any tips or resources that helped you?',
    createdAt: Date.now() - 86400000 * 2, // 2 days ago
    tags: ['vowels', 'beginner', 'pronunciation'],
    likes: ['user2', 'user3'],
    comments: [
      { id: 'comment1', postId: 'post1', authorId: 'user2', content: 'Try practicing with the Eluppam vowel games!', createdAt: Date.now() - 86400000 * 1.5, likes: ['user1'] },
      { id: 'comment2', postId: 'post1', authorId: 'user4', content: 'Listening to Malayalam songs helped me a lot.', createdAt: Date.now() - 86400000 * 1, likes: [] },
    ],
  },
  {
    id: 'post2',
    authorId: 'user5',
    title: 'Best Malayalam movies for learners?',
    content: 'Looking for some good Malayalam movies with subtitles to improve my listening skills. Any recommendations?',
    createdAt: Date.now() - 86400000 * 5, // 5 days ago
    tags: ['movies', 'listening', 'culture'],
    likes: ['user1', 'user3', 'user4'],
    comments: [],
  },
];

const mockStudyGroups: StudyGroup[] = [
  {
    id: 'group1',
    name: 'Beginner Malayalam Study Group',
    description: 'A group for new learners to practice basic vocabulary and grammar together.',
    creatorId: 'user1',
    members: ['user1', 'user2', 'user3'],
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'group2',
    name: 'Advanced Conversation Practice',
    description: 'For learners who want to practice speaking Malayalam with more fluency.',
    creatorId: 'user5',
    members: ['user5', 'user4'],
    createdAt: Date.now() - 86400000 * 7,
  },
];

const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <Users className="h-12 w-12 text-green-500 mr-4" />
          <h1 className="text-4xl font-bold text-kerala-green-800">Community Hub</h1>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md text-center mb-12">
          <h2 className="text-2xl font-bold text-kerala-green-700 mb-4">Connect with Fellow Learners</h2>
          <p className="text-lg text-gray-700 mb-8">
            Our community features are under active development! We've defined the data structures for forums, study groups, and chat. Soon, you'll be able to connect with other Malayalam learners, join study groups, and practice your conversation skills.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="flex items-start">
              <MessageSquare className="h-8 w-8 text-marigold-500 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-kerala-green-800">Community Forums</h3>
                <p className="text-gray-600">Ask questions, share resources, and discuss your learning journey.</p>
              </div>
            </div>
            <div className="flex items-start">
              <BookUser className="h-8 w-8 text-marigold-500 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-kerala-green-800">Study Groups</h3>
                <p className="text-gray-600">Form or join study groups to learn and practice together.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="h-8 w-8 text-marigold-500 mr-4 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-kerala-green-800">Conversation Practice</h3>
                <p className="text-gray-600">Connect with native speakers for real-world conversation practice.</p>
              </div>
            </div>
          </div>
          <button
            disabled
            className="mt-12 bg-gray-400 text-white font-bold py-3 px-8 rounded-lg cursor-not-allowed"
          >
            Explore Community (Coming Soon)
          </button>
        </div>

        {/* Mock Forum Posts Section */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-kerala-green-800">Recent Forum Posts</h2>
            <Link href="#" className="text-blue-600 hover:underline flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" /> New Post
            </Link>
          </div>
          <div className="space-y-6">
            {mockForumPosts.map((post) => (
              <div key={post.id} className="border-b pb-4 last:border-b-0">
                <h3 className="text-xl font-semibold text-kerala-green-700">{post.title}</h3>
                <p className="text-gray-700 mt-2">{post.content}</p>
                <div className="flex items-center text-sm text-gray-500 mt-3">
                  <span>Posted by {post.authorId}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center"><Heart className="h-4 w-4 mr-1" /> {post.likes?.length || 0}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center"><MessageCircle className="h-4 w-4 mr-1" /> {post.comments?.length || 0}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags?.map(tag => (
                    <span key={tag} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8">This is a mock forum. Real-time interaction and more features are coming soon!</p>
        </div>

        {/* Mock Study Groups Section */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-kerala-green-800">Study Groups</h2>
            <Link href="#" className="text-blue-600 hover:underline flex items-center">
              <PlusCircle className="h-5 w-5 mr-2" /> Create Group
            </Link>
          </div>
          <div className="space-y-6">
            {mockStudyGroups.map((group) => (
              <div key={group.id} className="border-b pb-4 last:border-b-0">
                <h3 className="text-xl font-semibold text-kerala-green-700">{group.name}</h3>
                <p className="text-gray-700 mt-2">{group.description}</p>
                <div className="flex items-center text-sm text-gray-500 mt-3">
                  <span>Members: {group.members.length}</span>
                  <span className="mx-2">•</span>
                  <span>Created by {group.creatorId}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8">These are mock study groups. Dynamic group management and interaction features are coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
