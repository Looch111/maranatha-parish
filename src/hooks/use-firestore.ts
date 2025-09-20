'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, query, orderBy, Query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Overload for a collection
export function useFirestore<T>(path: string, orderField?: string, orderDir?: 'asc' | 'desc'): T[] | null;
// Overload for a document
export function useFirestore<T>(path:string): T | null;

export function useFirestore<T>(path: string, orderField?: string, orderDir: 'asc' | 'desc' = 'asc'): T | T[] | null {
  const [data, setData] = useState<T | T[] | null>(null);

  useEffect(() => {
    if (!path) return;

    let unsubscribe: () => void;
    
    try {
      const pathSegments = path.split('/').filter(Boolean);

      if (pathSegments.length % 2 !== 0) {
        // Path is to a collection
        let q: Query = collection(db, path);
        if (orderField) {
            q = query(q, orderBy(orderField, orderDir));
        }
        unsubscribe = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
          setData(docs);
        }, (error) => {
            console.error("Firestore collection snapshot error:", error);
            setData([]);
        });
      } else {
        // Path is to a document
        const docRef = doc(db, path);
        unsubscribe = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            setData({ id: doc.id, ...doc.data() } as T);
          } else {
            setData(null);
          }
        }, (error) => {
            console.error("Firestore document snapshot error:", error);
            setData(null);
        });
      }
    } catch(error) {
        console.error("Error setting up Firestore listener:", error);
        setData(null);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [path, orderField, orderDir]);

  return data;
}
