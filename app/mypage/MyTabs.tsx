const tabs = [
  { id: 'drafts', label: '임시저장' },
  { id: 'posts', label: '내 게시글' },
  { id: 'places', label: '내 여행지' },
];

function MyTabs({
  setActiveTab,
  activeTab,
  counts,
}: {
  setActiveTab: (tab: string) => void;
  activeTab: string;
  counts: {
    drafts: number;
    posts: number;
    places: number;
  };
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm mb-8">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              {counts[tab.id as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MyTabs;
