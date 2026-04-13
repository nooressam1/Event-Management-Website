import { User } from "lucide-react";

const AttendeeReviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Alex Johnson",
      rating: 5,
      comment: '"The panel discussion on AI ethics was mind-blowing."',
      avatar: "AJ",
    },
    {
      id: 2,
      name: "Sarah Rivera",
      rating: 5,
      comment: '"Food was excellent, but the venues got a bit crowded."',
      avatar: "SR",
    },
  ];

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white/5 border border-LineBox rounded-lg p-4 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-MainBlue/20 border border-MainBlue flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-MainBlue">
                {review.avatar}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white font-medium text-sm">
                  {review.name}
                </h4>
              </div>
              <div className="text-xs mb-2">{renderStars(review.rating)}</div>
              <p className="text-gray-300 text-sm">{review.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendeeReviews;
