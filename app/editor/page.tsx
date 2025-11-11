// app/editor/page.tsx
'use client';

import ImageMapEditor from '@/components/ImageMapEditor';

export default function EditorPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Image Map Editor</h1>
      <ImageMapEditor />
    </div>
  );
}
