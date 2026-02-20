import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Papa from 'papaparse';
import { useCompetition } from '../hooks/useCompetition';
import { useParticipants } from '../hooks/useParticipants';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ParticipantPage() {
    const { id } = useParams();
    const { competition, loading: compLoading } = useCompetition(id);
    const { participants, loading: partLoading, addParticipant, addBulkParticipants } = useParticipants(id);

    const [pasteData, setPasteData] = useState('');
    const [name, setName] = useState('');
    const [school, setSchool] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const handleAddSingle = async (e) => {
        e.preventDefault();
        if (!name || !categoryId) return alert("Name and Category required");
        await addParticipant({ name, school, categoryId });
        setName('');
        setSchool('');
    };

    const handleBulkImport = async () => {
        if (!pasteData.trim()) return;

        // Try to parse as TSV (Tab-Separated Values) often copied from Excel
        Papa.parse(pasteData, {
            delimiter: "\t",
            header: false,
            skipEmptyLines: true,
            complete: async (results) => {
                const parsed = results.data.map(row => {
                    const [pName, pSchool, pCategoryName] = row;
                    // Attempt to map category name to ID
                    let catMatch = competition.categories?.find(c => c.name.toLowerCase() === pCategoryName?.trim().toLowerCase());
                    let finalCatId = catMatch ? catMatch.id : (competition.categories?.[0]?.id || 'cat1');

                    return {
                        name: pName?.trim() || 'Unknown',
                        school: pSchool?.trim() || '',
                        categoryId: finalCatId
                    };
                });

                if (parsed.length > 0) {
                    await addBulkParticipants(parsed);
                    setPasteData('');
                    alert(`Successfully imported ${parsed.length} participants.`);
                }
            }
        });
    };

    if (compLoading || partLoading) {
        return <div className="p-8 text-center text-slate-500 animate-pulse">Loading participants...</div>;
    }

    if (!competition) {
        return <div className="p-8 text-center text-red-500">Competition not found</div>;
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    to={`/competition/${id}`}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Participants: {competition.name}
                    </h1>
                    <p className="text-slate-500">Manage students and bulk import from sheets.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">Name</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">School</th>
                                    <th className="px-4 py-3 text-sm font-semibold text-slate-700">Category</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {participants.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-16 text-center">
                                            <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                                                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-sm font-semibold text-slate-900 mb-1">No participants yet</h3>
                                            <p className="text-xs text-slate-500">Use the form or bulk importer to add students.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    participants.map(p => {
                                        const cat = competition.categories?.find(c => c.id === p.categoryId);
                                        return (
                                            <tr key={p.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                                                <td className="px-4 py-3 text-slate-600">{p.school || '-'}</td>
                                                <td className="px-4 py-3 text-slate-600">
                                                    <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-1 rounded">
                                                        {cat ? cat.name : 'Unknown'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Single</h3>
                        <form onSubmit={handleAddSingle} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-700 mb-1">Name</label>
                                <input
                                    required
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-700 mb-1">School</label>
                                <input
                                    type="text"
                                    value={school}
                                    onChange={e => setSchool(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-700 mb-1">Category</label>
                                <select
                                    required
                                    value={categoryId}
                                    onChange={e => setCategoryId(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                >
                                    <option value="">Select Category</option>
                                    {competition.categories?.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 font-medium hover:bg-slate-700 transition"
                            >
                                Add Participant
                            </button>
                        </form>
                    </div>

                    <div className="bg-primary-50 rounded-xl border border-primary-100 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-primary-900 mb-2">Bulk Import</h3>
                        <p className="text-sm text-primary-700 mb-4">
                            Paste columns from Excel or Google Sheets. Order must be: <strong>Name, School, Category</strong>.
                        </p>
                        <textarea
                            value={pasteData}
                            onChange={e => setPasteData(e.target.value)}
                            placeholder={"John Doe\tWestland IS\tGrade 4-6\nJane Smith\tNISC\tGrade 7-9"}
                            className="w-full h-32 border border-primary-200 rounded-lg px-3 py-2 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 mb-3 text-sm"
                        />
                        <button
                            onClick={handleBulkImport}
                            className="w-full bg-primary-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-primary-700 transition shadow-sm"
                        >
                            Import from Text
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
