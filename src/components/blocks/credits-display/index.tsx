"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coins, Plus, Zap } from "lucide-react";
import { useAppContext } from "@/contexts/app";
import { useRouter } from "next/navigation";

interface UserCredits {
  left_credits: number;
  is_recharged?: boolean;
  is_pro?: boolean;
  total_credits?: number;
  used_credits?: number;
}

interface CreditsDisplayProps {
  onCreditsUpdate?: (credits: UserCredits) => void;
  showBuyButton?: boolean;
  variant?: "compact" | "full";
  className?: string;
}

export default function CreditsDisplay({ 
  onCreditsUpdate, 
  showBuyButton = true, 
  variant = "compact",
  className = "" 
}: CreditsDisplayProps) {
  const [credits, setCredits] = useState<UserCredits>({
    left_credits: 0,
    is_recharged: false,
    is_pro: false,
    total_credits: 0,
    used_credits: 0
  });
  const [loading, setLoading] = useState(true);
  const { user, setShowSignModal } = useAppContext();
  const router = useRouter();

  const fetchCredits = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/get-user-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        setShowSignModal(true);
        return;
      }

      const result = await response.json();
      if (result.code === 0) {
        // Calculate total and used credits for better UX
        const creditsData = {
          ...result.data,
          total_credits: result.data.left_credits + (result.data.used_credits || 0),
          used_credits: result.data.used_credits || 0
        };
        setCredits(creditsData);
        onCreditsUpdate?.(creditsData);
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user]);

  const handleBuyCredits = () => {
    if (!user) {
      setShowSignModal(true);
      return;
    }
    router.push("/pricing");
  };

  if (!user) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Sign in to view credits
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowSignModal(true)}
          >
            Sign In
          </Button>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center space-x-3 animate-pulse">
          <div className="w-5 h-5 bg-muted rounded"></div>
          <div className="w-24 h-4 bg-muted rounded"></div>
          {showBuyButton && <div className="w-20 h-8 bg-muted rounded ml-auto"></div>}
        </div>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <Card className={`p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Coins className="w-4 h-4 text-primary" />
              <div className="flex items-center space-x-2">
                <span className="font-medium">
                  {credits.left_credits} credits available
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Total: {credits.total_credits || credits.left_credits} | Used: {credits.used_credits || 0}
            </div>
          </div>
          {showBuyButton && (
            <Button 
              size="sm" 
              onClick={handleBuyCredits}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-500 hover:to-yellow-500 text-black font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              Buy Credits
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // Full variant
  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Your Credits
          </h3>
          {showBuyButton && (
            <Button onClick={handleBuyCredits} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Buy More
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {credits.left_credits}
            </div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {credits.used_credits || 0}
            </div>
            <div className="text-sm text-muted-foreground">Used</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {credits.total_credits || credits.left_credits}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>

        {credits.left_credits === 0 && (
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-lg">
            <p className="text-sm text-orange-700 dark:text-orange-400">
              You're out of credits! Purchase more to continue generating images.
            </p>
          </div>
        )}

        {credits.left_credits > 0 && credits.left_credits <= 5 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Running low on credits. Consider purchasing more to avoid interruption.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}