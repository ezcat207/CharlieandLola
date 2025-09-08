import React from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { Clock, Plus } from 'lucide-react';

interface CreditDisplayProps {
  availableCredits: number;
  totalCredits: number;
  usedCredits: number;
  onBuyCredits?: () => void;
  className?: string;
}

export function CreditDisplay({ 
  availableCredits, 
  totalCredits, 
  usedCredits, 
  onBuyCredits,
  className = "" 
}: CreditDisplayProps) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border border-gray-600 bg-gray-800/50 backdrop-blur-sm ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-pink-400" />
          <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-500/30">
            {availableCredits} credits available
          </Badge>
        </div>
        <div className="text-xs text-gray-400">
          Total: {totalCredits} | Used: {usedCredits}
        </div>
      </div>
      
      {onBuyCredits && (
        <Button
          onClick={onBuyCredits}
          size="sm"
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium gap-1.5"
        >
          <Plus className="h-3 w-3" />
          Buy Credits
        </Button>
      )}
    </div>
  );
}