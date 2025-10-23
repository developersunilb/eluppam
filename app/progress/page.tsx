'use client';

import React from 'react';
import LearnLayout from '@/components/LearnLayout';
import { useProgress } from '@/context/ProgressContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Loader, XCircle, Play, RefreshCw, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { ModuleProgress, PracticeAttempt, LessonProgress } from '@/lib/types/progress';

// Import data arrays for total counts
import { vowels } from '@/lib/data';
import { practiceVowels, practiceConsonants, practiceChillaksharangal, practiceNumbers, practiceKootaksharangal, practiceFestivals, practiceSeasons, practiceCities } from '@/lib/practice-data';
import { TOTAL_QUESTIONS as WhackAVowelTotalQuestions } from '@/components/WhackAVowelGame';
import { TOTAL_QUESTIONS as EmojiWordMatchTotalQuestions } from '@/components/EmojiWordMatchGame';
import { MALAYALAM_CONSONANTS } from '@/components/ConsonantSpaceRunnerGame';


const ProgressPage = () => {
  const { userProgress, loading, error, resetModuleProgress } = useProgress();

  if (loading) {
    return (
        <div className="text-center pt-20">
          <Loader className="animate-spin h-10 w-10 text-kerala-green-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your progress...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="text-center pt-20 text-red-600">
          <XCircle className="h-10 w-10 mx-auto mb-4" />
          <p className="text-lg">Error loading progress: {error}</p>
          <p className="text-sm text-gray-500">Please try refreshing the page.</p>
        </div>
    );
  }

  if (!userProgress || (userProgress.modules.length === 0 && userProgress.badges.length === 0)) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <p className="text-lg text-gray-600">No progress recorded yet. Start learning or earning badges to see your progress here!</p>
        </div>
    );
  }

  // Helper to get total lessons/questions for a module
  const getTotalItems = (moduleId: string) => {
    switch (moduleId) {
      case 'vowels':
        return vowels.length;
      case 'vowels-practice':
        return practiceVowels.length;
      case 'consonants-practice':
        return practiceConsonants.length;
      case 'chillaksharangal-practice':
        return practiceChillaksharangal.length;
      case 'numbers-practice':
        return practiceNumbers.length;
      case 'kootaksharangal-practice':
        return practiceKootaksharangal.length;
      case 'common-words-festivals-practice':
        return practiceFestivals.length;
      case 'common-words-seasons-practice':
        return practiceSeasons.length;
      case 'common-words-cities-practice':
        return practiceCities.length;
      case 'whack-a-vowel':
        return WhackAVowelTotalQuestions;
      case 'emoji-word-match':
        return EmojiWordMatchTotalQuestions;
      case 'consonant-runner':
        return MALAYALAM_CONSONANTS.length;
      default:
        return 0;
    }
  };

  // Calculate overall progress (can be refined further)
  const totalTrackedModules = userProgress.modules.filter(m => getTotalItems(m.moduleId) > 0).length;
  const completedTrackedModules = userProgress.modules.filter(m => m.status === 'completed' && getTotalItems(m.moduleId) > 0).length;
  const overallProgressPercentage = totalTrackedModules > 0 ? (completedTrackedModules / totalTrackedModules) * 100 : 0;

  const learningModules = userProgress.modules.filter(m => m.moduleType === 'learn');
  const practiceModules = userProgress.modules.filter(m => m.moduleType === 'practice');

  const ModuleCard = ({ module }: { module: ModuleProgress }) => {
    const totalItems = getTotalItems(module.moduleId);
    const currentProgressIndex = module.practiceState?.currentIndex !== undefined 
      ? module.practiceState.currentIndex 
      : (module.lastAccessedLessonId ? vowels.findIndex(v => v.vowel === module.lastAccessedLessonId) : 0);
    
    const moduleProgressPercentage = module.status === 'not-started'
      ? 0
      : (totalItems > 0 && module.status !== 'completed'
        ? (currentProgressIndex / totalItems) * 100
        : (module.status === 'completed' ? 100 : 0));

    const resumeLink = (() => {
      const basePath = module.moduleType === 'learn' ? '/learn' : '/practice';
      const moduleName = module.moduleId.replace('-practice', '');
      
      switch (module.moduleId) {
        case 'vowels':
          return `/learn/vowels?start=${currentProgressIndex}`;
        case 'vowels-practice':
          return `/practice/vowels?start=${currentProgressIndex}`;
        case 'consonants-practice':
          return `/practice/consonants`;
        case 'chillaksharangal-practice':
          return `/practice/chillaksharangal`;
        case 'numbers-practice':
          return `/practice/numbers`;
        case 'kootaksharangal-practice':
          return `/practice/kootaksharangal`;
        case 'common-words-festivals-practice':
        case 'common-words-seasons-practice':
        case 'common-words-cities-practice':
          return `/practice/common-words`;
        default:
          return '#';
      }
    })();

    return (
      <Card key={module.moduleId} className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium text-kerala-green-800">
            {module.moduleId.charAt(0).toUpperCase() + module.moduleId.slice(1).replace('-', ' ')} {/* Basic capitalization and replace hyphen */}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-5 w-5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Complete all lessons and practice sessions with a score of 80% or higher to complete this module.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {module.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
          {module.status === 'in-progress' && <Loader className="h-5 w-5 text-marigold-500 animate-spin" />}
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-kerala-green-700 mb-2">
            Status: {module.status.replace('-', ' ')}
          </div>
          {module.status === 'in-progress' && totalItems > 0 && (
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Progress: {currentProgressIndex} / {totalItems}</span>
                <span>{moduleProgressPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={moduleProgressPercentage} className="w-full" />
              <Link href={resumeLink}>
                {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                }
                <Button size="sm" className="mt-2 w-full bg-kerala-green-500 hover:bg-kerala-green-600 text-white">
                  <Play className="h-4 w-4 mr-2" /> Resume
                </Button>
              </Link>
            </div>
          )}
          {module.score !== undefined && module.status === 'completed' && (
            <p className="text-lg text-kerala-green-700">Score: {module.score.toFixed(0)}%</p>
          )}
          {module.status === 'not-started' && (
            <p className="text-lg text-gray-500">Not started</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Last accessed: {new Date(module.lastAccessed || Date.now()).toLocaleString()}
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="mt-2 w-full">
                <RefreshCw className="h-4 w-4 mr-2" /> Reset Progress
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all your progress for the {module.moduleId.replace('-', ' ')} module, including practice attempts and scores. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => resetModuleProgress(module.moduleId)}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {module.practiceAttempts && module.practiceAttempts.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-kerala-green-600 mb-2">Practice Attempts:</h3>
              <ul className="space-y-1">
                {module.practiceAttempts.map((attempt: PracticeAttempt, index) => (
                  <li key={attempt.attemptId || index} className="text-sm text-gray-700 flex justify-between items-center">
                    <span>Attempt {index + 1}: {attempt.score.toFixed(0)}%</span>
                    <span className="text-xs text-gray-500">{new Date(attempt.timestamp).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {module.lessons.length > 0 && module.moduleId !== 'vowels' && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-kerala-green-600">Lessons:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {module.lessons.map((lesson: LessonProgress) => (
                  <li key={lesson.lessonId} className="flex items-center">
                    {lesson.completed ? <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" /> : <XCircle className="h-4 w-4 text-red-500 mr-1" />}
                    {lesson.lessonId} {lesson.score !== undefined ? `(${lesson.score}%)` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <LearnLayout title="Your Progress">
      <div className="flex justify-end mb-4 space-x-2"> {/* Added space-x-2 for spacing */}
        {userProgress?.badges && userProgress.badges.length > 0 && (
          <Link href="/badgesearned">
            {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
            }
            <Button variant="outline">
              Badges
            </Button>
          </Link>
        )}
        <Link href="/progress/faq">
          {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
          }
          <Button variant="outline">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </Button>
        </Link>
      </div>
      <div className="space-y-8">
        <Card className="bg-gradient-to-r from-marigold-100 to-kerala-green-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-kerala-green-800">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg text-kerala-green-700">{completedTrackedModules} of {totalTrackedModules} tracked modules completed</p>
              <p className="text-lg font-semibold text-kerala-green-800">{overallProgressPercentage.toFixed(0)}%</p>
            </div>
            <Progress value={overallProgressPercentage} className="w-full" />
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-kerala-green-800 mb-4">Learning Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningModules.map(module => <ModuleCard key={module.moduleId} module={module} />)}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-kerala-green-800 mb-4">Practice Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceModules.map(module => <ModuleCard key={module.moduleId} module={module} />)}
          </div>
        </div>
      </div>
    </LearnLayout>
  );
};

export default ProgressPage;
