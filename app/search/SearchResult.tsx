'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { searchAllByKeyword } from '@/lib/rpc/search';
import PostCardWrapper from './prop/PostCard';
import PlaceCardWrapper from './prop/PlaceCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!query) return;

    (async () => {
      try {
        const data = await searchAllByKeyword(query);
        setResults(data);
      } catch (e) {
        console.error('검색 오류:', e);
      }
    })();
  }, [query]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        🔍 &quot;{query}&quot; 검색 결과 <span className="text-blue-600">({results.length})</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item) =>
          item.source === 'post' ? (
            <PostCardWrapper key={item.id} item={item} />
          ) : (
            <PlaceCardWrapper key={item.id} item={item} />
          )
        )}
      </div>
    </div>
  );
}
