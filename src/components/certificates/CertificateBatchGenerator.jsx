import { useState } from 'react';
import { generateBatchCertificates } from '../../lib/certificateGenerator';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function CertificateBatchGenerator({ participants, competition }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [filter, setFilter] = useState('all'); // all, medalists

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            let targets = participants;
            if (filter === 'medalists') {
                targets = participants.filter(p => p.medal != null);
            }

            if (targets.length === 0) {
                alert("No participants found for the selected filter.");
                setIsGenerating(false);
                return;
            }

            await generateBatchCertificates(targets, competition);
        } catch (e) {
            console.error("Error generating certificates:", e);
            alert("An error occurred while generating certificates.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <div>
                <h3 className="text-lg font-semibold text-slate-900">Download Certificates</h3>
                <p className="text-sm text-slate-500">Generate a ZIP file containing PDF certificates for participants.</p>
            </div>

            <div className="flex items-center gap-4">
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 outline-none"
                >
                    <option value="all">All Participants</option>
                    <option value="medalists">Medalists Only</option>
                </select>

                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || participants.length === 0}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition ${isGenerating || participants.length === 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                        }`}
                >
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    {isGenerating ? 'Generating...' : 'Download ZIP'}
                </button>
            </div>
        </div>
    );
}
