'use client';

import { ChatPage } from '@/pages/chat';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CustomerChat() {
  const router = useRouter();
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [quoteId, setQuoteId] = useState<string | null>(null);

  useEffect(() => {
    // Get IDs from sessionStorage
    const storedSupplierId = sessionStorage.getItem('selectedSupplierId');
    const storedQuoteId = sessionStorage.getItem('selectedQuoteId');
    
    if (storedSupplierId) setSupplierId(storedSupplierId);
    if (storedQuoteId) setQuoteId(storedQuoteId);
  }, []);

  return (
    <ChatPage
      onNavigate={(page) => router.push(`/${page}`)}
      onBack={() => router.back()}
      supplierId={supplierId}
      quoteId={quoteId}
      onSignupClick={() => {}}
    />
  );
}
