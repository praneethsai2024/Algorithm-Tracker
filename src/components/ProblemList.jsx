import { useState, useMemo } from 'react';
import { Trash2, Search, X, Filter } from 'lucide-react';

function ProblemList({ problems, onDelete }) {
    const [search, setSearch] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('All');
    const [filterPlatform, setFilterPlatform] = useState('All');

    const filteredProblems = useMemo(() => {
        return problems.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
            const matchesDiff = filterDifficulty === 'All' || p.difficulty === filterDifficulty;
            const matchesPlatform = filterPlatform === 'All' || p.platform === filterPlatform;
            return matchesSearch && matchesDiff && matchesPlatform;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [problems, search, filterDifficulty, filterPlatform]);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'var(--accent-success)';
            case 'Medium': return 'var(--accent-warning)';
            case 'Hard': return 'var(--accent-danger)';
            default: return 'var(--text-secondary)';
        }
    };

    if (!problems.length) {
        return (
            <div className="card text-center py-12 border-dashed border-2 border-slate-800 bg-transparent">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800/50 mb-4 text-slate-500">
                    <Search size={24} />
                </div>
                <p className="text-secondary mb-2">No problems solved yet.</p>
                <p className="text-xs text-slate-500">Start your journey today!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search problems or tags..."
                        className="w-full pl-10 bg-slate-900/60 border-slate-700/50 focus:border-sky-500/50"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                    {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                        <button
                            key={diff}
                            onClick={() => setFilterDifficulty(diff)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${filterDifficulty === diff
                                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                    : 'bg-slate-800/50 text-slate-400 border border-transparent hover:bg-slate-700/50'
                                }`}
                        >
                            {diff}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
                {filteredProblems.length === 0 ? (
                    <div className="text-center py-8 text-secondary">
                        No matching problems found.
                    </div>
                ) : (
                    filteredProblems.map((problem) => (
                        <div key={problem.id} className="card flex justify-between items-center p-4 hover:bg-slate-800/30 transition-colors group">
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                    <h3 className="font-semibold text-base truncate text-slate-200 group-hover:text-sky-300 transition-colors">{problem.title}</h3>
                                    <span
                                        style={{
                                            color: getDifficultyColor(problem.difficulty),
                                            backgroundColor: `${getDifficultyColor(problem.difficulty)}15`,
                                            fontSize: '0.7rem',
                                            border: `1px solid ${getDifficultyColor(problem.difficulty)}30`,
                                            padding: '0.1rem 0.5rem',
                                            borderRadius: '0.375rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {problem.difficulty}
                                    </span>
                                    <span className="text-xs text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-800">
                                        {problem.platform}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-secondary mt-2">
                                    <span className="flex items-center gap-1 opacity-70">
                                        {new Date(problem.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <div className="flex gap-2 overflow-hidden">
                                        {problem.tags.map(tag => (
                                            <span key={tag} className="text-slate-400 hover:text-slate-300 transition-colors">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <button
                                    onClick={() => onDelete(problem.id)}
                                    className="btn-ghost p-2 text-slate-600 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ProblemList;
