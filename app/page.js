"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/live-view');
  }, []);

  return null;
};

export default HomePage;
