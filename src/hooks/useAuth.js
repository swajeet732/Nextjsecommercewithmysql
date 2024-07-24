// src/hooks/useAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!token || !email) {
      router.push('/login'); // Redirect to login page if token or email is missing
    }
  }, [router]);
};

export default useAuth;
