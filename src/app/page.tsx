'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to /swap page
    router.replace('/swap');
  }, [router]);
  
  return null; // No UI to render as we're redirecting
}
