import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusIcon, TrashIcon, Bars3Icon } from '@heroicons/react/24/outline';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export default function CategoryManager({ categories, setCategories }) {
    const [newCatName, setNewCatName] = useState('');

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = reorder(categories, result.source.index, result.destination.index);
        // Update order property
        const upItems = items.map((item, index) => ({ ...item, order: index + 1 }));
        setCategories(upItems);
    };

    const addCategory = () => {
        if (!newCatName.trim()) return;
        const newCat = {
            id: `cat_${Date.now()}`,
            name: newCatName.trim(),
            order: categories.length + 1
        };
        setCategories([...categories, newCat]);
        setNewCatName('');
    };

    const removeCategory = (id) => {
        if (categories.length <= 1) {
            alert("You need at least one category.");
            return;
        }
        const filtered = categories.filter(c => c.id !== id);
        // Re-index
        setCategories(filtered.map((c, idx) => ({ ...c, order: idx + 1 })));
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Categories</h3>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="categories">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2 mb-4"
                        >
                            {categories.map((cat, index) => (
                                <Draggable key={cat.id} draggableId={cat.id} index={index}>
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
                                            <span className="flex-1 font-medium text-slate-700">{cat.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeCategory(cat.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-50 transition"
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

            <div className="flex gap-2 mt-4">
                <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                    placeholder="New Category Name (e.g., Grade 6)"
                    className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
                <button
                    type="button"
                    onClick={addCategory}
                    className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add
                </button>
            </div>
        </div>
    );
}
