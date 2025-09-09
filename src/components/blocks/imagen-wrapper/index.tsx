import { getTranslations, setRequestLocale } from 'next-intl/server';
import ImagenClient from './imagen-client';

interface ImagenWrapperProps {
  locale?: string;
}

export default async function ImagenWrapper({ locale = 'en' }: ImagenWrapperProps = {}) {
  // Set the request locale for server-side translations
  setRequestLocale(locale);
  
  // Get the translations on the server side with explicit locale
  const t = await getTranslations({ locale, namespace: 'imagen' });
  
  // Pass translations as props to the client component
  const translations = {
    badge: { text: t('badge.text') },
    title: { main: t('title.main'), subtitle: t('title.subtitle') },
    description: t('description'),
    features: {
      trending: { title: t('features.trending.title'), subtitle: t('features.trending.subtitle') },
      ai_powered: { title: t('features.ai_powered.title'), subtitle: t('features.ai_powered.subtitle') },
      character_maker: { title: t('features.character_maker.title'), subtitle: t('features.character_maker.subtitle') },
      social_ready: { title: t('features.social_ready.title'), subtitle: t('features.social_ready.subtitle') },
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
      count: t.raw('upload.count'), // Template: "{count}/5"
      drop_text: t('upload.drop_text'),
      browse_text: t('upload.browse_text'),
      add_image: t('upload.add_image'),
      clear_all: t.raw('upload.clear_all'), // Template: "Clear All ({count})"
      max_images_error: t('upload.max_images_error'),
      image_label: t.raw('upload.image_label'), // Template: "Image {number}"
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
        insufficient_credits: t.raw('messages.errors.insufficient_credits'), // Template: "You don't have enough credits. This model requires {credits} credits."
        generation_failed: t('messages.errors.generation_failed'),
        download_failed: t('messages.errors.download_failed'),
      },
    },
  };
  
  return <ImagenClient translations={translations} />;
}