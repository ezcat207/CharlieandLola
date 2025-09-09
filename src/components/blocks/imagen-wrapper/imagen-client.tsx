'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUserCredits } from '@/hooks/useUserCredits';
import CreditDisplay from '@/components/blocks/credits-display';
import { toast } from 'sonner';
import { convertToCdnUrl } from '@/lib/cdn-url';
import { useTheme } from '@/contexts/theme-context';

// Type for the translations prop
interface Translations {
  badge: { text: string };
  title: { main: string; subtitle: string };
  description: string;
  features: {
    guaranteed: { title: string; subtitle: string };
    no_lottery: { title: string; subtitle: string };
    one_sentence: { title: string; subtitle: string };
    instant: { title: string; subtitle: string };
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
}

// Gallery images for Charlie and Lola style examples
const galleryImages = [
  'https://pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev/template/charlie-lola-2025-09-08T06-20-39.jpg',
  'https://pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev/template/combined_russia.png',
  'https://pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev/template/combined.png',
  'https://pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev/template/russia-2633850_1920.jpg',
  'https://pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev/template/self_org.png',
  'https://pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev/template/selfie-7611326_1280.jpg',
  'https://pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev/template/selfie-charlie.png',
  'https://pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev/template/toy_org.jpg'
];

// LocalStorage keys for persisting state
const STORAGE_KEYS = {
  generatedImage: 'charlieandlola_generated_image',
  uploadedImages: 'charlieandlola_uploaded_images',
  selectedStyle: 'charlieandlola_selected_style',
  customPrompt: 'charlieandlola_custom_prompt'
};

interface ImagenClientProps {
  translations: Translations;
}

export default function ImagenClient({ translations: t }: ImagenClientProps) {
  // Use theme context
  const { actualTheme } = useTheme();
  const [uploadedImages, setUploadedImages] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.uploadedImages);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          console.warn('Failed to parse saved uploaded images:', e);
        }
      }
    }
    return [];
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.generatedImage);
      if (saved && saved !== 'null') return saved;
    }
    return null;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('charlie-lola');
  const [isHydrated, setIsHydrated] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [currentBgImage, setCurrentBgImage] = useState(0);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [selectedModel, setSelectedModel] = useState('pro');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get user session
  const { data: session } = useSession();
  
  // Use the credit hook only if user is authenticated
  const { credits, isLoading: creditsLoading, refreshCredits } = useUserCredits();

  // Handle hydration and load persisted state
  useEffect(() => {
    // Mark as hydrated first
    setIsHydrated(true);
    
    if (typeof window !== 'undefined') {
      // Restore generated image
      const savedGeneratedImage = localStorage.getItem(STORAGE_KEYS.generatedImage);
      if (savedGeneratedImage && savedGeneratedImage !== 'null') {
        setGeneratedImage(savedGeneratedImage);
      }

      // Restore uploaded images
      const savedUploadedImages = localStorage.getItem(STORAGE_KEYS.uploadedImages);
      if (savedUploadedImages) {
        try {
          const parsedImages = JSON.parse(savedUploadedImages);
          if (Array.isArray(parsedImages)) {
            setUploadedImages(parsedImages);
          }
        } catch (error) {
          console.warn('Failed to parse saved uploaded images:', error);
        }
      }

      // Restore selected style
      const savedStyle = localStorage.getItem(STORAGE_KEYS.selectedStyle);
      if (savedStyle) {
        setSelectedStyle(savedStyle);
      }

      // Restore custom prompt
      const savedPrompt = localStorage.getItem(STORAGE_KEYS.customPrompt);
      if (savedPrompt) {
        setCustomPrompt(savedPrompt);
      }
    }
  }, []);

  // Save generated image to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (generatedImage) {
        localStorage.setItem(STORAGE_KEYS.generatedImage, generatedImage);
      } else {
        localStorage.removeItem(STORAGE_KEYS.generatedImage);
      }
    }
  }, [generatedImage]);

  // Save uploaded images to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (uploadedImages.length > 0) {
        localStorage.setItem(STORAGE_KEYS.uploadedImages, JSON.stringify(uploadedImages));
      } else {
        localStorage.removeItem(STORAGE_KEYS.uploadedImages);
      }
    }
  }, [uploadedImages]);

  // Save selected style to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.selectedStyle, selectedStyle);
    }
  }, [selectedStyle]);

  // Save custom prompt to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.customPrompt, customPrompt);
    }
  }, [customPrompt]);

  // Background image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % galleryImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Reset custom prompt when style changes
  useEffect(() => {
    setCustomPrompt('');
  }, [selectedStyle]);

  const styleOptions = [
    {
      value: 'charlie-lola',
      label: t.styles.options.charlie_lola?.label || 'Charlie & Lola Style',
      desc: t.styles.options.charlie_lola?.description || 'Transform into beloved children\'s book characters',
      tags: t.styles.options.charlie_lola?.tags || ['Cartoon', 'Children\'s Book', 'Whimsical'],
      preview: 'https://pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev/template/tennis.png',
      referenceImage: 'https://pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev/template/tennis.png',
      prompt: 'Transform the subject from the uploaded image into a character in the style of Charlie and Lola (children\'s cartoon). Match the official cartoon look - thin sketchy outlines, flat colors, childlike proportions, playful hand-drawn charm, and simple textures. Retain the subject\'s original clothing, hairstyle, facial features, accessories, skin tone, pose, and expression - but reinterpret them as if they belong in the Charlie and Lola world. Clothing should be simplified into flat shapes and bright colors, while keeping the overall outfit recognizable. Background: transparent to keep the focus on the character.'
    }
  ];

  const modelOptions = [
    {
      value: 'pro',
      label: 'Pro',
      description: 'Fast generation, standard quality',
      credits: 10,
      gradient: 'from-pink-500 to-yellow-500'
    },
    {
      value: 'max',
      label: 'Max',
      description: 'Highest quality, longer processing time',
      credits: 20,
      gradient: 'from-purple-500 to-cyan-500'
    }
  ];

  // Helper function to replace placeholders in translation strings
  const formatMessage = (message: string, params: Record<string, any> = {}) => {
    let result = message;
    Object.keys(params).forEach(key => {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), params[key]);
    });
    return result;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    const limitedFiles = files.slice(0, 5 - uploadedImages.length);
    
    limitedFiles.forEach(file => handleFileUpload(file));
  };

  const handleFileUpload = (file: File) => {
    if (uploadedImages.length >= 5) {
      toast.error(t.upload.max_images_error);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setUploadedImages(prev => [...prev, imageData]);
      setGeneratedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const limitedFiles = files.slice(0, 5 - uploadedImages.length);
    
    limitedFiles.forEach(file => handleFileUpload(file));
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearAllImages = () => {
    setUploadedImages([]);
    setGeneratedImage(null);
    
    // Also clear localStorage when user manually clears
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.uploadedImages);
      localStorage.removeItem(STORAGE_KEYS.generatedImage);
      localStorage.removeItem(STORAGE_KEYS.customPrompt);
    }
  };

  const generateImage = async () => {
    if (uploadedImages.length === 0) return;

    // Free generation - no login required initially
    // const selectedModelData = modelOptions.find(m => m.value === selectedModel);
    // const requiredCredits = selectedModelData?.credits || 10;

    // No credit check needed for free generation
    // if (session && credits && credits.left_credits < requiredCredits) {
    //   toast.error(formatMessage(t.messages.errors.insufficient_credits, { credits: requiredCredits }));
    //   return;
    // }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      
      formData.append('mode', 'image2image');
      formData.append('style', 'charlie-lola'); // Fixed style for Charlie and Lola
      formData.append('aspectRatio', aspectRatio);
      formData.append('outputFormat', outputFormat);
      formData.append('model', 'standard'); // Fixed model
      
      if (customPrompt.trim()) {
        formData.append('customPrompt', customPrompt);
      }

      for (let i = 0; i < uploadedImages.length; i++) {
        const response = await fetch(uploadedImages[i]);
        const blob = await response.blob();
        formData.append(`image_${i}`, blob);
      }
      
      formData.append('imageCount', uploadedImages.length.toString());

      const apiResponse = await fetch('/api/generate-cyberpunk', {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to generate image');
      }

      const result = await apiResponse.json();
      
      if (result.code === 0 && result.data?.imageUrl) {
        setGeneratedImage(result.data.imageUrl);
        
        // Handle different response types
        if (result.data.requiresRegistration && !session) {
          toast.success("Image generated! Sign in to download full resolution image.");
        } else if (result.msg === 'QUEUE_REQUIRED') {
          toast.warning("🚧 Service is busy. You're in the queue. Upgrade to premium to skip the queue!");
        } else {
          toast.success(t.messages.success.generated);
          if (session) {
            refreshCredits();
          }
        }
        
        // Store additional response data for download handling
        setGeneratedImage(result.data.imageUrl);
        
      } else if (result.code === 1) {
        // Handle queue status specifically
        if (result.msg?.includes('QUEUE_REQUIRED') || result.msg?.includes('queue') || result.msg?.includes('busy')) {
          toast.warning("🚧 Service is busy. You're in the queue. Upgrade to premium ($0.99) to skip the queue!");
          return;
        }
        throw new Error(result.msg || 'Failed to generate image');
      } else if (result.code === -1) {
        // Handle error responses (including insufficient credits)
        if (result.data === 'INSUFFICIENT_CREDITS' || result.message?.includes('Insufficient credits')) {
          toast.error(result.message || 'Insufficient credits to generate image');
          return;
        }
        throw new Error(result.message || 'Generation failed');
      } else {
        console.error('Unexpected API response:', result);
        throw new Error('Unexpected response from server');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      
      // Handle specific error types
      if (error.message?.includes('queue') || error.message?.includes('busy') || error.message?.includes('capacity')) {
        toast.warning("🚧 Service is at capacity. You're in the queue. Upgrade to premium ($0.99) for priority access!");
      } else if (error.message?.includes('Insufficient credits')) {
        toast.error(error.message);
      } else {
        toast.error(t.messages.errors.generation_failed);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) {
      toast.error("No image to download");
      return;
    }

    // Require login to download
    if (!session) {
      toast.warning("Please sign in to download the full resolution image!");
      return;
    }
    
    try {
      // Use the proxy API instead of direct fetch to avoid CORS issues
      const proxyUrl = `/api/download-image?url=${encodeURIComponent(generatedImage)}`;
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `charlie-lola-${timestamp}.jpg`;
      
      // Create download link
      const link = document.createElement('a');
      link.href = proxyUrl;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Check if mobile for appropriate success message
      const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobileDevice) {
        toast.success('Image downloaded. Check your Downloads folder or long-press to save to photos.');
      } else {
        toast.success(t.messages.success.downloaded);
      }
      
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(t.messages.errors.download_failed);
      
      // Fallback: open in new tab for manual save
      window.open(generatedImage, '_blank');
      toast.info("Image opened in new tab. Right-click to save.");
    }
  };

  const shareImage = async () => {
    if (generatedImage) {
      const cdnUrl = convertToCdnUrl(generatedImage);
      try {
        await navigator.clipboard.writeText(cdnUrl);
        toast.success(t.messages.success.url_copied);
      } catch (error) {
        console.error('Share failed:', error);
        const tempInput = document.createElement('input');
        tempInput.value = cdnUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        toast.success(t.messages.success.url_copied);
      }
    }
  };

  return (
    <div>
      <section className="min-h-screen relative overflow-hidden bg-background text-foreground">

        <div className="container relative z-10 py-16">
          {/* Hero Header Section */}
          <header className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-cl-yellow/20 rounded-full border-2 border-cl-outline" role="banner">
              <div className="w-2 h-2 bg-cl-red rounded-full" aria-hidden="true"></div>
              <span className="text-cl-outline text-sm font-medium">{t.badge.text}</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
              {t.title.main}
              <br />
              <span className="text-3xl lg:text-4xl">{t.title.subtitle}</span>
            </h1>
            
            <p className="text-xl text-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              {t.description}
            </p>

            {/* Key Features */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12" aria-label="Key Features">
              <article className="text-center">
                <h3 className="text-2xl font-bold text-cl-orange mb-2">{t.features.guaranteed.title}</h3>
                <p className="text-foreground text-sm">{t.features.guaranteed.subtitle}</p>
              </article>
              <article className="text-center">
                <h3 className="text-2xl font-bold text-cl-green mb-2">{t.features.no_lottery.title}</h3>
                <p className="text-foreground text-sm">{t.features.no_lottery.subtitle}</p>
              </article>
              <article className="text-center">
                <h3 className="text-2xl font-bold text-cl-blue mb-2">{t.features.one_sentence.title}</h3>
                <p className="text-foreground text-sm">{t.features.one_sentence.subtitle}</p>
              </article>
              <article className="text-center">
                <h3 className="text-2xl font-bold text-cl-yellow mb-2">{t.features.instant.title}</h3>
                <p className="text-foreground text-sm">{t.features.instant.subtitle}</p>
              </article>
            </section>
          </header>

            {/* CTA Buttons */}
            <nav className="flex flex-col sm:flex-row gap-4 justify-center mb-16" role="navigation" aria-label="Main Actions">
              <Button 
                size="lg" 
                variant="default"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Start using NanoBanana AI editor"
              >
                {t.buttons.try_now}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('/showcase', '_blank')}
                aria-label="View example gallery"
              >
                {t.buttons.browse_gallery}
              </Button>
            </nav>

          {/* Main Application Interface */}
          <main className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto" role="main">
            {/* Left Panel - Upload & Styles */}
            <section className="space-y-6" aria-label="Image Upload and Style Selection">
              {/* Credits Display - Only show for authenticated users */}
              {session && (
                <div className="flex justify-center">
                  <CreditDisplay className="w-full" />
                  {creditsLoading && (
                    <div className="w-full p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-center space-x-3">
                        <div className="animate-pulse flex space-x-2">
                          <div className="h-4 w-4 bg-cl-yellow rounded-full"></div>
                          <div className="h-4 w-24 bg-muted rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Upload Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-cl-yellow rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-cl-outline" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-foreground font-medium">
                      {t.upload.title} {formatMessage(t.upload.count, { count: uploadedImages.length })}
                    </h2>
                  </div>
                  
                  <div
                    className={cn(
                      "relative min-h-[400px] rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer",
                      uploadedImages.length > 0 ? "flex" : "flex items-center justify-center",
                      dragActive 
                        ? "border-cl-yellow bg-cl-yellow/10" 
                        : "border-muted hover:border-cl-yellow hover:bg-cl-yellow/5"
                    )}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={(e) => {
                      if (uploadedImages.length === 0 || e.target === e.currentTarget) {
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    
                    {uploadedImages.length > 0 ? (
                      <div className="w-full h-full p-4">
                        <div className="grid grid-cols-3 gap-4 h-full">
                          {uploadedImages.map((image, index) => (
                            <div 
                              key={index} 
                              className="relative border-2 border-cl-outline rounded-lg p-2 bg-card min-h-[120px] flex flex-col"
                            >
                              <div className="flex-1 relative group">
                                <img
                                  src={image}
                                  alt={`${formatMessage(t.upload.image_label, { number: index + 1 })} - User uploaded image for AI character generation using Charlie and Lola AI editor`}
                                  className="w-full h-full object-cover rounded-md"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(index);
                                }}
                                className="mt-2 w-6 h-6 bg-cl-red hover:bg-cl-red/80 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors mx-auto"
                              >
                                ×
                              </button>
                              
                              <div className="text-xs text-muted-foreground text-center mt-1">
                                {formatMessage(t.upload.image_label, { number: index + 1 })}
                              </div>
                            </div>
                          ))}
                          
                          {uploadedImages.length < 5 && (
                            <div 
                              className="border-2 border-dashed border-cl-yellow/60 rounded-lg flex flex-col items-center justify-center min-h-[120px] hover:border-cl-yellow transition-colors cursor-pointer bg-card"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <div className="text-center text-cl-yellow">
                                <div className="text-3xl mb-2">+</div>
                                <div className="text-sm font-medium">{t.upload.add_image}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {formatMessage(t.upload.count, { count: uploadedImages.length })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearAllImages();
                            }}
                            className="px-4 py-2 bg-cl-red hover:bg-cl-red/80 text-white text-sm rounded-md transition-colors"
                          >
                            {formatMessage(t.upload.clear_all, { count: uploadedImages.length })}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cl-yellow to-cl-orange rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <p className="text-foreground font-medium mb-2">{t.upload.drop_text}</p>
                        <p className="text-muted-foreground text-sm">{t.upload.browse_text}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Style Selection */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">{t.styles.title}</h2>
                  <div className="space-y-4">
                    {styleOptions.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setSelectedStyle(style.value)}
                        className={cn(
                          "w-full relative overflow-hidden rounded-lg border-2 transition-all duration-200 text-left group",
                          // Use consistent styling until hydrated to prevent mismatch
                          !isHydrated 
                            ? "border-border hover:border-cl-yellow/50 hover:bg-cl-yellow/5"
                            : selectedStyle === style.value
                              ? "border-cl-yellow bg-cl-yellow/10"
                              : "border-border hover:border-cl-yellow/50 hover:bg-cl-yellow/5"
                        )}
                      >
                        <div className="flex gap-4 p-4">
                          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                            <img
                              src={style.preview}
                              alt={`${style.label} AI generation style preview - Example of ${style.desc} using Charlie and Lola AI Charlie-and-Lola-Edit model`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-lg mb-2">{style.label}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{style.desc}</p>
                            
                            <div className="flex flex-wrap gap-1">
                              {style.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={cn(
                                    "px-2 py-1 text-xs rounded-md font-medium",
                                    // Use consistent styling until hydrated to prevent mismatch
                                    !isHydrated 
                                      ? "bg-muted text-muted-foreground border border-border"
                                      : selectedStyle === style.value
                                        ? "bg-cl-yellow/20 text-cl-yellow border border-cl-yellow/30"
                                        : "bg-muted text-muted-foreground border border-border"
                                  )}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {isHydrated && selectedStyle === style.value && (
                            <div className="flex-shrink-0 w-6 h-6 bg-cl-yellow rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Generate Button */}
              <Button
                onClick={generateImage}
                disabled={uploadedImages.length === 0 || isGenerating}
                size="lg"
                variant="default"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t.buttons.generating}
                  </div>
                ) : !session ? (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {t.buttons.login_required}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {t.buttons.generate}
                    <span className="text-cl-blue font-medium">
                      ({modelOptions.find(m => m.value === selectedModel)?.credits || 10} credits)
                    </span>
                  </div>
                )}
              </Button>
            </section>

            {/* Right Panel - Preview & Download */}
            <section className="space-y-6" aria-label="Preview and Results">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">{t.preview.title}</h2>
                  
                  <div className="min-h-[400px] rounded-xl border-2 border-dashed border-border flex items-center justify-center">
                    {generatedImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={generatedImage}
                          alt={`AI-generated ${styleOptions.find(s => s.value === selectedStyle)?.label || 'character image'} created with Charlie and Lola AI Charlie-and-Lola-Edit model - High-quality AI image generation result`}
                          className="w-full h-full object-cover rounded-lg"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button
                            onClick={shareImage}
                            size="sm"
                            variant="outline"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            {t.buttons.share}
                          </Button>
                          <Button
                            onClick={downloadImage}
                            size="sm"
                            variant="default"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {t.buttons.download}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="relative w-full h-full">
                          <img
                            src={styleOptions.find(s => s.value === selectedStyle)?.referenceImage || 'https://pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev/template/self.jpeg'}
                            alt={`${styleOptions.find(s => s.value === selectedStyle)?.label || 'Celebrity Selfie'} reference example - AI generation template for Charlie and Lola AI Charlie-and-Lola-Edit model`}
                            className="w-full h-full object-cover rounded-lg opacity-50"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-muted/50 rounded-lg flex items-center justify-center">
                            <div className="text-center text-foreground">
                              <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-8 h-8 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <p className="font-medium text-lg mb-2">{t.preview.placeholder}</p>
                              <p className="text-sm text-muted-foreground">{t.preview.upload_prompt}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Prompt Editor */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">{t.prompt.title}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t.prompt.current_style}
                      </label>
                      <textarea
                        value={customPrompt || styleOptions.find(s => s.value === selectedStyle)?.prompt || ''}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="w-full p-3 bg-input border-2 border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-cl-yellow focus:outline-none resize-none"
                        rows={6}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {t.prompt.customize_hint}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setCustomPrompt(''); // Clear custom prompt to show default style prompt
                        }}
                        variant="outline"
                      >
                        {t.prompt.reset_button}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </section>
    </div>
  );
}