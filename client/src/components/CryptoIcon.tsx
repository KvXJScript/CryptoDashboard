import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface CryptoIconProps {
  coinId: string;
  symbol: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CryptoIcon({ coinId, symbol, size = "md", className = "" }: CryptoIconProps) {
  const [imageError, setImageError] = useState(false);
  
  const { data: cryptoDetails } = useQuery({
    queryKey: [`/api/crypto/${coinId}/details`],
    enabled: !imageError,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  if (imageError || !cryptoDetails?.image) {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-crypto-primary/20 to-crypto-primary/40 rounded-full flex items-center justify-center border border-crypto-primary/30`}>
        <span className={`${textSizes[size]} font-bold text-crypto-primary`}>
          {symbol.slice(0, 2)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={cryptoDetails.image}
      alt={`${symbol} icon`}
      className={`${sizeClasses[size]} ${className} rounded-full`}
      onError={() => setImageError(true)}
      loading="lazy"
    />
  );
}