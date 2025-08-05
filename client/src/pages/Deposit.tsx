import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CreditCard, Banknote, Bitcoin, DollarSign, Coins } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import CryptoInfo from "@/components/CryptoInfo";

const cryptoOptions = [
  { value: "BTC", label: "Bitcoin", icon: Bitcoin, blockchains: ["bitcoin", "lightning"] },
  { value: "ETH", label: "Ethereum", icon: Coins, blockchains: ["ethereum", "polygon", "arbitrum", "optimism"] },
  { value: "USDT", label: "Tether", icon: DollarSign, blockchains: ["ethereum", "tron", "bsc", "polygon"] },
  { value: "BNB", label: "BNB", icon: DollarSign, blockchains: ["bsc", "ethereum"] },
];

const fiatOptions = [
  { value: "USD", label: "US Dollar", symbol: "$" },
  { value: "PLN", label: "Polish Złoty", symbol: "zł" },
  { value: "EUR", label: "Euro", symbol: "€" },
];

const blockchainNetworks = {
  bitcoin: { name: "Bitcoin", fee: "0.0001 BTC" },
  lightning: { name: "Lightning Network", fee: "~0.001 USD" },
  ethereum: { name: "Ethereum", fee: "~15 USD" },
  polygon: { name: "Polygon", fee: "~0.01 USD" },
  arbitrum: { name: "Arbitrum", fee: "~1 USD" },
  optimism: { name: "Optimism", fee: "~1 USD" },
  bsc: { name: "Binance Smart Chain", fee: "~0.20 USD" },
  tron: { name: "Tron", fee: "~1 USD" },
};

