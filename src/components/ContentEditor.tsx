
import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import Navigation from './Navigation';

const ContentEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = grapesjs.init({
        container: editorRef.current,
        components: '<div>Start creating your page here!</div>',
        style: '',
        storageManager: false, // Disable storage for demo
      });

      return () => {
        editor.destroy();
      };
    }
  }, []);

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Content Editor</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div ref={editorRef} className="border border-gray-300 rounded-lg min-h-96"></div>
        </main>
      </div>
    </div>
  );
};

export default ContentEditor;