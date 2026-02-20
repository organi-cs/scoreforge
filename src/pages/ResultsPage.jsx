import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCompetition } from '../hooks/useCompetition';
import { useParticipants } from '../hooks/useParticipants';
import { computeRankings } from '../lib/rankingEngine';
import { exportResultsToCSV } from '../lib/csvUtils';
import Leaderboard from '../components/results/Leaderboard';
import StatsPanel from '../components/results/StatsPanel';
import CertificateBatchGenerator from '../components/certificates/CertificateBatchGenerator';
import { ArrowLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function ResultsPage() {
    const { id } = useParams();
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
        return <div className="p-8 text-center text-slate-500 animate-pulse">Computing Results...</div>;
    }

    if (!competition) {
        return <div className="p-8 text-center text-red-500">Competition not found</div>;
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        to={`/competition/${id}/scores`}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Results: {competition.name}
                        </h1>
                        <p className="text-slate-500">Live rankings and statistics</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            const url = `${window.location.origin}/public/${id}/leaderboard`;
                            navigator.clipboard.writeText(url);
                            alert('Public link copied to clipboard!');
                        }}
                        className="flex items-center gap-2 bg-white border border-primary-300 text-primary-700 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition shadow-sm"
                    >
                        Share Live
                    </button>
                    <button
                        onClick={() => exportResultsToCSV(displayParticipants, competition)}
                        className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition shadow-sm"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        Export CSV
                    </button>
                </div>
            </div>

            <StatsPanel participants={displayParticipants} />

            <div className="mb-6 flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`whitespace-nowrap px-4 py-3 font-medium transition border-b-2 ${activeCategory === 'all'
                        ? 'border-primary-600 text-primary-700'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                >
                    Overall (All Categories)
                </button>
                {competition.categories?.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`whitespace-nowrap px-4 py-3 font-medium transition border-b-2 ${activeCategory === cat.id
                            ? 'border-primary-600 text-primary-700'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <Leaderboard
                participants={displayParticipants}
                rounds={competition.rounds || []}
                medalRules={competition.medalRules}
            />

            <CertificateBatchGenerator
                participants={displayParticipants}
                competition={competition}
            />
        </div>
    );
}
