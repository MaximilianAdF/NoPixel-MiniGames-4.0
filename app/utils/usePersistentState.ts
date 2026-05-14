import { useEffect, useState } from "react";

export default function usePersistantState<T>(
   key: string,
   initialValue: T
): [T, (value: T) => void, boolean] {
   // Always start with initialValue to ensure server and client match during hydration
   const [state, setInternalState] = useState<T>(initialValue);
   // Flips true once the post-mount localStorage read has run; lets consumers wait for the stored value
   const [hydrated, setHydrated] = useState(false);

   // After mount, sync with localStorage
   useEffect(() => {
       if (typeof window === 'undefined') return;
       
       try {
           const value = localStorage.getItem(key);
           if (value !== null) {
               setInternalState(JSON.parse(value));
           }
       } catch (error) {
           console.error(`Error reading localStorage key "${key}":`, error);
       }
       setHydrated(true);
   }, [key]);

   const setState = (value: T) => {
       try {
           localStorage.setItem(key, JSON.stringify(value));
           setInternalState(value);
       } catch (error) {
           console.error(`Error writing to localStorage key "${key}":`, error);
           setInternalState(value);
       }
   };

   return [state, setState, hydrated];
}
