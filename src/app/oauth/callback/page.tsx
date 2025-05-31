'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/appwrite/client';
import { storeUserdata } from '@/appwrite/appwrite-auth';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const user = await account.get();
        if (user) {
          router.push('/');
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        router.push('/login');
      }
    };

    handleOAuthCallback();
    storeUserdata()
  }, [router]);

  return <p>處理登入中...</p>;
}