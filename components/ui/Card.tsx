import { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export function Card({ children, className, style, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        'bg-white rounded-3xl p-4 shadow-sm border border-slate-100',
        onClick && 'cursor-pointer active:scale-[0.98] hover:border-emerald-200 hover:shadow-md transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}
