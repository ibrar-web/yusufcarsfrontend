'use client';

import { QuotesPage } from '@/pages/quotes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CustomerQuotes() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const handleStartChat = (quoteId: string, supplierId: string) => {
    sessionStorage.setItem('selectedQuoteId', quoteId);
    sessionStorage.setItem('selectedSupplierId', supplierId);
    router.push('/customer/chat');
  };

  return (
    <QuotesPage
      onNavigate={(page) => router.push(`/${page}`)}
      onBack={() => router.back()}
      onStartChat={handleStartChat}
      onSignupClick={() => {}}
      onOrderConfirmed={(details) => {
        setOrderDetails(details);
        // Show confirmation dialog
      }}
    />
  );
}
