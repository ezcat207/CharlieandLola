import CTA from "@/components/blocks/cta";
import FAQ from "@/components/blocks/faq";
import Feature from "@/components/blocks/feature";
import Feature1 from "@/components/blocks/feature1";
import Feature2 from "@/components/blocks/feature2";
import Feature3 from "@/components/blocks/feature3";
import Hero from "@/components/blocks/hero";
import ImagenWrapper from "@/components/blocks/imagen-wrapper";
import Pricing from "@/components/blocks/pricing";
import Showcase from "@/components/blocks/showcase";
import Stats from "@/components/blocks/stats";
import Testimonial from "@/components/blocks/testimonial";
import { getLandingPage } from "@/services/page";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const revalidate = 60;
export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}`;
  }

  const isZh = locale === 'zh';
  
  return {
    title: isZh 
      ? '查理和罗拉风格转换器 - 将照片转换为可爱卡通角色 | AI魔法变身'
      : 'Charlie and Lola Style Converter - Transform Photos into Beloved Characters | AI Magic',
    description: isZh
      ? '使用先进的Gemini 2.5 Flash Image Preview技术，将任何照片转换为迷人的查理和罗拉风格角色。完美的儿童绘本风格，适合创作私人定制的纪念书和纪念品。'
      : 'Transform any photo into charming Charlie and Lola style characters using advanced Gemini 2.5 Flash Image Preview technology. Perfect children\'s book style for creating personalized storybooks and keepsakes.',
    keywords: isZh
      ? '查理和罗拉, 角色转换器, 儿童绘本风格, AI照片转换, 家庭写真, 角色艺术, 儿童插图, 卡通变身, 照片魔法, Gemini AI'
      : 'Charlie and Lola, Character Converter, Children\'s Book Style, AI Photo Transformation, Family Portraits, Character Art, Children\'s Illustration, Cartoon Transformation, Photo Magic, Gemini AI',
    authors: [{ name: 'Charlie and Lola Style Team' }],
    creator: 'CharlieandLola.net',
    publisher: 'CharlieandLola.net',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: canonicalUrl,
      title: isZh 
        ? 'NanoBanana - 最强AI角色手办生成器'
        : 'NanoBanana - Best AI Character Generator',
      description: isZh
        ? '100%保证使用最先进的Google Nano-Banana-Edit模型，预制多种热门模版一键快速生成AI角色手办'
        : '100% guaranteed Google Nano-Banana-Edit model with pre-built templates for AI character figure generation',
      siteName: 'NanoBanana.best',
      images: [
        {
          url: '/imgs/template/toy_org.jpg',
          width: 1200,
          height: 630,
          alt: isZh ? 'AI角色手办生成示例' : 'AI Character Figure Generation Example',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isZh 
        ? 'NanoBanana - 最强AI角色手办生成器'
        : 'NanoBanana - Best AI Character Generator',
      description: isZh
        ? '100%保证使用最先进的Google Nano-Banana-Edit模型，预制多种热门模版一键快速生成'
        : '100% guaranteed Google Nano-Banana-Edit model with pre-built templates',
      images: ['/imgs/template/toy_org.jpg'],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_WEB_URL}`,
        'zh': `${process.env.NEXT_PUBLIC_WEB_URL}/zh`,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      other: {
        'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION || '',
        'msvalidate.01': 'EF14BA988A6933B400193F58A798FF2A',
      },
    },
    category: isZh ? 'AI工具' : 'AI Tools',
    classification: isZh ? 'AI图像生成器' : 'AI Image Generator',
    other: {
      'application-name': 'NanoBanana AI Editor',
      'apple-mobile-web-app-title': 'NanoBanana',
      'format-detection': 'telephone=no',
      'theme-color': '#d4af37',
      'color-scheme': 'dark light',
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await getLandingPage(locale);
  const isZh = locale === 'zh';
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;

  // Enhanced structured data with multiple schema types for better AI understanding
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": ["WebApplication", "SoftwareApplication"],
      "name": isZh ? "查理和罗拉风格转换器" : "Charlie and Lola Style Converter",
      "alternateName": isZh ? "查理罗拉角色魔法" : "Charlie Lola Character Magic",
      "url": `${baseUrl}${locale === 'en' ? '' : `/${locale}`}`,
      "description": isZh 
        ? "使用先进的Gemini 2.5 Flash Image Preview技术，将任何照片转换为迷人的查理和罗拉风格角色。完美的儿童绘本风格，创作个性化纪念品和特殊礼物。"
        : "Transform any photo into charming Charlie and Lola style characters using advanced Gemini 2.5 Flash Image Preview technology. Perfect children's book style for creating personalized keepsakes and special gifts.",
      "applicationCategory": ["AI Tool", "Character Converter", "Children's Art"],
      "operatingSystem": "Web Browser",
      "browserRequirements": "Requires JavaScript, Modern Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "category": "Character Transformation Service"
      },
      "creator": {
        "@type": "Organization",
        "name": "CharlieandLola.net",
        "url": baseUrl,
        "foundingDate": "2024",
        "description": isZh ? "专业AI图像生成技术提供商" : "Professional AI image generation technology provider"
      },
      "featureList": isZh ? [
        "最先进的Google Nano-Banana-Edit模型",
        "100%保证真实模型，无需抽卡",
        "预制热门模版一键生成",
        "3D角色手办制作",
        "明星合影生成",
        "专业教程博客指导",
        "免费使用无限制",
        "实时生成高质量图片"
      ] : [
        "Advanced Google Nano-Banana-Edit model",
        "100% guaranteed authentic model, no lottery",
        "Pre-built popular templates for one-click generation",
        "3D character figure creation",
        "Celebrity selfie generation",
        "Professional tutorial blog guidance",
        "Free unlimited usage",
        "Real-time high-quality image generation"
      ],
      "screenshot": `${baseUrl}/imgs/template/toy_org.jpg`,
      "dateModified": new Date().toISOString(),
      "inLanguage": locale,
      "audience": {
        "@type": "Audience",
        "audienceType": isZh ? "AI图像编辑爱好者" : "AI image editing enthusiasts"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": isZh ? [
        {
          "@type": "Question",
          "name": "什么是Nano-Banana-Edit模型？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nano-Banana-Edit是Google最新发布的AI图像编辑模型，专门用于高质量角色图像生成和编辑，100%保证使用真实模型，无需抽卡。"
          }
        },
        {
          "@type": "Question", 
          "name": "如何使用NanoBanana生成角色手办？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "只需上传您的图片，选择预制的角色手办模板，点击生成按钮即可一键创建专业3D角色手办效果图片。"
          }
        }
      ] : [
        {
          "@type": "Question",
          "name": "What is the Nano-Banana-Edit model?",
          "acceptedAnswer": {
            "@type": "Answer", 
            "text": "Nano-Banana-Edit is Google's latest AI image editing model, specifically designed for high-quality character image generation and editing, 100% guaranteed authentic model with no lottery system."
          }
        },
        {
          "@type": "Question",
          "name": "How to generate character figures with NanoBanana?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply upload your image, select from pre-built character figure templates, and click generate to create professional 3D character figure images with one click."
          }
        }
      ]
    }
  ];

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data),
          }}
        />
      ))}
      <ImagenWrapper locale={locale} />
      {page.introduce && <Feature1 section={page.introduce} />}
      {page.benefit && <Feature2 section={page.benefit} />}
      {page.usage && <Feature3 section={page.usage} />}
      {page.feature && <Feature section={page.feature} />}
      {page.showcase && <Showcase section={page.showcase} />}
      {page.stats && <Stats section={page.stats} />}
      {page.pricing && <Pricing pricing={page.pricing} />}
      {page.testimonial && <Testimonial section={page.testimonial} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}
    </>
  );
}
