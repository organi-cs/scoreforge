import { computeStats } from '../../lib/statsEngine';

export default function StatsPanel({ participants }) {
    // Extract all totalWeighted scores for overall stats
    const totals = participants.map(p => p.totalWeighted).filter(v => v !== undefined);
    const stats = computeStats(totals);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard label="Total Participants" value={stats.count} />
            <StatCard label="Mean Score" value={stats.mean} />
            <StatCard label="Median Score" value={stats.median} />
            <StatCard label="Highest Score" value={stats.max || 0} className="text-green-600" />
            <StatCard label="Lowest Score" value={stats.min || 0} className="text-red-500" />
        </div>
    );
}

function StatCard({ label, value, className = 'text-slate-900' }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-center">
            <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">{label}</div>
            <div className={`text-2xl font-bold ${className}`}>{value}</div>
        </div>
    );
}
