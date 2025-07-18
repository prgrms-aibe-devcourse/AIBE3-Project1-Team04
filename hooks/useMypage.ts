import { useState } from 'react';

export const useMypage = () => {
  const [activeTab, setActiveTab] = useState('drafts');

  return { activeTab, setActiveTab };
};
