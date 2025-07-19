export const reviewStars = (
  rating: number,
  interactive: boolean = false,
  onChange?: (rating: number) => void
) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange && onChange(star)}
          className={`w-5 h-5 flex items-center justify-center ${
            interactive ? 'cursor-pointer hover:scale-110' : ''
          }`}
          disabled={!interactive}
        >
          <i
            className={`ri-star-${star <= rating ? 'fill' : 'line'} ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
          ></i>
        </button>
      ))}
    </div>
  );
};
