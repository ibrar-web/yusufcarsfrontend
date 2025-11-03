import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplierName?: string;
  onSubmit?: (rating: number, feedback: string) => void;
}

export function RatingDialog({
  open,
  onOpenChange,
  supplierName = "supplier",
  onSubmit,
}: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit?.(rating, feedback);
      onOpenChange(false);
      // Reset form
      setRating(0);
      setFeedback("");
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
    // Reset form
    setRating(0);
    setFeedback("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[#FFF7F5] via-[#FFFBFA] to-white p-6 pb-8 border-b border-[#E5E7EB]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-['Inter'] font-semibold text-[#0F172A] text-center">
              Rate Your Experience
            </DialogTitle>
            <DialogDescription className="text-center text-[#475569] font-['Roboto'] mt-2">
              How was your experience with {supplierName}?
            </DialogDescription>
          </DialogHeader>

          {/* Star Rating */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 rounded-lg p-1"
              >
                <Star
                  className={`h-10 w-10 transition-all duration-200 ${
                    star <= (hoveredRating || rating)
                      ? "fill-[#FFD700] text-[#FFD700]"
                      : "fill-none text-[#CBD5E1]"
                  }`}
                  strokeWidth={2}
                />
              </button>
            ))}
          </div>

          {/* Rating Text */}
          {rating > 0 && (
            <p className="text-center text-sm text-[#475569] font-['Roboto'] mt-3 animate-in fade-in duration-200">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        {/* Feedback Section */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-['Roboto'] text-[#475569]">
              Additional Feedback (Optional)
            </label>
            <Textarea
              placeholder="Tell us more about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px] resize-none border-[#E5E7EB] focus:border-[#F02801] focus:ring-[#F02801] font-['Roboto'] rounded-xl"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1 border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] font-['Roboto'] rounded-full"
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 bg-gradient-to-r from-[#F02801] to-[#D22301] hover:from-[#D22301] hover:to-[#B91C01] text-white shadow-md font-['Roboto'] rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Rating
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
