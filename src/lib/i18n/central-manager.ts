// src/lib/i18n/central-manager.ts
// 🌍 Centralized i18n Management System

import { getTranslations } from 'next-intl/server';

// Define all translation namespaces
export const I18N_NAMESPACES = {
  // Core application
  common: 'common',
  navigation: 'navigation',
  auth: 'auth',
  
  // Landing page sections
  hero: 'landing.hero',
  branding: 'landing.branding',
  introduce: 'landing.introduce',
  benefit: 'landing.benefit',
  usage: 'landing.usage',
  feature: 'landing.feature',
  showcase: 'landing.showcase',
  pricing: 'landing.pricing',
  testimonial: 'landing.testimonial',
  faq: 'landing.faq',
  cta: 'landing.cta',
  footer: 'landing.footer',
  
  // Image generation
  imagegen: 'imagegen',
  
  // Admin & Console
  admin: 'admin',
  console: 'console',
  
  // Errors & Messages
  errors: 'errors',
  success: 'success',
} as const;

export type I18nNamespace = typeof I18N_NAMESPACES[keyof typeof I18N_NAMESPACES];

// Centralized translation interface
export interface CentralizedTranslations {
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    create: string;
    close: string;
    back: string;
    next: string;
    previous: string;
  };
  
  navigation: {
    home: string;
    features: string;
    gallery: string;
    pricing: string;
    blog: string;
    docs: string;
    contact: string;
    signIn: string;
    signOut: string;
    dashboard: string;
  };
  
  imagegen: {
    title: {
      main: string;
      subtitle: string;
    };
    description: string;
    badge: {
      text: string;
    };
    features: {
      guaranteed: {
        title: string;
        subtitle: string;
      };
      no_lottery: {
        title: string;
        subtitle: string;
      };
      one_sentence: {
        title: string;
        subtitle: string;
      };
      instant: {
        title: string;
        subtitle: string;
      };
    };
    buttons: {
      try_now: string;
      browse_gallery: string;
      generate: string;
      login_required: string;
      generating: string;
      download: string;
      share: string;
    };
    upload: {
      title: string;
      count: string;
      drop_text: string;
      browse_text: string;
      add_image: string;
      clear_all: string;
      max_images_error: string;
      image_label: string;
    };
    styles: {
      title: string;
      options: {
        charlie_lola: {
          label: string;
          description: string;
          tags: string[];
        };
      };
    };
    preview: {
      title: string;
      placeholder: string;
      upload_prompt: string;
    };
    prompt: {
      title: string;
      current_style: string;
      customize_hint: string;
      reset_button: string;
    };
    messages: {
      success: {
        generated: string;
        downloaded: string;
        url_copied: string;
      };
      errors: {
        login_required: string;
        insufficient_credits: string;
        generation_failed: string;
        download_failed: string;
      };
    };
  };
}

// Centralized translation loader with caching
class CentralI18nManager {
  private cache: Map<string, any> = new Map();
  
  async getTranslations<T extends keyof CentralizedTranslations>(
    locale: string,
    namespace: T
  ): Promise<CentralizedTranslations[T]> {
    const cacheKey = `${locale}-${namespace}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const t = await getTranslations({ locale, namespace: namespace as string });
    
    let translations: any;
    
    switch (namespace) {
      case 'common':
        translations = {
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
        };
        break;
        
      case 'navigation':
        translations = {
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
        };
        break;
        
      case 'imagegen':
        translations = {
          title: { 
            main: t('title.main'), 
            subtitle: t('title.subtitle') 
          },
          description: t('description'),
          badge: { 
            text: t('badge.text') 
          },
          features: {
            guaranteed: { 
              title: t('features.guaranteed.title'), 
              subtitle: t('features.guaranteed.subtitle') 
            },
            no_lottery: { 
              title: t('features.no_lottery.title'), 
              subtitle: t('features.no_lottery.subtitle') 
            },
            one_sentence: { 
              title: t('features.one_sentence.title'), 
              subtitle: t('features.one_sentence.subtitle') 
            },
            instant: { 
              title: t('features.instant.title'), 
              subtitle: t('features.instant.subtitle') 
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
              }
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
        };
        break;
        
      default:
        throw new Error(`Unknown namespace: ${namespace}`);
    }
    
    this.cache.set(cacheKey, translations);
    return translations;
  }
  
  clearCache() {
    this.cache.clear();
  }
  
  preloadNamespaces(locale: string, namespaces: (keyof CentralizedTranslations)[]) {
    return Promise.all(
      namespaces.map(ns => this.getTranslations(locale, ns))
    );
  }
}

export const centralI18n = new CentralI18nManager();

// Utility functions for common use cases
export async function getAllLandingTranslations(locale: string) {
  const [hero, branding, introduce, benefit, usage, feature, showcase, pricing, testimonial, faq, cta, footer] = await Promise.all([
    getTranslations({ locale, namespace: 'landing.hero' }),
    getTranslations({ locale, namespace: 'landing.branding' }),
    getTranslations({ locale, namespace: 'landing.introduce' }),
    getTranslations({ locale, namespace: 'landing.benefit' }),
    getTranslations({ locale, namespace: 'landing.usage' }),
    getTranslations({ locale, namespace: 'landing.feature' }),
    getTranslations({ locale, namespace: 'landing.showcase' }),
    getTranslations({ locale, namespace: 'landing.pricing' }),
    getTranslations({ locale, namespace: 'landing.testimonial' }),
    getTranslations({ locale, namespace: 'landing.faq' }),
    getTranslations({ locale, namespace: 'landing.cta' }),
    getTranslations({ locale, namespace: 'landing.footer' }),
  ]);
  
  return {
    hero: hero.raw(''),
    branding: branding.raw(''),
    introduce: introduce.raw(''),
    benefit: benefit.raw(''),
    usage: usage.raw(''),
    feature: feature.raw(''),
    showcase: showcase.raw(''),
    pricing: pricing.raw(''),
    testimonial: testimonial.raw(''),
    faq: faq.raw(''),
    cta: cta.raw(''),
    footer: footer.raw(''),
  };
}