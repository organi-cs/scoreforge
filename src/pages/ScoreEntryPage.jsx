import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompetition } from '../hooks/useCompetition';
import { useParticipants } from '../hooks/useParticipants';
import ScoreEntryGrid from '../components/scoring/ScoreEntryGrid';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { computeRankings } from '../lib/rankingEngine';

export default function ScoreEntryPage() {
    const { id } = useParams();
    const { competition, loading: compLoading } = useCompetition(id);
    const { participants, loading: partLoading, updateParticipantScore, clearAllScores } = useParticipants(id);
    const [activeCategory, setActiveCategory] = useState('all');

    const rankedParticipants = useMemo(() => {
        if (!competition || !participants) return [];
        return computeRankings(participants, competition.rounds || [], competition.medalRules);
    }, [competition, participants]);

    if (compLoading || partLoading) {
        return <div className="p-8 text-center text-slate-500 animate-pulse">Loading score sheet...</div>;
    }

    if (!competition) {
        return <div className="p-8 text-center text-red-500">Competition not found</div>;
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Score Entry: {competition.name}
                        </h1>
                        <p className="text-slate-500">Auto-saves as you type.</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (window.confirm("Are you sure you want to clear ALL scores for everyone? This cannot be undone.")) {
                            clearAllScores();
                        }
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg font-medium transition whitespace-nowrap"
                >
                    <TrashIcon className="w-5 h-5" />
                    Clear All Scores
                </button>
            </div>

            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition ${activeCategory === 'all'
                        ? 'bg-slate-800 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                >
                    All Categories
                </button>
                {competition.categories?.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition ${activeCategory === cat.id
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <ScoreEntryGrid
                participants={rankedParticipants}
                rounds={competition.rounds || []}
                categoryId={activeCategory}
                updateScore={updateParticipantScore}
            />

            <div className="mt-8 flex justify-end">
                <Link
                    to={`/competition/${id}/results`}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition shadow-sm"
                >
                    View Results & Rankings
                </Link>
            </div>
        </div>
    );
}
