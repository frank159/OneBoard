import { Card, CardContent } from "@/components/ui/card";

export const QuoteWidget = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <blockquote className="italic text-muted-foreground">
          &quot;A melhor maneira de prever o futuro é criá-lo.&quot;
        </blockquote>
        <div className="text-right mt-2 text-sm text-muted">
          – Peter Drucker
        </div>
      </CardContent>
    </Card>
  );
};
