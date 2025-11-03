'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react';
import { cn } from '@/components/ui/utils';

// Mock data
const mockConversations = [
  {
    id: '1',
    customer: 'John Smith',
    lastMessage: 'Is the part still available?',
    timestamp: '10:30 AM',
    unread: 2,
    enquiryId: 'ENQ-001',
    partName: 'Front Brake Pads',
  },
  {
    id: '2',
    customer: 'Sarah Wilson',
    lastMessage: 'When can you deliver?',
    timestamp: 'Yesterday',
    unread: 0,
    enquiryId: 'ENQ-003',
    partName: 'Timing Belt Kit',
  },
  {
    id: '3',
    customer: 'David Clark',
    lastMessage: 'Thank you for the quote',
    timestamp: '2 days ago',
    unread: 1,
    enquiryId: 'ENQ-002',
    partName: 'Headlight Assembly',
  },
];

const mockMessages = [
  {
    id: '1',
    sender: 'customer',
    text: 'Hi, I need front brake pads for my VW Golf 2018',
    timestamp: '09:15 AM',
  },
  {
    id: '2',
    sender: 'supplier',
    text: 'Hello! I can help you with that. I have OEM quality brake pads in stock.',
    timestamp: '09:20 AM',
  },
  {
    id: '3',
    sender: 'customer',
    text: 'Great! What is your best price?',
    timestamp: '09:25 AM',
  },
  {
    id: '4',
    sender: 'supplier',
    text: 'I can offer them for £85.00 including delivery. They come with a 12-month warranty.',
    timestamp: '09:30 AM',
  },
  {
    id: '5',
    sender: 'customer',
    text: 'Is the part still available?',
    timestamp: '10:30 AM',
  },
];

export default function SupplierMessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messageText, setMessageText] = useState('');

  const filteredConversations = mockConversations.filter((conv) =>
    conv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.partName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unread, 0);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // Handle message sending
    setMessageText('');
  };

  return (
    <div className="p-6 h-[calc(100vh-5rem)]">
      <div className="mb-6">
        <h1 className="font-['Inter'] text-[#0F172A]">Messages</h1>
        <p className="font-['Roboto'] text-[#475569] mt-1">
          Chat with customers about their enquiries
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-80px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0 flex flex-col h-full">
            {/* Search */}
            <div className="p-4 border-b border-[#E2E8F0]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#475569]" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-['Roboto']"
                />
              </div>
              {totalUnread > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <Badge className="bg-[#F02801] text-white border-none">
                    {totalUnread} unread
                  </Badge>
                </div>
              )}
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={cn(
                    'w-full p-4 border-b border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors text-left',
                    selectedConversation.id === conversation.id && 'bg-[#F1F5F9]'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-[#F02801]/10 text-[#F02801] font-['Inter']">
                        {conversation.customer.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-['Roboto'] font-medium text-[#0F172A] truncate">
                          {conversation.customer}
                        </p>
                        {conversation.unread > 0 && (
                          <Badge className="bg-[#F02801] text-white border-none h-5 min-w-[20px] px-1">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="font-['Roboto'] text-[#475569] truncate">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-['Roboto'] text-[#94A3B8]">
                          {conversation.timestamp}
                        </p>
                        <span className="text-[#CBD5E1]">•</span>
                        <p className="font-['Roboto'] text-[#94A3B8] truncate">
                          {conversation.partName}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0 flex flex-col h-full">
            {/* Chat Header */}
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-[#F02801]/10 text-[#F02801] font-['Inter']">
                    {selectedConversation.customer.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-['Roboto'] font-medium text-[#0F172A]">
                    {selectedConversation.customer}
                  </p>
                  <p className="font-['Roboto'] text-[#475569]">
                    {selectedConversation.enquiryId} • {selectedConversation.partName}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.sender === 'supplier' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[70%] rounded-lg p-3',
                      message.sender === 'supplier'
                        ? 'bg-[#F02801] text-white'
                        : 'bg-[#F1F5F9] text-[#0F172A]'
                    )}
                  >
                    <p className="font-['Roboto']">{message.text}</p>
                    <p
                      className={cn(
                        'font-['Roboto'] mt-1',
                        message.sender === 'supplier'
                          ? 'text-white/70'
                          : 'text-[#94A3B8]'
                      )}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-[#E2E8F0]">
              <div className="flex items-end gap-2">
                <Button variant="outline" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Textarea
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                  className="font-['Roboto'] resize-none"
                />
                <Button
                  className="bg-[#F02801] hover:bg-[#D22301] text-white"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
