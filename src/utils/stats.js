import { differenceInDays, parseISO, startOfDay, subDays, format } from 'date-fns';

export const calculateStats = (problems) => {
    const totalSolved = problems.length;

    // Difficulty Distribution
    const difficultyDistribution = problems.reduce((acc, curr) => {
        acc[curr.difficulty] = (acc[curr.difficulty] || 0) + 1;
        return acc;
    }, { Easy: 0, Medium: 0, Hard: 0 });

    // Streak Calculation
    // 1. Get unique solved dates
    const uniqueDates = [...new Set(problems.map(p => p.date))].sort().reverse();

    let currentStreak = 0;
    const today = startOfDay(new Date());

    if (uniqueDates.length > 0) {
        const lastSolvedDate = startOfDay(parseISO(uniqueDates[0]));
        const diff = differenceInDays(today, lastSolvedDate);

        // If last solved was today or yesterday, the streak is alive
        if (diff <= 1) {
            currentStreak = 1;
            let prevDate = lastSolvedDate;

            for (let i = 1; i < uniqueDates.length; i++) {
                const currDate = startOfDay(parseISO(uniqueDates[i]));
                if (differenceInDays(prevDate, currDate) === 1) {
                    currentStreak++;
                    prevDate = currDate;
                } else {
                    break;
                }
            }
        }
    }

    // Last 7 Days Activity
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayName = format(date, 'EEE'); // Mon, Tue...

        // Count problems for this date
        const count = problems.filter(p => p.date === dateStr).length;

        last7Days.push({
            date: dateStr,
            name: dayName,
            count: count
        });
    }

    return {
        totalSolved,
        difficultyDistribution: [
            { name: 'Easy', value: difficultyDistribution.Easy, fill: 'var(--accent-success)' },
            { name: 'Medium', value: difficultyDistribution.Medium, fill: 'var(--accent-warning)' },
            { name: 'Hard', value: difficultyDistribution.Hard, fill: 'var(--accent-danger)' },
        ],
        currentStreak,
        activityData: last7Days
    };
};
