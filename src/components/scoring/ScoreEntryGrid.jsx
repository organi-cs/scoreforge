import { useState, useCallback, useMemo } from 'react';
import { ScoreCell } from './ScoreCell';

export default function ScoreEntryGrid({ participants, rounds, categoryId, updateScore }) {
    const [savingCells, setSavingCells] = useState(new Set());

    // Filter and sort initially by name
    const displayParticipants = useMemo(() => {
        let filtered = participants;
        if (categoryId !== 'all') {
            filtered = participants.filter(p => p.categoryId === categoryId);
        }
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }, [participants, categoryId]);

    const handleScoreChange = useCallback((participantId, roundId, value) => {
        const numValue = value === '' ? 0 : parseFloat(value);

        // Optimistic UI saving indicator
        const cellKey = `${participantId}-${roundId}`;
        setSavingCells(prev => new Set(prev).add(cellKey));

        // Simulate debounce/network call
        setTimeout(() => {
            updateScore(participantId, roundId, numValue);
            setSavingCells(prev => {
                const next = new Set(prev);
                next.delete(cellKey);
                return next;
            });
        }, 400); // MOCK 400ms save latency
    }, [updateScore]);

    const handleKeyDown = (e, rowIndex, colIndex) => {
        // Arrow keys / Enter navigation is complex in standard HTML tables without full refs mapping
        // We'll implement basic Enter -> down functionality for now
        if (e.key === 'Enter') {
            e.preventDefault();
            // Try to focus next row, same column
            const form = e.target.closest('tbody');
            if (!form) return;
            const inputs = Array.from(form.querySelectorAll(`input[data-col="${colIndex}"]`));
            const currentIndex = inputs.indexOf(e.target);
            if (currentIndex < inputs.length - 1) {
                inputs[currentIndex + 1].focus();
                inputs[currentIndex + 1].select();
            }
        }
    };

    if (displayParticipants.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
                <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No participants found</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                    There are no participants registered in this category yet. Return to the dashboard or setup page to manage participants.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3 text-sm font-semibold text-slate-700 w-16">#</th>
                        <th className="px-4 py-3 text-sm font-semibold text-slate-700 min-w-[200px]">Participant</th>
                        {rounds.map(round => (
                            <th key={round.id} className="px-4 py-3 text-sm font-semibold text-slate-700 text-center">
                                {round.name}
                            </th>
                        ))}
                        <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-center w-24 bg-slate-100/50">Total</th>
                        <th className="px-4 py-3 text-sm font-bold text-primary-700 text-center w-24 bg-primary-50">Rank</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {displayParticipants.map((p, rowIndex) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-slate-500">{rowIndex + 1}</td>
                            <td className="px-4 py-3">
                                <div className="font-medium text-slate-900">{p.name}</div>
                                <div className="text-xs text-slate-500">{p.school}</div>
                            </td>
                            {rounds.map((round, colIndex) => {
                                const cellKey = `${p.id}-${round.id}`;
                                return (
                                    <td key={round.id} className="px-4 py-3 text-center">
                                        <ScoreCell
                                            value={p.scores?.[round.id]}
                                            isSaving={savingCells.has(cellKey)}
                                            onChange={(val) => handleScoreChange(p.id, round.id, val)}
                                            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                        />
                                    </td>
                                );
                            })}
                            <td className="px-4 py-3 text-center font-medium text-slate-700 bg-slate-50/50">
                                {p.totalWeighted != null ? (typeof p.totalWeighted === 'number' && !Number.isInteger(p.totalWeighted) ? p.totalWeighted.toFixed(2) : p.totalWeighted) : '0'}
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-primary-700 bg-primary-50/50">
                                {p.rank?.inCategory || '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
