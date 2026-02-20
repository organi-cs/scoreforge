import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, writeBatch, onSnapshot, addDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import useAuth from './useAuth';

export function useCompetitions() {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setCompetitions([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const q = query(collection(db, 'competitions'), where('createdBy', '==', user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const comps = [];
            snapshot.forEach(doc => {
                comps.push({ id: doc.id, ...doc.data() });
            });
            // Sort client-side for simplicity instead of requiring a compound index right away
            comps.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
            setCompetitions(comps);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching competitions:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addCompetition = async (comp) => {
        if (!user) throw new Error("Must be logged in to create competition");
        try {
            const docRef = await addDoc(collection(db, 'competitions'), {
                ...comp,
                createdBy: user.uid,
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (e) {
            console.error("Error creating competition:", e);
            throw e;
        }
    };

    const duplicateCompetition = async (compId) => {
        if (!user) throw new Error("Must be logged in");
        try {
            const docRef = doc(db, 'competitions', compId);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) return;

            const data = docSnap.data();
            await addDoc(collection(db, 'competitions'), {
                name: `Copy of ${data.name}`,
                date: data.date || '',
                categories: data.categories || [],
                rounds: data.rounds || [],
                medalRules: data.medalRules || {},
                status: 'draft',
                createdBy: user.uid,
                createdAt: serverTimestamp()
            });
        } catch (e) {
            console.error("Error duplicating:", e);
        }
    };

    const deleteCompetition = async (compId) => {
        if (!user) throw new Error("Must be logged in");
        if (!window.confirm("Are you sure you want to delete this competition? All scores and participants will be permanently deleted.")) return;

        try {
            // Delete participants subcollection first to avoid orphaned documents
            const partsRef = collection(db, 'competitions', compId, 'participants');
            const partsSnap = await getDocs(partsRef);

            const batch = writeBatch(db);
            partsSnap.forEach(p => {
                batch.delete(p.ref);
            });
            // Delete the main competition document
            batch.delete(doc(db, 'competitions', compId));

            await batch.commit();
        } catch (e) {
            console.error("Error deleting competition:", e);
        }
    };

    return { competitions, loading, addCompetition, duplicateCompetition, deleteCompetition };
}

export function useCompetition(id) {
    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setCompetition(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        const docRef = doc(db, 'competitions', id);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setCompetition({ id: docSnap.id, ...docSnap.data() });
            } else {
                setCompetition(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching competition details:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id]);

    return { competition, loading };
}
