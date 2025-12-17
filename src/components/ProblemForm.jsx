import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const PLATFORMS = ['LeetCode', 'Codeforces', 'CodeChef', 'HackerRank', 'AtCoder', 'Other'];

function ProblemForm({ onAdd, onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        platform: 'LeetCode',
        difficulty: 'Easy',
        tags: '',
        date: new Date().toISOString().split('T')[0],
        link: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title) return;

        onAdd({
            ...formData,
            id: crypto.randomUUID(),
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        });

        // Reset or close
        if (onClose) onClose();
        else setFormData({
            title: '',
            platform: 'LeetCode',
            difficulty: 'Easy',
            tags: '',
            date: new Date().toISOString().split('T')[0],
            link: ''
        });
    };

    return (
        <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="flex justify-between items-center mb-4">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Log Solved Problem</h2>
                {onClose && (
                    <button onClick={onClose} className="btn-ghost" aria-label="Close">
                        <X size={20} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-secondary mb-1 text-sm">Problem Title</label>
                    <input
                        className="w-full"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Two Sum"
                        required
                        autoFocus
                    />
                </div>

                <div className="flex gap-4">
                    <div className="w-full">
                        <label className="block text-secondary mb-1 text-sm">Platform</label>
                        <select
                            className="w-full"
                            value={formData.platform}
                            onChange={e => setFormData({ ...formData, platform: e.target.value })}
                        >
                            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div className="w-full">
                        <label className="block text-secondary mb-1 text-sm">Difficulty</label>
                        <select
                            className="w-full"
                            value={formData.difficulty}
                            onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                        >
                            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-secondary mb-1 text-sm">Tags</label>
                    <input
                        className="w-full"
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="Array, DP, Sliding Window (comma separated)"
                    />
                </div>

                <div>
                    <label className="block text-secondary mb-1 text-sm">Date Solved</label>
                    <input
                        type="date"
                        className="w-full"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary mt-4 justify-center">
                    <Plus size={18} />
                    Add Problem
                </button>
            </form>
        </div>
    );
}

export default ProblemForm;
