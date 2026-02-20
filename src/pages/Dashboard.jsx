import { Link } from 'react-router-dom';
import { useCompetitions } from '../hooks/useCompetition';
import { PlusIcon, CalendarIcon, UsersIcon, TrophyIcon, DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

export default function Dashboard() {
    const { competitions, loading, duplicateCompetition, deleteCompetition } = useCompetitions();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <Link
                    to="/competition/new"
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
                >
                    <PlusIcon className="w-5 h-5" />
                    New Competition
                </Link>
            </div>

            {loading ? (
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-slate-200 rounded"></div>
                            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            ) : competitions.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <TrophyIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-1">No competitions</h3>
                    <p className="text-slate-500 mb-6">Get started by creating your first competition.</p>
                    <Link
                        to="/competition/new"
                        className="inline-flex items-center gap-2 bg-white text-primary-600 border border-primary-200 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Create Competition
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {competitions.map(comp => (
                        <Link
                            key={comp.id}
                            to={`/competition/${comp.id}`}
                            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-primary-300 transition group flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition truncate pr-2">
                                    {comp.name}
                                </h3>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${comp.status === 'active' ? 'bg-green-100 text-green-700' :
                                        comp.status === 'completed' ? 'bg-slate-100 text-slate-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                        {comp.status.charAt(0).toUpperCase() + comp.status.slice(1)}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            duplicateCompetition(comp.id);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition"
                                        title="Duplicate Competition"
                                    >
                                        <DocumentDuplicateIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            deleteCompetition(comp.id);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                                        title="Delete Competition"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 mt-auto">
                                <div className="flex items-center text-sm text-slate-500 gap-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>{comp.date ? format(parseISO(comp.date), 'MMM d, yyyy') : 'No date set'}</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-500 gap-2">
                                    <UsersIcon className="w-4 h-4" />
                                    <span>{comp.categories?.length || 0} Categories</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
