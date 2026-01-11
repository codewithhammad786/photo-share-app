import { useState } from "react";

const StarRating = ({
  value = 0,
  onChange,
  readonly = false,
  size = "md",
}) => {
  const [hover, setHover] = useState(0);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            className={`transition ${
              readonly
                ? "cursor-default"
                : "cursor-pointer hover:scale-110 active:scale-90"
            }`}
          >
            <i
              className={`${active ? "fas text-yellow-400" : "far text-slate-500"} fa-star`}
            ></i>
          </button>
        );
      })}

      {value > 0 && (
        <span className="ml-1 text-xs font-medium text-slate-400">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
