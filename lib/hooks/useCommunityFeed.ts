'use client';

import { useCallback, useEffect, useState } from 'react';

import { apiClient } from '@/lib/client/api';

export type CommunityApiItem = {
  id: string;
  prompt: string;
  creditsDeducted: number;
  creditsBefore: number;
  creditsAfter: number;
  aspectRatio: '1:1' | '4:3' | '9:16' | '16:9';
  style: 'photoreal' | 'cinematic' | 'anime' | 'digital art';
  imageUrl: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
};

type CommunityResponse = {
  items: CommunityApiItem[];
  nextCursor: string | null;
};

export function useCommunityFeed(limit = 18) {
  const [items, setItems] = useState<CommunityApiItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadFeed = useCallback(
    async (cursor?: string) => {
      const isFirstPage = !cursor;

      if (isFirstPage) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      setErrorMessage(null);

      try {
        const response = await apiClient<CommunityResponse>(
          cursor
            ? `/api/community?limit=${limit}&cursor=${encodeURIComponent(cursor)}`
            : `/api/community?limit=${limit}`,
          {
            skipAuthRefresh: true,
          },
        );

        if (cursor) {
          setItems(previousItems => [...previousItems, ...response.items]);
        } else {
          setItems(response.items);
        }

        setNextCursor(response.nextCursor);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load the community feed right now.',
        );
      } finally {
        if (isFirstPage) {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [limit],
  );

  useEffect(() => {
    let active = true;

    async function loadInitialFeed() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await apiClient<CommunityResponse>(
          `/api/community?limit=${limit}`,
          {
            skipAuthRefresh: true,
          },
        );

        if (!active) {
          return;
        }

        setItems(response.items);
        setNextCursor(response.nextCursor);
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load the community feed right now.',
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialFeed();

    return () => {
      active = false;
    };
  }, [limit]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoadingMore) {
      return;
    }

    await loadFeed(nextCursor);
  }, [isLoadingMore, loadFeed, nextCursor]);

  return {
    items,
    nextCursor,
    isLoading,
    isLoadingMore,
    errorMessage,
    loadMore,
  };
}
