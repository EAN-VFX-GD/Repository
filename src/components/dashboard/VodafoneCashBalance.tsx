import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface VodafoneCashBalanceProps {
  balance: number;
  phoneNumber: string;
  lastUpdate?: string;
}

export default function VodafoneCashBalance({
  balance: initialBalance = 2500,
  phoneNumber = "01012345678",
  lastUpdate: initialLastUpdate = new Date().toLocaleString("ar-EG"),
}: Partial<VodafoneCashBalanceProps>) {
  const { toast } = useToast();
  const [balance, setBalance] = useState(initialBalance);
  const [lastUpdate, setLastUpdate] = useState(initialLastUpdate);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDeposit = () => {
    if (amount && !isNaN(Number(amount))) {
      setBalance((prev) => prev + Number(amount));
      setLastUpdate(new Date().toLocaleString("ar-EG"));
      setAmount("");
      setDepositDialogOpen(false);

      toast({
        title: "تم الإيداع بنجاح",
        description: `تم إيداع ${Number(amount).toLocaleString()} ج.م في رصيدك`,
      });
    }
  };

  const handleWithdraw = () => {
    if (amount && !isNaN(Number(amount)) && Number(amount) <= balance) {
      setBalance((prev) => prev - Number(amount));
      setLastUpdate(new Date().toLocaleString("ar-EG"));
      setAmount("");
      setWithdrawDialogOpen(false);

      toast({
        title: "تم السحب بنجاح",
        description: `تم سحب ${Number(amount).toLocaleString()} ج.م من رصيدك`,
      });
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate a refresh delay
    setTimeout(() => {
      setLastUpdate(new Date().toLocaleString("ar-EG"));
      setIsRefreshing(false);

      toast({
        title: "تم تحديث الرصيد",
        description: "تم تحديث رصيد فودافون كاش بنجاح",
      });
    }, 1000);
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-red-500 to-red-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium text-white">
            رصيد فودافون كاش
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 -ml-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {balance.toLocaleString()} ج.م
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span>{phoneNumber}</span>
            <span>آخر تحديث: {lastUpdate}</span>
          </div>
          <div className="mt-4 flex justify-between gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-white/10 hover:bg-white/20 border-white/20 text-white"
              onClick={() => setDepositDialogOpen(true)}
            >
              <ArrowDownCircle className="h-4 w-4 ml-2" /> إيداع
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-white/10 hover:bg-white/20 border-white/20 text-white"
              onClick={() => setWithdrawDialogOpen(true)}
            >
              <ArrowUpCircle className="h-4 w-4 ml-2" /> سحب
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deposit Dialog */}
      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إيداع رصيد</DialogTitle>
            <DialogDescription>
              أدخل المبلغ الذي تريد إيداعه في رصيد فودافون كاش الخاص بك.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                id="amount"
                type="number"
                placeholder="أدخل المبلغ"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-start">
            <Button
              onClick={handleDeposit}
              className="bg-[hsl(var(--vodafone-red))] hover:bg-[hsl(var(--vodafone-red-dark))]"
            >
              إيداع
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>سحب رصيد</DialogTitle>
            <DialogDescription>
              أدخل المبلغ الذي تريد سحبه من رصيد فودافون كاش الخاص بك.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                id="amount"
                type="number"
                placeholder="أدخل المبلغ"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={balance}
              />
              {Number(amount) > balance && (
                <p className="text-sm text-red-500">
                  المبلغ المطلوب أكبر من الرصيد المتاح
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-start">
            <Button
              onClick={handleWithdraw}
              disabled={
                !amount || isNaN(Number(amount)) || Number(amount) > balance
              }
              className="bg-[hsl(var(--vodafone-red))] hover:bg-[hsl(var(--vodafone-red-dark))]"
            >
              سحب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
