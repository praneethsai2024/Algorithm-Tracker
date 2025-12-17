import { useMemo } from 'react';
import { calculateStats } from '../utils/stats';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Trophy, Flame, Target } from 'lucide-react';

function StatCard({ title, value, icon: Icon, color, subtext }) {
    return (
        <div className="card flex items-center gap-4 relative overflow-hidden group">
            <div
                className="absolute right-0 top-0 opacity-10 transform scale-150 -translate-y-2 translate-x-2 transition-transform group-hover:scale-175 group-hover:rotate-12"
                style={{ color: color }}
            >
                <Icon size={120} />
            </div>

            <div
                className="p-3 rounded-xl backdrop-blur-md relative z-10"
                style={{ backgroundColor: `${color}15`, color: color, boxShadow: `0 0 15px ${color}20` }}
            >
                <Icon size={24} />
            </div>
            <div className="relative z-10">
                <div className="text-secondary text-sm font-medium mb-1">{title}</div>
                <div className="text-3xl font-bold tracking-tight">{value}</div>
                {subtext && <div className="text-xs text-secondary mt-1 opacity-80">{subtext}</div>}
            </div>
        </div>
    );
}

function Dashboard({ problems }) {
    const stats = useMemo(() => calculateStats(problems), [problems]);

    return (
        <div className="flex flex-col gap-6 animate-in">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Total Solved"
                    value={stats.totalSolved}
                    icon={Target}
                    color="var(--accent-primary)"
                    subtext="Keep pushing!"
                />
                <StatCard
                    title="Current Streak"
                    value={`${stats.currentStreak} Days`}
                    icon={Flame}
                    color="var(--accent-warning)"
                    subtext="Don't break the chain"
                />
                <StatCard
                    title="Consistency"
                    value={stats.currentStreak > 7 ? "Elite" : "Growing"}
                    icon={Trophy}
                    color="var(--accent-secondary)"
                    subtext="Based on recent activity"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Activity Chart */}
                <div className="card min-h-[350px] flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6 z-10">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <span className="w-1 h-5 rounded-full bg-sky-500"></span>
                            Activity Trend
                        </h3>
                    </div>

                    <div className="flex-1 w-full h-[250px] z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.activityData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    stroke="var(--text-secondary)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ stroke: 'var(--border-color)', strokeWidth: 1, strokeDasharray: '3 3' }}
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-card)',
                                        borderColor: 'var(--glass-border)',
                                        borderRadius: 'var(--radius-md)',
                                        backdropFilter: 'blur(10px)',
                                        boxShadow: 'var(--shadow-md)',
                                        color: 'var(--text-primary)'
                                    }}
                                    itemStyle={{ color: 'var(--accent-primary)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="var(--accent-primary)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Difficulty Distribution */}
                <div className="card min-h-[350px] flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6 z-10">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <span className="w-1 h-5 rounded-full bg-indigo-500"></span>
                            Difficulty Mix
                        </h3>
                    </div>

                    <div className="flex-1 w-full h-[250px] flex items-center justify-center z-10">
                        {stats.totalSolved > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.difficultyDistribution}
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {stats.difficultyDistribution.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.fill}
                                                style={{ filter: `drop-shadow(0 0 8px ${entry.fill}40)` }}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--bg-card)',
                                            borderColor: 'var(--glass-border)',
                                            borderRadius: 'var(--radius-md)',
                                            backdropFilter: 'blur(10px)',
                                            boxShadow: 'var(--shadow-md)'
                                        }}
                                        itemStyle={{ color: 'var(--text-primary)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center">
                                <div className="text-6xl mb-2 opacity-20">📊</div>
                                <p className="text-secondary text-sm">Solve a problem to see your stats!</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center gap-6 text-sm pb-2 z-10">
                        {stats.difficultyDistribution.map((item) => (
                            <div key={item.name} className="flex flex-col items-center gap-1">
                                <div className="text-xs text-secondary font-medium uppercase tracking-wider">{item.name}</div>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill, boxShadow: `0 0 10px ${item.fill}` }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
