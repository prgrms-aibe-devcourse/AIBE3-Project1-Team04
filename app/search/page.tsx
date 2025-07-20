'use client';

import { Suspense } from 'react';
import SearchResult from './SearchResult';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
      <HeroSection />
      <SearchResult />
    </Suspense>
  );
}
