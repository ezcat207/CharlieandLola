"use client";

import { Check, Loader } from "lucide-react";
import { PricingItem, Pricing as PricingType } from "@/types/blocks/pricing";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";
import { useLocale } from "next-intl";

export default function Pricing({ pricing }: { pricing: PricingType }) {
  if (pricing.disabled) {
    return null;
  }

  const locale = useLocale();

  const { user, setShowSignModal } = useAppContext();

  const [group, setGroup] = useState(() => {
    // First look for a group with is_featured set to true
    const featuredGroup = pricing.groups?.find((g) => g.is_featured);
    // If no featured group exists, fall back to the first group
    return featuredGroup?.name || pricing.groups?.[0]?.name;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  const handleCheckout = async (item: PricingItem, cn_pay: boolean = false) => {
    try {
      if (!user) {
        setShowSignModal(true);
        return;
      }

      const params = {
        product_id: item.product_id,
        currency: cn_pay ? "cny" : item.currency,
        locale: locale || "en",
      };

      setIsLoading(true);
      setProductId(item.product_id);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.status === 401) {
        setIsLoading(false);
        setProductId(null);

        setShowSignModal(true);
        return;
      }

      const { code, message, data } = await response.json();
      if (code !== 0) {
        toast.error(message);
        return;
      }

      const { checkout_url } = data;
      if (!checkout_url) {
        toast.error("checkout failed");
        return;
      }

      window.location.href = checkout_url;
    } catch (e) {
      console.log("checkout failed: ", e);

      toast.error("checkout failed");
    } finally {
      setIsLoading(false);
      setProductId(null);
    }
  };

  useEffect(() => {
    if (pricing.items) {
      const featuredItem = pricing.items.find((i) => i.is_featured);
      setProductId(featuredItem?.product_id || pricing.items[0]?.product_id);
      setIsLoading(false);
    }
  }, [pricing.items]);

  // Filter items for current group
  const filteredItems = pricing.items?.filter(
    (item) => !item.group || item.group === group
  ) || [];

  // Get grid class based on number of items
  const getGridClass = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  };

  return (
    <section id={pricing.name} className="py-16">
      <div className="container max-w-7xl mx-auto">
        <div className="mx-auto mb-12 text-center">
          <h2 className="mb-4 text-4xl font-semibold lg:text-5xl">
            {pricing.title}
          </h2>
          <p className="text-muted-foreground lg:text-lg">
            {pricing.description}
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-8">
          {pricing.groups && pricing.groups.length > 0 && (
            <div className="flex h-12 items-center rounded-lg bg-muted p-1 text-lg">
              <RadioGroup
                value={group}
                className="h-full flex"
                onValueChange={(value) => {
                  setGroup(value);
                }}
              >
                {pricing.groups.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-white has-[button[data-state="checked"]]:shadow-sm'
                    >
                      <RadioGroupItem
                        value={item.name || ""}
                        id={item.name}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={item.name}
                        className="flex h-full cursor-pointer items-center justify-center px-6 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary transition-colors"
                      >
                        {item.title}
                        {item.label && (
                          <Badge
                            variant="outline"
                            className="border-primary bg-primary px-1.5 ml-2 text-primary-foreground text-xs"
                          >
                            {item.label}
                          </Badge>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          )}
          
          <div className={`w-full grid gap-6 ${getGridClass(filteredItems.length)}`}>
            {filteredItems.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`relative rounded-xl border-2 bg-card p-6 text-card-foreground transition-all hover:shadow-lg ${
                    item.is_featured
                      ? "border-primary shadow-lg scale-105"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {item.is_featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        {item.label || "Popular"}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex h-full flex-col">
                    <div className="mb-6">
                      <div className="mb-4">
                        {item.title && (
                          <h3 className="text-2xl font-bold mb-2">
                            {item.title}
                          </h3>
                        )}
                        <div className="flex items-end gap-2 mb-3">
                          {item.original_price && (
                            <span className="text-lg text-muted-foreground font-medium line-through">
                              {item.original_price}
                            </span>
                          )}
                          {item.price && (
                            <span className="text-4xl font-bold">
                              {item.price}
                            </span>
                          )}
                          {item.unit && (
                            <span className="text-muted-foreground font-medium mb-1">
                              {item.unit}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                      
                      {item.features_title && (
                        <p className="mb-4 font-semibold text-sm uppercase tracking-wide">
                          {item.features_title}
                        </p>
                      )}
                      {item.features && (
                        <ul className="space-y-3 mb-6">
                          {item.features.map((feature, fi) => {
                            return (
                              <li className="flex items-start gap-3" key={`feature-${fi}`}>
                                <Check className="size-4 shrink-0 mt-0.5 text-primary" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                    
                    <div className="mt-auto space-y-3">
                      {item.cn_amount && item.cn_amount > 0 && (
                        <div className="flex items-center justify-center gap-x-2">
                          <span className="text-sm text-muted-foreground">人民币支付 👉</span>
                          <button
                            className="inline-block p-2 hover:bg-muted rounded-md transition-colors"
                            onClick={() => {
                              if (isLoading) return;
                              handleCheckout(item, true);
                            }}
                            disabled={isLoading}
                          >
                            <img
                              src="/imgs/cnpay.png"
                              alt="cnpay"
                              className="w-20 h-10 rounded-lg"
                            />
                          </button>
                        </div>
                      )}
                      
                      {item.button && (
                        <Button
                          className={`w-full font-semibold ${
                            item.is_featured
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : ""
                          }`}
                          size="lg"
                          disabled={isLoading && productId === item.product_id}
                          onClick={() => {
                            if (isLoading) return;
                            handleCheckout(item);
                          }}
                        >
                          {isLoading && productId === item.product_id ? (
                            <>
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                              {item.button.title}
                            </>
                          ) : (
                            <>
                              {item.button.title}
                              {item.button.icon && (
                                <Icon name={item.button.icon} className="ml-2 size-4" />
                              )}
                            </>
                          )}
                        </Button>
                      )}
                      
                      {item.tip && (
                        <p className="text-center text-muted-foreground text-xs">
                          {item.tip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
