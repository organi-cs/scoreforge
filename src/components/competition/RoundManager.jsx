import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusIcon, TrashIcon, Bars3Icon } from '@heroicons/react/24/outline';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export default function RoundManager({ rounds, setRounds }) {
    const [newRoundName, setNewRoundName] = useState('');
    const [newRoundWeight, setNewRoundWeight] = useState('1');

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = reorder(rounds, result.source.index, result.destination.index);
        const upItems = items.map((item, index) => ({ ...item, order: index + 1 }));
        setRounds(upItems);
    };

    const addRound = () => {
        if (!newRoundName.trim()) return;
        const newRound = {
            id: `r_${Date.now()}`,
            name: newRoundName.trim(),
            weight: parseFloat(newRoundWeight) || 1,
            order: rounds.length + 1
        };
        setRounds([...rounds, newRound]);
        setNewRoundName('');
        setNewRoundWeight('1');
    };

    const removeRound = (id) => {
        if (rounds.length <= 1) {
            alert("You need at least one round.");
            return;
        }
        const filtered = rounds.filter(r => r.id !== id);
        setRounds(filtered.map((r, idx) => ({ ...r, order: idx + 1 })));
    };

    const updateWeight = (id, newWeight) => {
        setRounds(rounds.map(r => r.id === id ? { ...r, weight: parseFloat(newWeight) || 0 } : r));
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Rounds & Weighting</h3>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="rounds">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2 mb-4"
                        >
                            {rounds.map((round, index) => (
                                <Draggable key={round.id} draggableId={round.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`flex items-center gap-3 p-3 bg-white border rounded-lg ${snapshot.isDragging ? 'shadow-md border-primary-300' : 'border-slate-200'
                                                }`}
                                        >
                                            <div {...provided.dragHandleProps} className="text-slate-400 cursor-grab hover:text-slate-600">
                                                <Bars3Icon className="w-5 h-5" />
                                            </div>
                                            <span className="flex-1 font-medium text-slate-700">{round.name}</span>

                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-500">Weight</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    value={round.weight}
                                                    onChange={(e) => updateWeight(round.id, e.target.value)}
                                                    className="w-20 border border-slate-300 rounded px-2 py-1 text-sm text-center outline-none focus:border-primary-500"
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeRound(round.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-50 transition ml-2"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <div className="flex gap-2 mt-4 items-end">
                <div className="flex-1">
                    <input
                        type="text"
                        value={newRoundName}
                        onChange={(e) => setNewRoundName(e.target.value)}
                        placeholder="New Round (e.g., Preliminary)"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                </div>
                <div className="w-24">
                    <input
                        type="number"
                        step="0.1"
                        value={newRoundWeight}
                        onChange={(e) => setNewRoundWeight(e.target.value)}
                        placeholder="Wgt"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-center"
                    />
                </div>
                <button
                    type="button"
                    onClick={addRound}
                    className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 h-10"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add
                </button>
            </div>
        </div>
    );
}
