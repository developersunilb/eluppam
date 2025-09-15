'use client';

import { useState, useEffect } from 'react';
import LearnLayout from '@/components/LearnLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MalayalamKeyboard from '@/components/MalayalamKeyboard';
import { Keyboard, Brush } from 'lucide-react';
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';

type InputField = 'name' | 'location' | 'age';

const MODULE_ID = 'about-yourself';

export default function AboutYourselfPage() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState('');

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [activeInput, setActiveInput] = useState<InputField | null>(null);

  const { updateModuleProgress, userProgress } = useProgress();
  const router = useRouter();

  useEffect(() => {
    const isCompleted = name.trim() !== '' && location.trim() !== '' && age.trim() !== '';
    if (isCompleted) {
      updateModuleProgress(MODULE_ID, 'learn', 'completed', 100); // Assuming 100% score for completion
    } else if (name.trim() !== '' || location.trim() !== '' || age.trim() !== '') {
      updateModuleProgress(MODULE_ID, 'learn', 'in-progress');
    } else {
      updateModuleProgress(MODULE_ID, 'learn', 'not-started');
    }
  }, [name, location, age, updateModuleProgress]);

  const handleKeyPress = (char: string) => {
    if (!activeInput) return;

    const setters = {
      name: setName,
      location: setLocation,
      age: setAge,
    };

    setters[activeInput]((prev) => prev + char);
  };

  const handleBackspace = () => {
    if (!activeInput) return;

    const setters = {
        name: setName,
        location: setLocation,
        age: setAge,
    };

    setters[activeInput]((prev) => prev.slice(0, -1));
  };

  return (
    <LearnLayout title="Introduce Yourself">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-kerala-green-800 mb-4">Common Phrases</h2>
          <div className="space-y-4 text-lg">
            <p><span className="font-bold">എൻ്റെ പേര് ...</span> (Ente peru...)</p>
            <p className="ml-4">- My name is ...</p>

            <p><span className="font-bold">എൻ്റെ സ്ഥലം ... ആണ്</span> (Ente sthalam... aanu)</p>
            <p className="ml-4">- My place is ...</p>
            
            <p><span className="font-bold">എനിക്ക് ... വയസ്സായി</span> (Enikku ... vayassayi)</p>
            <p className="ml-4">- I am ... years old.</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-kerala-green-800 mb-4">Practice: Fill in the blanks</h2>
          
          <div className="flex space-x-4 mb-4">
            <Button onClick={() => setIsKeyboardVisible(!isKeyboardVisible)} variant="outline">
              <Keyboard className="h-5 w-5 mr-2" />
              {isKeyboardVisible ? 'Hide' : 'Show'} Keyboard
            </Button>
            <Button variant="outline" disabled>
              <Brush className="h-5 w-5 mr-2" />
              Draw (Coming Soon)
            </Button>
          </div>

          <p className="text-sm text-gray-500 mb-2">Use the keyboard to write in Malayalam.</p>
          <div className="space-y-4 p-6 bg-marigold-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <label htmlFor="name" className="w-24">Name:</label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setActiveInput('name')} placeholder="Your name" />
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="location" className="w-24">From:</label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} onFocus={() => setActiveInput('location')} placeholder="Your location" />
            </div>
            <div className="flex items-center space-x-4">
              <label htmlFor="age" className="w-24">Age:</label>
              <Input id="age" value={age} onChange={(e) => setAge(e.target.value)} onFocus={() => setActiveInput('age')} placeholder="Your age" />
            </div>
          </div>

          {isKeyboardVisible && <MalayalamKeyboard onKeyPress={handleKeyPress} onBackspace={handleBackspace} />}

          <div className="mt-6 p-6 bg-kerala-green-50 rounded-lg text-xl space-y-2">
            <p>എൻ്റെ പേര് <span className="font-bold text-marigold-600">{name || '...'}</span>.</p>
            <p>എൻ്റെ സ്ഥലം <span className="font-bold text-marigold-600">{location || '...'}</span> ആണ്.</p>
            <p>എനിക്ക് <span className="font-bold text-marigold-600">{age || '...'}</span> വയസ്സായി.</p>
          </div>

          <div className="flex justify-between mt-6">
            <Button onClick={() => router.push('/learn')} variant="outline">
              Back to Learn Dashboard
            </Button>
            <Button onClick={() => { setName(''); setLocation(''); setAge(''); updateModuleProgress(MODULE_ID, 'learn', 'not-started'); }} variant="outline">
              Restart
            </Button>
          </div>
        </div>

        {/* Transliteration Coming Soon Section */}
        <div className="mt-8 p-6 bg-marigold-50 rounded-lg text-center">
          <h2 className="text-2xl font-semibold text-kerala-green-800 mb-4">Transliteration Feature</h2>
          <p className="text-lg text-gray-700 mb-4">Type in English and see instant Malayalam script conversion.</p>
          <p className="text-xl font-bold text-marigold-600 mb-4">Coming Soon!</p>
          <p className="text-sm text-gray-600">We are working on a robust and accurate transliteration engine to enhance your learning experience.</p>
        </div>
      </div>
    </LearnLayout>
  );
}