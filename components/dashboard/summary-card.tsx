import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  trend?: string;
  icon: LucideIcon;
}

export function SummaryCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
}: SummaryCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="rounded-full bg-muted p-2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-semibold text-foreground">{value}</div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {trend ? (
          <p className="text-xs font-medium text-emerald-600">{trend}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
