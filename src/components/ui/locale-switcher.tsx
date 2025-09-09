"use client";

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, localeNames } from '@/i18n/locale';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check, ChevronDown } from 'lucide-react';

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations('user');
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: string) => {
    setIsOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-9 px-3 gap-2 bg-background/80 border-border/50 text-foreground hover:bg-background hover:text-foreground transition-all duration-200 backdrop-blur-sm"
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium">
            {locale === 'en' ? 'English' : '中文'}
          </span>
          <ChevronDown className="h-4 w-4 transition-transform duration-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] bg-background border-border">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`
              flex items-center gap-2 px-3 py-2 cursor-pointer
              ${locale === loc ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-muted/50'}
              transition-colors duration-150
            `}
          >
            <div className="flex items-center gap-2 flex-1">
              {locale === loc && (
                <Check className="h-4 w-4 text-primary" />
              )}
              <span className={`font-medium ${locale !== loc ? 'ml-6' : ''}`}>
                {localeNames[loc] || loc}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}