interface CryptoIconProps {
  coinId: string;
  symbol: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CryptoIcon({ symbol, size = "md", className = "" }: CryptoIconProps) {
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

  // Use multiple reliable crypto icon sources
  const getIconUrl = (symbol: string) => {
    // Primary: CryptoCompare API (more reliable)
    const cryptoCompareUrl = `https://www.cryptocompare.com/media/37746251/btc.png`.replace('btc', symbol.toLowerCase());
    
    // Alternative sources
    const alternativeUrls: Record<string, string> = {
      BTC: "https://assets.coincap.io/assets/icons/btc@2x.png",
      ETH: "https://assets.coincap.io/assets/icons/eth@2x.png",
      ADA: "https://assets.coincap.io/assets/icons/ada@2x.png",
      SOL: "https://assets.coincap.io/assets/icons/sol@2x.png",
      MATIC: "https://assets.coincap.io/assets/icons/matic@2x.png",
      LINK: "https://assets.coincap.io/assets/icons/link@2x.png",
      AVAX: "https://assets.coincap.io/assets/icons/avax@2x.png",
      BNB: "https://assets.coincap.io/assets/icons/bnb@2x.png",
      XRP: "https://assets.coincap.io/assets/icons/xrp@2x.png",
      DOGE: "https://assets.coincap.io/assets/icons/doge@2x.png",
      DOT: "https://assets.coincap.io/assets/icons/dot@2x.png",
      SHIB: "https://assets.coincap.io/assets/icons/shib@2x.png",
      UNI: "https://assets.coincap.io/assets/icons/uni@2x.png",
      LTC: "https://assets.coincap.io/assets/icons/ltc@2x.png",
      ATOM: "https://assets.coincap.io/assets/icons/atom@2x.png",
      ALGO: "https://assets.coincap.io/assets/icons/algo@2x.png",
      NEAR: "https://assets.coincap.io/assets/icons/near@2x.png",
      VET: "https://assets.coincap.io/assets/icons/vet@2x.png",
      FIL: "https://assets.coincap.io/assets/icons/fil@2x.png",
      TRX: "https://assets.coincap.io/assets/icons/trx@2x.png"
    };
    
    return alternativeUrls[symbol] || null;
  };

  const FallbackIcon = () => (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-crypto-primary/20 to-crypto-primary/40 rounded-full flex items-center justify-center border border-crypto-primary/30`}>
      <span className={`${textSizes[size]} font-bold text-crypto-primary`}>
        {symbol.slice(0, 2)}
      </span>
    </div>
  );

  const iconUrl = getIconUrl(symbol);

  if (!iconUrl) {
    return <FallbackIcon />;
  }

  return (
    <div className="relative">
      <img
        src={iconUrl}
        alt={`${symbol} icon`}
        className={`${sizeClasses[size]} ${className} rounded-full`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="${sizeClasses[size]} ${className} bg-gradient-to-br from-crypto-primary/20 to-crypto-primary/40 rounded-full flex items-center justify-center border border-crypto-primary/30">
                <span class="${textSizes[size]} font-bold text-crypto-primary">
                  ${symbol.slice(0, 2)}
                </span>
              </div>
            `;
          }
        }}
        loading="lazy"
      />
    </div>
  );
}