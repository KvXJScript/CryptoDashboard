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
import { ArrowLeft, CreditCard, Banknote, Bitcoin, DollarSign, AlertTriangle, Coins } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";

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
  bitcoin: { name: "Bitcoin", fee: "0.0001 BTC", minWithdraw: "0.001" },
  lightning: { name: "Lightning Network", fee: "~0.001 USD", minWithdraw: "0.00001" },
  ethereum: { name: "Ethereum", fee: "~15 USD", minWithdraw: "0.01" },
  polygon: { name: "Polygon", fee: "~0.01 USD", minWithdraw: "0.01" },
  arbitrum: { name: "Arbitrum", fee: "~1 USD", minWithdraw: "0.01" },
  optimism: { name: "Optimism", fee: "~1 USD", minWithdraw: "0.01" },
  bsc: { name: "Binance Smart Chain", fee: "~0.20 USD", minWithdraw: "0.01" },
  tron: { name: "Tron", fee: "~1 USD", minWithdraw: "1" },
};

export default function Withdraw() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Crypto withdrawal state
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedBlockchain, setSelectedBlockchain] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [withdrawalAddress, setWithdrawalAddress] = useState("");
  
  // Fiat withdrawal state
  const [selectedFiat, setSelectedFiat] = useState("USD");
  const [fiatAmount, setFiatAmount] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");

  const handleCryptoWithdrawal = async () => {
    if (!selectedCrypto || !selectedBlockchain || !cryptoAmount || !withdrawalAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const minWithdraw = blockchainNetworks[selectedBlockchain as keyof typeof blockchainNetworks]?.minWithdraw;
    if (parseFloat(cryptoAmount) < parseFloat(minWithdraw || "0")) {
      toast({
        title: "Amount Too Small",
        description: `Minimum withdrawal is ${minWithdraw} ${selectedCrypto}`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const { StaticStorageService } = await import("@/lib/staticStorage");
      
      const withdrawal = StaticStorageService.addDeposit({
        userId: user!.id,
        type: "withdrawal",
        method: "crypto",
        currency: selectedCrypto,
        amount: cryptoAmount,
        blockchain: selectedBlockchain,
        address: withdrawalAddress,
        txHash: null,
        bankDetails: null,
        status: "pending",
        fee: "0.001", // Mock fee
        completedAt: null,
      });

      toast({
        title: "Withdrawal Initiated",
        description: `Your ${selectedCrypto} withdrawal is being processed. It will be completed in 1 minute.`,
      });

      // Clear form
      setSelectedCrypto("");
      setSelectedBlockchain("");
      setCryptoAmount("");
      setWithdrawalAddress("");
      
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFiatWithdrawal = async () => {
    if (!selectedFiat || !fiatAmount || !bankAccountNumber || !accountHolderName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(fiatAmount) < 10) {
      toast({
        title: "Amount Too Small",
        description: "Minimum withdrawal is 10.00",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const { StaticStorageService } = await import("@/lib/staticStorage");
      
      const withdrawal = StaticStorageService.addDeposit({
        userId: user!.id,
        type: "withdrawal",
        method: "bank",
        currency: selectedFiat,
        amount: fiatAmount,
        blockchain: null,
        address: null,
        txHash: null,
        bankDetails: {
          accountNumber: bankAccountNumber,
          swiftCode: swiftCode,
          accountHolderName: accountHolderName,
        },
        status: "pending",
        fee: "2.50", // Mock bank fee
        completedAt: null,
      });

      toast({
        title: "Bank Withdrawal Initiated", 
        description: `Your ${selectedFiat} bank withdrawal is being processed. It will be completed in 1 minute.`,
      });

      // Clear form
      setFiatAmount("");
      setBankAccountNumber("");
      setSwiftCode("");
      setAccountHolderName("");
      
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const availableBlockchains = selectedCrypto 
    ? cryptoOptions.find(c => c.value === selectedCrypto)?.blockchains || []
    : [];

  const selectedNetwork = selectedBlockchain 
    ? blockchainNetworks[selectedBlockchain as keyof typeof blockchainNetworks]
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-crypto-dark">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Withdraw Funds
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Transfer funds from your account via cryptocurrency or bank transfer
          </p>
        </div>

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
                  Cryptocurrency Withdrawal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4" />
                    <h4 className="font-medium">Important Security Notice</h4>
                  </div>
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                    Double-check the withdrawal address and blockchain network. Transactions cannot be reversed.
                  </p>
                </div>

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
                  <Label htmlFor="withdrawal-address">Withdrawal Address</Label>
                  <Input
                    id="withdrawal-address"
                    placeholder={`Enter ${selectedCrypto || 'cryptocurrency'} address`}
                    value={withdrawalAddress}
                    onChange={(e) => setWithdrawalAddress(e.target.value)}
                    className="font-mono text-sm"
                  />
                  {selectedNetwork && (
                    <p className="text-xs text-gray-500">
                      Ensure this is a valid {selectedNetwork.name} address
                    </p>
                  )}
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
                  {selectedNetwork && (
                    <p className="text-xs text-gray-500">
                      Minimum withdrawal: {selectedNetwork.minWithdraw} {selectedCrypto}
                    </p>
                  )}
                </div>

                {selectedNetwork && cryptoAmount && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Transaction Summary
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span>{cryptoAmount} {selectedCrypto}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network Fee:</span>
                        <span>{selectedNetwork.fee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network:</span>
                        <span>{selectedNetwork.name}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleCryptoWithdrawal}
                  disabled={isProcessing || !selectedCrypto || !selectedBlockchain || !cryptoAmount || !withdrawalAddress}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Confirm Crypto Withdrawal"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fiat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Bank Transfer Withdrawal
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
                    <p className="text-xs text-gray-500">
                      Minimum withdrawal: 10.00 {selectedFiat}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-holder">Account Holder Name</Label>
                    <Input
                      id="account-holder"
                      placeholder="Enter full name as it appears on bank account"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank-account">Bank Account Number</Label>
                    <Input
                      id="bank-account"
                      placeholder="Enter bank account number"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="swift-code">SWIFT/BIC Code (Required for International)</Label>
                    <Input
                      id="swift-code"
                      placeholder="Enter SWIFT/BIC code"
                      value={swiftCode}
                      onChange={(e) => setSwiftCode(e.target.value)}
                    />
                  </div>
                </div>

                {fiatAmount && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Transaction Summary
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span>{fiatAmount} {selectedFiat}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee:</span>
                        <span>2.50 {selectedFiat}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>You'll receive:</span>
                        <span>{(parseFloat(fiatAmount) - 2.50).toFixed(2)} {selectedFiat}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleFiatWithdrawal}
                  disabled={isProcessing || !selectedFiat || !fiatAmount || !bankAccountNumber || !accountHolderName}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Confirm Bank Withdrawal"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}