'use client';

import { ContactPage } from '@/pages/contact';
import { useRouter } from 'next/navigation';

export default function Contact() {
  const router = useRouter();

  return (
    <ContactPage
      onNavigate={(page) => router.push(page === 'home' ? '/' : `/${page}`)}
      onSignupClick={() => {}}
    />
  );
}