export default function Deposit() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Crypto deposit state
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedBlockchain, setSelectedBlockchain] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  
  // Fiat deposit state
  const [selectedFiat, setSelectedFiat] = useState("USD");
  const [fiatAmount, setFiatAmount] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");

  const handleCryptoDeposit = async () => {
    if (!selectedCrypto || !selectedBlockchain || !cryptoAmount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const { StaticStorageService } = await import("@/lib/staticStorage");
      
      const deposit = StaticStorageService.addDeposit({
        userId: user!.id,
        type: "deposit",
        method: "crypto",
        currency: selectedCrypto,
        amount: cryptoAmount,
        blockchain: selectedBlockchain,
        address: `${selectedBlockchain}-${Date.now()}`, // Mock address
        txHash: null,
        bankDetails: null,
        status: "pending",
        fee: "0",
        completedAt: null,
      });

      toast({
        title: "Deposit Initiated",
        description: `Your ${selectedCrypto} deposit is being processed. It will be completed in 1 minute.`,
      });

      // Clear form
      setSelectedCrypto("");
      setSelectedBlockchain("");
      setCryptoAmount("");
      
    } catch (error) {
      toast({
        title: "Deposit Failed", 
        description: "There was an error processing your deposit",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFiatDeposit = async () => {
    if (!selectedFiat || !fiatAmount || !bankAccountNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const { StaticStorageService } = await import("@/lib/staticStorage");
      
      const deposit = StaticStorageService.addDeposit({
        userId: user!.id,
        type: "deposit",
        method: "bank",
        currency: selectedFiat,
        amount: fiatAmount,
        blockchain: null,
        address: null,
        txHash: null,
        bankDetails: {
          accountNumber: bankAccountNumber,
          swiftCode: swiftCode,
        },
        status: "pending",
        fee: "0",
        completedAt: null,
      });

      toast({
        title: "Bank Deposit Initiated",
        description: `Your ${selectedFiat} bank deposit is being processed. It will be completed in 1 minute.`,
      });

      // Clear form
      setFiatAmount("");
      setBankAccountNumber("");
      setSwiftCode("");
      
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit", 
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const availableBlockchains = selectedCrypto 
    ? cryptoOptions.find(c => c.value === selectedCrypto)?.blockchains || []
    : [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background dark:bg-crypto-dark"
    >
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Deposit Funds
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Add funds to your account via cryptocurrency or bank transfer
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="crypto" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4" />
              Cryptocurrency
            </TabsTrigger>
            <TabsTrigger value="fiat" className="flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Bank Transfer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crypto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bitcoin className="h-5 w-5" />
                  Cryptocurrency Deposit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="crypto-select">Select Cryptocurrency</Label>
                    <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose cryptocurrency" />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptoOptions.map((crypto) => (
                          <SelectItem key={crypto.value} value={crypto.value}>
                            <div className="flex items-center gap-2">
                              <crypto.icon className="h-4 w-4" />
                              {crypto.label} ({crypto.value})
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blockchain-select">Blockchain Network</Label>
                    <Select 
                      value={selectedBlockchain} 
                      onValueChange={setSelectedBlockchain}
                      disabled={!selectedCrypto}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose network" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBlockchains.map((blockchain) => (
                          <SelectItem key={blockchain} value={blockchain}>
                            <div className="flex flex-col">
                              <span>{blockchainNetworks[blockchain as keyof typeof blockchainNetworks]?.name}</span>
                              <span className="text-xs text-gray-500">
                                Fee: {blockchainNetworks[blockchain as keyof typeof blockchainNetworks]?.fee}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crypto-amount">Amount</Label>
                  <Input
                    id="crypto-amount"
                    type="number"
                    step="0.00000001"
                    placeholder={`Enter ${selectedCrypto || 'amount'}`}
                    value={cryptoAmount}
                    onChange={(e) => setCryptoAmount(e.target.value)}
                  />
                </div>

                {selectedBlockchain && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Deposit Address
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-mono break-all">
                      {selectedBlockchain}-{user?.id}-deposit-address-{Date.now()}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                      Send {selectedCrypto} to this address on the {blockchainNetworks[selectedBlockchain as keyof typeof blockchainNetworks]?.name} network
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleCryptoDeposit}
                  disabled={isProcessing || !selectedCrypto || !selectedBlockchain || !cryptoAmount}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Confirm Crypto Deposit"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fiat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Bank Transfer Deposit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fiat-select">Currency</Label>
                    <Select value={selectedFiat} onValueChange={setSelectedFiat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fiatOptions.map((fiat) => (
                          <SelectItem key={fiat.value} value={fiat.value}>
                            {fiat.symbol} {fiat.label} ({fiat.value})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fiat-amount">Amount</Label>
                    <Input
                      id="fiat-amount"
                      type="number"
                      step="0.01"
                      placeholder={`Enter amount in ${selectedFiat}`}
                      value={fiatAmount}
                      onChange={(e) => setFiatAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank-account">Bank Account Number</Label>
                    <Input
                      id="bank-account"
                      placeholder="Enter your bank account number"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="swift-code">SWIFT/BIC Code (Optional)</Label>
                    <Input
                      id="swift-code"
                      placeholder="Enter SWIFT/BIC code for international transfers"
                      value={swiftCode}
                      onChange={(e) => setSwiftCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
                    Bank Transfer Instructions
                  </h4>
                  <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <p><strong>Bank Name:</strong> CryptoTracker Bank</p>
                    <p><strong>Account Name:</strong> CryptoTracker Holdings</p>
                    <p><strong>Account Number:</strong> 1234567890</p>
                    <p><strong>SWIFT Code:</strong> CTBKPLWW</p>
                    <p><strong>Reference:</strong> {user?.id}-deposit</p>
                  </div>
                </div>

                <Button 
                  onClick={handleFiatDeposit}
                  disabled={isProcessing || !selectedFiat || !fiatAmount || !bankAccountNumber}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Confirm Bank Deposit"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        </motion.div>

        {/* Cryptocurrency Information Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <CryptoInfo />
        </motion.div>
      </div>
    </motion.div>
  );
}