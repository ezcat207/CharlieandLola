'use client';

import { ThemeProvider } from '@/contexts/theme-context';
import { ConfigProvider } from '@/contexts/config-context';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </ConfigProvider>
  );
}