import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
    const { user, signOut } = useAuth();

    return (
        <nav className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex items-center gap-2">
                            <Trophy className="h-6 w-6 text-primary-600" />
                            <span className="font-bold text-xl text-slate-900">ScoreForge</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="text-sm font-medium text-slate-700">
                                    {user.displayName || user.email}
                                </div>
                                <button
                                    onClick={signOut}
                                    className="text-sm font-medium text-slate-500 hover:text-slate-700 transition"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600">
                                Log in
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
