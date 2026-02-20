import { useMemo } from 'react';
import { TrophyIcon } from '@heroicons/react/24/solid';

export default function Leaderboard({ participants, rounds }) {
    // Sort by overall rank automatically
    const sorted = useMemo(() => {
        return [...participants].sort((a, b) => {
            // fallback if ranks aren't computed yet
            return (a.rank?.overall || 999) - (b.rank?.overall || 999);
        });
    }, [participants]);

    if (sorted.length === 0) {
        return <div className="p-8 text-center text-slate-500">No ranked participants yet.</div>;
    }

    const getMedalColor = (medal) => {
        switch (medal) {
            case 'gold': return 'text-yellow-500';
            case 'silver': return 'text-slate-400';
            case 'bronze': return 'text-amber-600';
            default: return 'text-transparent';
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3 text-sm font-semibold text-slate-700 w-16 text-center">Rank</th>
                        <th className="px-4 py-3 text-sm font-semibold text-slate-700">Participant</th>
                        <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-center">Medal</th>
                        {rounds.map(r => (
                            <th key={r.id} className="px-4 py-3 text-sm font-semibold text-slate-700 text-right">
                                {r.name}
                            </th>
                        ))}
                        <th className="px-4 py-3 text-sm font-semibold text-slate-900 text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {sorted.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-center font-bold text-slate-700">
                                {p.rank?.inCategory || '-'}
                            </td>
                            <td className="px-4 py-3">
                                <div className="font-medium text-slate-900">{p.name}</div>
                                <div className="text-xs text-slate-500">{p.school}</div>
                            </td>
                            <td className="px-4 py-3 text-center">
                                {p.medal ? (
                                    <TrophyIcon className={`w-5 h-5 mx-auto ${getMedalColor(p.medal)}`} title={p.medal} />
                                ) : (
                                    <span className="text-slate-300">-</span>
                                )}
                            </td>
                            {rounds.map(r => (
                                <td key={r.id} className="px-4 py-3 text-sm text-slate-600 text-right">
                                    {p.scores?.[r.id] !== undefined ? p.scores[r.id] : '-'}
                                </td>
                            ))}
                            <td className="px-4 py-3 font-mono font-semibold text-slate-900 text-right">
                                {p.totalWeighted !== undefined ? Number(p.totalWeighted).toFixed(1) : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
