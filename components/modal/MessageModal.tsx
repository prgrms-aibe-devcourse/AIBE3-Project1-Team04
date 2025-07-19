'use client';

import { useMessageModal } from '@/stores/MessageModalStore';
import { useEffect, useRef } from 'react';

function MessageModal() {
  const { modals, deleteModal } = useMessageModal();
  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (modals.length > 0) {
      timeout.current = setTimeout(() => {
        deleteModal();
      }, 3000);
    }

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [modals, deleteModal]);

  return (
    <>
      <section className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {modals.map((modal, index) => (
          <div key={index} className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            [{index + 1}] {modal}
          </div>
        ))}
      </section>
    </>
  );
}

export default MessageModal;
