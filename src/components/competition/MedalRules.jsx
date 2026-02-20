export default function MedalRules({ rules, setRules }) {
    const updateRule = (key, value) => {
        setRules({ ...rules, [key]: value });
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Medal Distribution</h3>

            <div className="flex gap-4 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="method"
                        value="percentage"
                        checked={rules.method === 'percentage'}
                        onChange={(e) => updateRule('method', e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-slate-700 font-medium">Top Percentage (%)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name="method"
                        value="fixedCount"
                        checked={rules.method === 'fixedCount'}
                        onChange={(e) => updateRule('method', e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-slate-700 font-medium">Fixed Count (N)</span>
                </label>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <label className="block text-sm font-semibold text-yellow-800 mb-2">Gold</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="0"
                            value={rules.gold}
                            onChange={(e) => updateRule('gold', parseInt(e.target.value) || 0)}
                            className="w-full border border-yellow-300 rounded px-3 py-2 text-center focus:ring-2 focus:ring-yellow-500 outline-none"
                        />
                        <span className="text-yellow-700 font-medium">{rules.method === 'percentage' ? '%' : ''}</span>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-300 p-4 rounded-lg">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Silver</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="0"
                            value={rules.silver}
                            onChange={(e) => updateRule('silver', parseInt(e.target.value) || 0)}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-center focus:ring-2 focus:ring-slate-500 outline-none"
                        />
                        <span className="text-slate-600 font-medium">{rules.method === 'percentage' ? '%' : ''}</span>
                    </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                    <label className="block text-sm font-semibold text-orange-800 mb-2">Bronze</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="0"
                            value={rules.bronze}
                            onChange={(e) => updateRule('bronze', parseInt(e.target.value) || 0)}
                            className="w-full border border-orange-300 rounded px-3 py-2 text-center focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                        <span className="text-orange-700 font-medium">{rules.method === 'percentage' ? '%' : ''}</span>
                    </div>
                </div>
            </div>

            <p className="text-sm text-slate-500 mt-4">
                {rules.method === 'percentage'
                    ? "Example: If Gold is 10%, the top 10% of students in each category will receive gold."
                    : "Example: If Gold is 5, exactly the top 5 students in each category will receive gold."}
            </p>
        </div>
    );
}
