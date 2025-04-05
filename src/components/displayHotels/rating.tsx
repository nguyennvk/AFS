interface RatingProps {
    rating: number; // Value from 0 to 5 (e.g., 3.5)
  }
  
  export default function Rating({ rating }: RatingProps) {
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
  
    return (
      <div className="flex items-center gap-2">
        {/* Stars */}
        <div className="flex gap-1 text-yellow-500">
          {[...Array(fullStars)].map((_, i) => (
            <span key={i}>★</span>
          ))}
          {hasHalfStar && <span className="text-yellow-500">★</span>}
          {[...Array(maxStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
            <span key={i + fullStars + 1} className="text-gray-300">
              ★
            </span>
          ))}
        </div>
  
        {/* Numeric Rating */}
        <span className="font-medium">({rating.toFixed(1)})</span>
      </div>
    );
  }
  