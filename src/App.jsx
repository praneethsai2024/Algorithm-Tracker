import { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import ProblemForm from './components/ProblemForm';
import ProblemList from './components/ProblemList';
import Dashboard from './components/Dashboard';
import { ToastProvider, useToast } from './components/Toast';
import { Plus, Code2 } from 'lucide-react';

function AppContent() {
  const [problems, setProblems] = useLocalStorage('codestreak-problems', []);
  const [isAdding, setIsAdding] = useState(false);
  const { addToast } = useToast();

  const handleAddProblem = (problem) => {
    setProblems(prev => [problem, ...prev]);
    setIsAdding(false);
    addToast("Problem logged successfully!", "success");
  };

  const handleDeleteProblem = (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setProblems(prev => prev.filter(p => p.id !== id));
      addToast("Entry deleted.", "info");
    }
  };

  return (
    <div className="container">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-in slide-in-from-top-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Code2 size={28} />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">
              Algorithm Progress Tracker
            </h1>
          </div>
          <p className="text-secondary text-lg max-w-[60ch] leading-relaxed">
            Level up your algorithmic skills. Track your daily problems, visualize your progress, and build your consistency.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="btn btn-primary shadow-glow group hover:shadow-sky-500/30 transition-all duration-300"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Log Problem
          </button>
        )}
      </header>

      <main className="flex flex-col gap-10">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
          <Dashboard problems={problems} />
        </div>

        {isAdding && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg animate-in zoom-in-95 duration-200">
              <ProblemForm onAdd={handleAddProblem} onClose={() => setIsAdding(false)} />
            </div>
          </div>
        )}

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex justify-between items-center mb-6 pl-1">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-1 bg-gradient-to-r from-sky-500 to-transparent rounded-full"></span>
              Recent Activity
            </h2>
            <span className="text-secondary text-sm font-medium bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
              {problems.length} solved
            </span>
          </div>
          <ProblemList problems={problems} onDelete={handleDeleteProblem} />
        </section>
      </main>

      <footer className="mt-20 text-center text-sm text-secondary opacity-60 pb-8">
        <p>© {new Date().getFullYear()} Algorithm Progress Tracker. Continue the grind.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
