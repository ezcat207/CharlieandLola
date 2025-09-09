import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface UserCredits {
  left_credits: number;
  total_credits: number;
  used_credits: number;
  is_pro?: boolean;
  is_recharged?: boolean;
}

export function useUserCredits() {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    // Only fetch if user is authenticated
    if (!session) {
      setCredits(null);
      setIsLoading(false);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/get-user-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }
      
      const result = await response.json();
      
      if (result.code === 0 && result.data) {
        setCredits(result.data);
      } else {
        // For guest users, don't throw error, just log it
        console.log('Credits fetch returned error:', result.msg || 'Failed to fetch credits');
        setCredits(null);
        setError(null); // Don't set error for guest users
      }
    } catch (err) {
      // For authenticated users, we show the error
      console.error('Failed to fetch user credits:', err);
      setError(null); // Don't set error - let components handle gracefully
      setCredits(null);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const refreshCredits = useCallback(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    credits,
    isLoading,
    error,
    refreshCredits,
  };
}