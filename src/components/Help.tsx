import React from 'react';
import Navigation from './Navigation';

const Help: React.FC = () => (
  <div>
    <Navigation />
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Help</h1>
      <p>Find answers to common questions and guides here.</p>
    </main>
  </div>
);

export default Help;
