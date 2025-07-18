'use client';
import { useChatModal } from '@/stores/chatModalStore';
import ChatBox from './ChatBox'; // 실제 챗 UI

export default function ChatModal() {
  const { isOpen, closeModal } = useChatModal();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 w-80 h-[500px] bg-white border shadow-lg rounded-xl overflow-hidden flex flex-col">
      {/* Header (고정 높이) */}
      <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-100">
        <span className="font-semibold">여행 추천 챗봇</span>
        <button onClick={closeModal}>❌</button>
      </div>

      {/* 본문: ChatBox가 남은 공간을 모두 차지하도록 */}
      <div className="flex-1 overflow-hidden">
        <ChatBox />
      </div>
    </div>
  );
}
