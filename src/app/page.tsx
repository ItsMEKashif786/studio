'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
  }, [router]);

  return null;
}
