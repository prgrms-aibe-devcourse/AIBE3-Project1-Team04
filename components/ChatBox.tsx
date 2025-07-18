'use client';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ✅ 대화 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('chat_messages')
        .select('role, message')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('대화 불러오기 실패:', error.message);
        return;
      }

      // 타입 맞추기
      const loadedMessages: Message[] = data.map((msg) => ({
        role: msg.role,
        content: msg.message,
      }));

      setMessages(loadedMessages);
    };

    fetchMessages();
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!user) return;
    const newUserMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    const user_id = user?.id;
    try {
      // GPT API 호출
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: input }),
      });
      console.log(res);
      if (!res.ok) {
        setError('GPT 응답에 실패했습니다.');
        return;
      }
      const data = await res.json();
      const botMessage: Message = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, botMessage]);

      // Supabase에 저장
      await supabase.from('chat_messages').insert([
        { user_id, role: 'user', message: input },
        { user_id, role: 'assistant', message: data.reply },
      ]);
    } catch (err) {
      console.error('❌ fetch 실패:', err);
      setError('GPT 응답에 실패했습니다.');
    } finally {
      setLoading(false); // ✅ 실패해도 무조건 로딩 종료!
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded max-w-[75%] ${
              msg.role === 'user' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-100'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
        {loading && <div className="text-gray-400">챗봇이 응답 중입니다...</div>}
        {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
      </div>
      <div className="border-t p-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="여행 관련 질문을 입력하세요"
          className="flex-1 p-2 border rounded"
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 rounded">
          보내기
        </button>
      </div>
    </div>
  );
}
