// src/hooks/useI18n.ts
'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useMemo } from 'react';
import type { CentralizedTranslations } from '@/lib/i18n/central-manager';

// Client-side hook for centralized translations
export function useI18n<T extends keyof CentralizedTranslations>(namespace: T) {
  const locale = useLocale();
  const t = useTranslations(namespace as string);
  
  const translations = useMemo(() => {
    switch (namespace) {
      case 'common':
        return {
          loading: t('loading'),
          error: t('error'),
          success: t('success'),
          cancel: t('cancel'),
          confirm: t('confirm'),
          save: t('save'),
          delete: t('delete'),
          edit: t('edit'),
          create: t('create'),
          close: t('close'),
          back: t('back'),
          next: t('next'),
          previous: t('previous'),
        } as CentralizedTranslations[T];
        
      case 'navigation':
        return {
          home: t('home'),
          features: t('features'),
          gallery: t('gallery'),
          pricing: t('pricing'),
          blog: t('blog'),
          docs: t('docs'),
          contact: t('contact'),
          signIn: t('signIn'),
          signOut: t('signOut'),
          dashboard: t('dashboard'),
        } as CentralizedTranslations[T];
        
      case 'imagegen':
        return {
          title: {
            main: t('title.main'),
            subtitle: t('title.subtitle'),
          },
          description: t('description'),
          badge: {
            text: t('badge.text'),
          },
          features: {
            guaranteed: {
              title: t('features.guaranteed.title'),
              subtitle: t('features.guaranteed.subtitle'),
            },
            no_lottery: {
              title: t('features.no_lottery.title'),
              subtitle: t('features.no_lottery.subtitle'),
            },
            one_sentence: {
              title: t('features.one_sentence.title'),
              subtitle: t('features.one_sentence.subtitle'),
            },
            instant: {
              title: t('features.instant.title'),
              subtitle: t('features.instant.subtitle'),
            },
          },
          buttons: {
            try_now: t('buttons.try_now'),
            browse_gallery: t('buttons.browse_gallery'),
            generate: t('buttons.generate'),
            login_required: t('buttons.login_required'),
            generating: t('buttons.generating'),
            download: t('buttons.download'),
            share: t('buttons.share'),
          },
          upload: {
            title: t('upload.title'),
            count: t.raw('upload.count'),
            drop_text: t('upload.drop_text'),
            browse_text: t('upload.browse_text'),
            add_image: t('upload.add_image'),
            clear_all: t.raw('upload.clear_all'),
            max_images_error: t('upload.max_images_error'),
            image_label: t.raw('upload.image_label'),
          },
          styles: {
            title: t('styles.title'),
            options: {
              charlie_lola: {
                label: t('styles.options.charlie_lola.label'),
                description: t('styles.options.charlie_lola.description'),
                tags: JSON.parse(t.raw('styles.options.charlie_lola.tags')),
              },
            },
          },
          preview: {
            title: t('preview.title'),
            placeholder: t('preview.placeholder'),
            upload_prompt: t('preview.upload_prompt'),
          },
          prompt: {
            title: t('prompt.title'),
            current_style: t('prompt.current_style'),
            customize_hint: t('prompt.customize_hint'),
            reset_button: t('prompt.reset_button'),
          },
          messages: {
            success: {
              generated: t('messages.success.generated'),
              downloaded: t('messages.success.downloaded'),
              url_copied: t('messages.success.url_copied'),
            },
            errors: {
              login_required: t('messages.errors.login_required'),
              insufficient_credits: t.raw('messages.errors.insufficient_credits'),
              generation_failed: t('messages.errors.generation_failed'),
              download_failed: t('messages.errors.download_failed'),
            },
          },
        } as CentralizedTranslations[T];
        
      default:
        throw new Error(`Unknown namespace: ${namespace}`);
    }
  }, [t, namespace]);
  
  return { t: translations, locale, raw: t };
}

// Specialized hooks for common use cases
export function useCommonTranslations() {
  return useI18n('common');
}

export function useNavigationTranslations() {
  return useI18n('navigation');
}

export function useImagegenTranslations() {
  return useI18n('imagegen');
}

// Template string helper for interpolation
export function interpolate(template: string, values: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match;
  });
}

// Plural helper
export function plural(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

// Format number with locale
export function formatNumber(num: number, locale?: string): string {
  return new Intl.NumberFormat(locale).format(num);
}

// Format date with locale
export function formatDate(date: Date | string, locale?: string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

// RTL support
export function useIsRTL(): boolean {
  const locale = useLocale();
  const rtlLocales = ['ar', 'he', 'fa', 'ur'];
  return rtlLocales.includes(locale);
}