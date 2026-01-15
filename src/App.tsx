import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { generateMockData } from './data/mockData';
import { cn } from './utils/cn';

const App = () => {
  const { sidebarOpen, theme, setData } = useStore();

  useEffect(() => {
    // Generate mock data on mount
    const mockData = generateMockData(10000);
    setData(mockData);
  }, []);

  useEffect(() => {
    // Update body class for dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      theme === 'dark' ? "bg-background text-foreground" : "bg-slate-50 text-slate-900"
    )}>
      <Sidebar />
      <div className={cn(
        "transition-all duration-300 min-h-screen flex flex-col",
        sidebarOpen ? "pl-64" : "pl-20"
      )}>
        <TopNav />
        <main className="flex-1 p-6 overflow-auto">
          {/* Main content will go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Skeletons/Metrics placeholder */}
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="h-24 bg-card rounded-xl border border-border animate-pulse" />
            ))}
          </div>

          <div className="w-full h-[600px] bg-card rounded-xl border border-border animate-pulse flex items-center justify-center text-muted-foreground">
            Loading massive dataset...
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
