import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryManager from '../components/competition/CategoryManager';
import RoundManager from '../components/competition/RoundManager';
import MedalRules from '../components/competition/MedalRules';
import { useCompetitions, useCompetition } from '../hooks/useCompetition';

export default function CompetitionPage({ isNew }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addCompetition } = useCompetitions();
    const { competition, loading } = useCompetition(id);

    // Form State
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('active');
    const [certificateBgUrl, setCertificateBgUrl] = useState('');
    const [categories, setCategories] = useState([{ id: 'cat_1', name: 'General', order: 1 }]);
    const [rounds, setRounds] = useState([{ id: 'r_1', name: 'Final', weight: 1, order: 1 }]);
    const [medalRules, setMedalRules] = useState({
        method: 'percentage',
        gold: 10,
        silver: 20,
        bronze: 30
    });

    // Load existing data if edit mode
    useEffect(() => {
        if (!isNew && competition) {
            setName(competition.name || '');
            setDate(competition.date || '');
            setStatus(competition.status || 'active');
            setCertificateBgUrl(competition.certificateBgUrl || '');
            setCategories(competition.categories || []);
            setRounds(competition.rounds || []);
            if (competition.medalRules) setMedalRules(competition.medalRules);
        }
    }, [isNew, competition]);

    const handleSave = () => {
        if (!name.trim()) {
            alert("Please enter a competition name");
            return;
        }

        const payload = {
            name,
            date,
            status,
            certificateBgUrl,
            categories,
            rounds,
            medalRules
        };

        if (isNew) {
            const newId = addCompetition(payload);
            // MOCK: simulate navigate to detail view eventually
            navigate('/');
        } else {
            console.log("Mock Update", payload);
            // MOCK update
            navigate('/');
        }
    };

    if (!isNew && loading) {
        return <div className="p-8 text-center text-slate-500">Loading competition setup...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isNew ? 'New Competition' : 'Edit Setup'}
                    </h1>
                    <p className="text-slate-500">Configure rounds, categories, and scoring rules.</p>
                </div>
                <div className="flex gap-3">
                    {!isNew && (
                        <>
                            <button
                                type="button"
                                onClick={() => navigate(`/competition/${id}/participants`)}
                                className="px-4 py-2 border border-primary-200 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100 transition"
                            >
                                Participants
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(`/competition/${id}/scores`)}
                                className="px-4 py-2 border border-green-200 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition"
                            >
                                Scores
                            </button>
                        </>
                    )}
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition"
                    >
                        {isNew ? 'Cancel' : 'Close'}
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
                    >
                        Save
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Competition Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. YMO National 2026"
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Competition Status</label>
                        <div className="flex items-center gap-3 mt-2">
                            <span className={`text-sm ${status === 'draft' ? 'font-semibold text-slate-900' : 'text-slate-500'}`}>Draft</span>
                            <button
                                type="button"
                                onClick={() => setStatus(status === 'active' ? 'draft' : 'active')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${status === 'active' ? 'bg-green-500' : 'bg-slate-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                            <span className={`text-sm ${status === 'active' ? 'font-semibold text-green-600' : 'text-slate-500'}`}>Active (Public)</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                            Draft mode hides the public leaderboard. Turn Active when you are ready to share results.
                        </p>
                    </div>
                    <div className="md:col-span-2 border-t border-slate-100 mt-2 pt-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Certificate Background URL (Optional)</label>
                        <div className="flex gap-4">
                            <input
                                type="url"
                                value={certificateBgUrl}
                                onChange={(e) => setCertificateBgUrl(e.target.value)}
                                placeholder="https://example.com/certificate-template.png"
                                className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-700"
                            />
                            {certificateBgUrl && (
                                <a
                                    href={certificateBgUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition"
                                >
                                    Preview
                                </a>
                            )}
                        </div>
                        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                            Provide a direct link to an image (PNG/JPG) to use as the A4 landscape background for certificates. If broken or left blank, a default border will be drawn instead.
                        </p>
                    </div>
                </div>
            </div>

            <CategoryManager categories={categories} setCategories={setCategories} />

            <RoundManager rounds={rounds} setRounds={setRounds} />

            <MedalRules rules={medalRules} setRules={setMedalRules} />

        </div>
    );
}
