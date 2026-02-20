import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, addDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useParticipants(competitionId) {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!competitionId) {
            setParticipants([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const participantsRef = collection(db, 'competitions', competitionId, 'participants');
        const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
            const parts = [];
            snapshot.forEach(docSnap => {
                parts.push({ id: docSnap.id, ...docSnap.data() });
            });
            setParticipants(parts);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching participants:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [competitionId]);

    const updateParticipantScore = async (participantId, roundId, score) => {
        try {
            const pRef = doc(db, 'competitions', competitionId, 'participants', participantId);
            await updateDoc(pRef, {
                [`scores.${roundId}`]: score
            });
        } catch (e) {
            console.error("Error updating score:", e);
        }
    };

    const addParticipant = async (participant) => {
        try {
            const participantsRef = collection(db, 'competitions', competitionId, 'participants');
            await addDoc(participantsRef, {
                ...participant,
                scores: {},
                totalWeighted: 0,
                rank: { overall: null, inCategory: null },
                medal: null
            });
        } catch (e) {
            console.error("Error adding participant:", e);
        }
    };

    const addBulkParticipants = async (newParticipants) => {
        try {
            const batch = writeBatch(db);
            const participantsRef = collection(db, 'competitions', competitionId, 'participants');

            newParticipants.forEach(p => {
                const docRef = doc(participantsRef);
                batch.set(docRef, {
                    ...p,
                    scores: {},
                    totalWeighted: 0,
                    rank: { overall: null, inCategory: null },
                    medal: null
                });
            });

            await batch.commit();
        } catch (e) {
            console.error("Error bulk adding participants:", e);
        }
    };

    const updateBulkParticipants = async () => {
        // Mock placeholder
    };

    const clearAllScores = async () => {
        try {
            const batch = writeBatch(db);
            participants.forEach(p => {
                const docRef = doc(db, 'competitions', competitionId, 'participants', p.id);
                batch.update(docRef, {
                    scores: {},
                    totalWeighted: 0,
                    rank: { overall: null, inCategory: null },
                    medal: null
                });
            });
            await batch.commit();
        } catch (e) {
            console.error("Error clearing scores:", e);
        }
    };

    return { participants, loading, updateParticipantScore, addParticipant, addBulkParticipants, updateBulkParticipants, clearAllScores };
}
