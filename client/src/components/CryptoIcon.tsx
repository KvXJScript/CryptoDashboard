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

  // Static crypto icon URLs from reliable CDN
  const cryptoIcons: Record<string, string> = {
    BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg",
    ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.svg",
    ADA: "https://cryptologos.cc/logos/cardano-ada-logo.svg",
    SOL: "https://cryptologos.cc/logos/solana-sol-logo.svg",
    MATIC: "https://cryptologos.cc/logos/polygon-matic-logo.svg",
    LINK: "https://cryptologos.cc/logos/chainlink-link-logo.svg",
    AVAX: "https://cryptologos.cc/logos/avalanche-avax-logo.svg",
    BNB: "https://cryptologos.cc/logos/bnb-bnb-logo.svg",
    XRP: "https://cryptologos.cc/logos/xrp-xrp-logo.svg",
    DOGE: "https://cryptologos.cc/logos/dogecoin-doge-logo.svg",
    DOT: "https://cryptologos.cc/logos/polkadot-new-dot-logo.svg",
    SHIB: "https://cryptologos.cc/logos/shiba-inu-shib-logo.svg",
    UNI: "https://cryptologos.cc/logos/uniswap-uni-logo.svg",
    LTC: "https://cryptologos.cc/logos/litecoin-ltc-logo.svg",
    ATOM: "https://cryptologos.cc/logos/cosmos-atom-logo.svg",
    ALGO: "https://cryptologos.cc/logos/algorand-algo-logo.svg",
    NEAR: "https://cryptologos.cc/logos/near-protocol-near-logo.svg",
    VET: "https://cryptologos.cc/logos/vechain-vet-logo.svg",
    FIL: "https://cryptologos.cc/logos/filecoin-fil-logo.svg",
    TRX: "https://cryptologos.cc/logos/tron-trx-logo.svg"
  };

  const iconUrl = cryptoIcons[symbol];

  if (!iconUrl) {
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
      src={iconUrl}
      alt={`${symbol} icon`}
      className={`${sizeClasses[size]} ${className} rounded-full`}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallback = target.nextElementSibling as HTMLElement;
        if (fallback) fallback.style.display = 'flex';
      }}
      loading="lazy"
    />
  );
}