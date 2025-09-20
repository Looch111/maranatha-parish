'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, query, orderBy, getDoc, getDocs, DocumentData } from 'firebase/firestore';

function docWithId<T>(doc: DocumentData): T {
    const data = doc.data() as T;
    return { ...data, id: doc.id };
}

// Hook for fetching a single document
export function useFirestore<T>(path: string): T | null;
// Hook for fetching a collection
export function useFirestore<T>(path: string, orderField?: keyof T, orderDir?: 'asc' | 'desc'): T[] | null;

export function useFirestore<T>(path: string, orderField?: keyof T, orderDir: 'asc' | 'desc' = 'asc'): T | T[] | null {
    const [data, setData] = useState<T | T[] | null>(null);

    useEffect(() => {
        if (!path) return;

        const isCollection = path.split('/').filter(Boolean).length % 2 !== 0;

        if (isCollection) {
            let colQuery = query(collection(db, path));
            if (orderField) {
                colQuery = query(collection(db, path), orderBy(orderField as string, orderDir));
            }
            const unsubscribe = onSnapshot(colQuery, (snapshot) => {
                const results = snapshot.docs.map(doc => docWithId<T>(doc));
                setData(results);
            }, (error) => {
                console.error(`Error fetching collection ${path}:`, error);
                setData([]);
            });
            return () => unsubscribe();
        } else {
            const docRef = doc(db, path);
            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    setData(docWithId<T>(docSnap));
                } else {
                    setData(null);
                }
            }, (error) => {
                console.error(`Error fetching document ${path}:`, error);
                setData(null);
            });
            return () => unsubscribe();
        }
    }, [path, orderField, orderDir]);

    return data;
}

// One-time fetch functions
export async function getCollection<T>(path: string): Promise<T[]> {
    try {
        const snapshot = await getDocs(collection(db, path));
        return snapshot.docs.map(doc => docWithId<T>(doc));
    } catch (error) {
        console.error(`Error getting collection ${path}:`, error);
        return [];
    }
}

export async function getDocument<T>(path: string): Promise<T | null> {
    try {
        const docSnap = await getDoc(doc(db, path));
        if (docSnap.exists()) {
            return docWithId<T>(docSnap);
        }
        return null;
    } catch (error) {
        console.error(`Error getting document ${path}:`, error);
        return null;
    }
}
