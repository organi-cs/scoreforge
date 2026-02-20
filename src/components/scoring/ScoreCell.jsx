import { memo } from 'react';

// Memoized cell for performance
export const ScoreCell = memo(({ value, onChange, onKeyDown, isSaving }) => {
    return (
        <div className={`relative ${isSaving ? 'animate-pulse' : ''}`}>
            <input
                type="number"
                value={value === undefined ? '' : value}
                onChange={e => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                className="w-20 border border-slate-300 rounded px-2 py-1 text-center font-mono outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                placeholder="0"
            />
        </div>
    );
});

ScoreCell.displayName = 'ScoreCell';
