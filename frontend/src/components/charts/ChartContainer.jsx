import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

export const ChartContainer = ({ title, subtitle, action, children, className = '' }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          {subtitle && <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className="h-72 w-full pt-2">
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartContainer;
