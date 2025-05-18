import React from 'react';  // Required for JSX
import { PlaneTakeoffIcon } from 'lucide-react';
import { RouteList } from './components/RouteList';

export function App() {
  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <PlaneTakeoffIcon className="h-8 w-8 mr-3" />
          <h1 className="text-2xl font-bold">Route Price Manager</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <RouteList />
        </div>
      </main>
    </div>
  );
}