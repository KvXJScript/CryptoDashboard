import { useQuery } from "@tanstack/react-query";
import { mockCryptoPrices } from "@/lib/mockData";

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  cgId: string;
}

// CoinGecko API service with fallback to mock data
async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  try {
    // Try to fetch real data from CoinGecko
    const symbols = mockCryptoPrices.map(crypto => crypto.cgId).join(",");
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbols}&vs_currencies=usd&include_24hr_change=true`
    );
    
    if (!response.ok) {
      throw new Error("API request failed");
    }
    
    const data = await response.json();
    
    // Transform API response to match our interface
    return mockCryptoPrices.map(crypto => ({
      ...crypto,
      price: data[crypto.cgId]?.usd || crypto.price,
      change24h: data[crypto.cgId]?.usd_24h_change || crypto.change24h,
    }));
  } catch (error) {
    console.log("Using fallback crypto prices data");
    // Return mock data if API fails
    return mockCryptoPrices;
  }
}

export function useCryptoPrices() {
  return useQuery<CryptoPrice[]>({
    queryKey: ["crypto-prices"],
    queryFn: fetchCryptoPrices,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

export function useCryptoPrice(symbol: string) {
  const { data: prices, ...rest } = useCryptoPrices();
  
  const price = prices?.find(p => p.symbol === symbol);
  
  return {
    data: price,
    ...rest,
  };
}

// Generate mock historical data for charts
export function generateMockHistoricalData(symbol: string, days: number = 30) {
  const data = [];
  const now = Date.now();
  const basePrice = mockCryptoPrices.find(p => p.symbol === symbol)?.price || 100;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * 24 * 60 * 60 * 1000);
    const volatility = 0.05; // 5% daily volatility
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const price = basePrice * (1 + randomChange * Math.sqrt(i / days));
    
    data.push({
      timestamp,
      price: parseFloat(price.toFixed(8)),
    });
  }
  
  return data;
}

export function useCryptoHistory(symbol: string) {
  return useQuery({
    queryKey: ["crypto-history", symbol],
    queryFn: () => generateMockHistoricalData(symbol),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}