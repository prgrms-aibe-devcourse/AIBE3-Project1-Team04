'use client';
import { useAuth } from '@/hooks/useAuth';
import { useChatModal } from '@/stores/chatModalStore';
import { motion } from 'framer-motion';

export default function ChatOpenButton() {
  const { isOpen, toggleModal } = useChatModal();
  const { user } = useAuth();

  return (
    <>
      {user && (
        <motion.button
          onClick={toggleModal}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg text-white transition-all
          ${isOpen ? 'bg-red-500' : 'bg-blue-500'}
          hover:ring-4 hover:ring-opacity-30 hover:ring-blue-300`}
          aria-label="챗봇 열기/닫기"
        >
          {isOpen ? '❌' : '💬'}
        </motion.button>
      )}
    </>
  );
}
