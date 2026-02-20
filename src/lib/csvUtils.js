import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export function exportResultsToCSV(participants, competition) {
    if (!participants || participants.length === 0) return;

    const data = participants.map(p => {
        const cat = competition.categories?.find(c => c.id === p.categoryId);
        const row = {
            'Overall Rank': p.rank?.overall || '',
            'Category Rank': p.rank?.inCategory || '',
            'Name': p.name,
            'School': p.school || '',
            'Category': cat ? cat.name : 'Unknown',
        };

        // Add each round score dynamically
        competition.rounds?.forEach(r => {
            row[r.name] = p.scores?.[r.id] ?? '';
        });

        row['Total Weighted'] = p.totalWeighted?.toFixed(2) ?? '';
        row['Medal'] = p.medal ? p.medal.toUpperCase() : '';

        return row;
    });

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `Results_${competition.name.replace(/[^a-z0-9]/gi, '_')}.csv`);
}
