'use client';

import { useState, useEffect } from 'react';

// This hook is temporarily disabled. It will return null.
export function useFirestore<T>(path: string, orderField?: string, orderDir?: 'asc' | 'desc'): T[] | null;
export function useFirestore<T>(path:string): T | null;
export function useFirestore<T>(path: string, orderField?: string, orderDir: 'asc' | 'desc' = 'asc'): T | T[] | null {
  const [data, setData] = useState<T | T[] | null>(null);

    useEffect(() => {
        // Firebase is disconnected, returning null.
        if (path.split('/').filter(Boolean).length % 2 !== 0) {
            setData([]);
        } else {
            setData(null);
        }
    }, [path]);

  return data;
}
