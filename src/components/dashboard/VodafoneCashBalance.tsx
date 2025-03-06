import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

interface VodafoneCashBalanceProps {
  balance: number;
  phoneNumber: string;
  lastUpdate?: string;
}

export default function VodafoneCashBalance({
  balance = 2500,
  phoneNumber = "01012345678",
  lastUpdate = new Date().toLocaleString("ar-EG"),
}: Partial<VodafoneCashBalanceProps>) {
  return (
    <Card className="bg-gradient-to-br from-red-500 to-red-700 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium text-white">
          رصيد فودافون كاش
        </CardTitle>
        <Smartphone className="h-5 w-5 text-white" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{balance.toLocaleString()} ج.م</div>
        <div className="mt-2 flex justify-between text-sm">
          <span>{phoneNumber}</span>
          <span>آخر تحديث: {lastUpdate}</span>
        </div>
      </CardContent>
    </Card>
  );
}
