interface SortButtonProps {
  label: string;
  value: SortOption;
  selected: boolean;
  onClick: (value: SortOption) => void;
}

export type SortOption = 'latest' | 'popular' | 'rating' | 'likes' | 'cost';

const SortButton = ({ label, value, selected, onClick }: SortButtonProps) => (
  <button
    className={`px-4 py-2 text-sm font-medium ${
      selected
        ? 'text-blue-600 bg-blue-50 border border-blue-200 rounded-lg'
        : 'text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50'
    } whitespace-nowrap`}
    onClick={() => onClick(value)}
  >
    {label}
  </button>
);

export default SortButton;
