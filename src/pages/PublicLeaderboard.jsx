import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompetition } from '../hooks/useCompetition';
import { useParticipants } from '../hooks/useParticipants';
import { computeRankings } from '../lib/rankingEngine';
import Leaderboard from '../components/results/Leaderboard';
import StatsPanel from '../components/results/StatsPanel';

export default function PublicLeaderboard() {
    const { id } = useParams();
    // Reusing the same hooks, since we updated firestore rules to allow public read
    const { competition, loading: compLoading } = useCompetition(id);
    const { participants, loading: partLoading } = useParticipants(id);
    const [activeCategory, setActiveCategory] = useState('all');

    const rankedParticipants = useMemo(() => {
        if (!competition || !participants) return [];
        return computeRankings(participants, competition.rounds || [], competition.medalRules);
    }, [competition, participants]);

    const displayParticipants = useMemo(() => {
        if (activeCategory === 'all') return rankedParticipants;
        return rankedParticipants.filter(p => p.categoryId === activeCategory);
    }, [rankedParticipants, activeCategory]);

    if (compLoading || partLoading) {
        return <div className="p-8 text-center text-slate-500 animate-pulse">Computing Live Results...</div>;
    }

    if (!competition) {
        return <div className="p-8 text-center text-red-500">Competition not found or private</div>;
    }

    if (competition.status === 'draft') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center bg-white p-12 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full">
                    <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 border border-amber-100">
                        <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Leaderboard Offline</h2>
                    <p className="text-slate-500">
                        This competition is currently in draft mode and the results are not yet public. Please check back later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-8 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                        {competition.name}
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Live Leaderboard & Statistics. Rankings update in real-time as scores are entered.
                    </p>
                </div>

                <div className="mb-10">
                    <StatsPanel participants={displayParticipants} />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 flex gap-2 overflow-x-auto border-b border-slate-200 bg-slate-50/50">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition ${activeCategory === 'all'
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            Overall Rankings
                        </button>
                        {competition.categories?.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition ${activeCategory === cat.id
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        <Leaderboard
                            participants={displayParticipants}
                            rounds={competition.rounds || []}
                            medalRules={competition.medalRules}
                        />
                    </div>
                </div>

                <div className="text-center mt-12">
                    <p className="text-sm text-slate-400">
                        Powered by <Link to="/" className="font-semibold text-slate-500 hover:text-slate-700">ScoreForge</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
