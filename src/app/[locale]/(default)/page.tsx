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
      ? '🔥 免费查理和罗拉角色生成器 - 比ChatGPT提示词更好 | 加入#CharlieAndLola热门趋势'
      : '🔥 FREE Charlie & Lola Character Maker - Better Than ChatGPT Prompts | Join #CharlieAndLola Trend',
    description: isZh
      ? '⚡ 比ChatGPT提示词快10倍！免费查理和罗拉角色生成器，10秒创建病毒式内容。加入200万创作者的#CharlieAndLola热门趋势，无需注册立即开始！'
      : '⚡ 10x faster than ChatGPT prompts! FREE Charlie and Lola character maker creates viral content in 10 seconds. Join 2M+ creators in the #CharlieAndLola trend. No sign-up required - start trending now!',
    keywords: isZh
      ? '查理和罗拉角色生成器, #CharlieAndLola, 查理和罗拉趋势, 查理和罗拉ChatGPT提示词, TikTok热门趋势, 抖音查理和罗拉, 小红书查理和罗拉, 社交媒体趋势, 病毒式内容创作, AI角色生成器, 卡通角色制作, 免费在线工具, 查理和罗拉风格, 角色转换器'
      : 'Charlie and Lola character maker, Charlie and Lola trend, Charlie and Lola ChatGPT prompt, #CharlieAndLola, viral TikTok trend, Charlie and Lola AI generator, better than ChatGPT, free character maker, viral content creator, TikTok Charlie and Lola, Instagram trends, social media viral, character transformation, cartoon generator, trending AI tool, Charlie and Lola viral content',
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
        ? '🔥 免费查理和罗拉生成器 - 比ChatGPT快10倍 | #CharlieAndLola热门趋势'
        : '🔥 FREE Charlie & Lola Generator - 10x Faster Than ChatGPT | #CharlieAndLola Trend',
      description: isZh
        ? '⚡ 2M+创作者选择我们！10秒创建病毒式#CharlieAndLola内容，比ChatGPT提示词快10倍。无需注册，立即加入热门趋势！'
        : '⚡ 2M+ creators choose us! Create viral #CharlieAndLola content in 10 seconds - 10x faster than ChatGPT prompts. No sign-up required, start trending now!',
      siteName: 'CharlieandLola.net',
      images: [
        {
          url: 'https://pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev/template/toy_org.jpg',
          width: 1200,
          height: 630,
          alt: isZh ? 'AI角色手办生成示例' : 'AI Character Figure Generation Example',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isZh 
        ? '🔥 免费查理和罗拉生成器 - 比ChatGPT快10倍！'
        : '🔥 FREE Charlie & Lola Generator - 10x Faster Than ChatGPT!',
      description: isZh
        ? '⚡ 加入2M+创作者！10秒创建病毒式#CharlieAndLola内容，无需注册立即开始！'
        : '⚡ Join 2M+ creators! Create viral #CharlieAndLola content in 10 seconds - no sign-up required!',
      images: ['https://pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev/template/toy_org.jpg'],
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
      'application-name': 'Charlie and Lola AI Editor',
      'apple-mobile-web-app-title': 'Charlie and Lola',
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
        ? "无需注册登录即可免费使用！使用先进的AI图像转换技术，将任何照片转换为迷人的查理和罗拉风格角色。完美的儿童绘本风格，创作个性化纪念品和特殊礼物。"
        : "No sign-up required! Free to use instantly! Transform any photo into charming Charlie and Lola style characters using advanced AI image transformation technology. Perfect children's book style for creating personalized keepsakes and special gifts.",
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
        "无需注册登录，立即免费使用",
        "最先进的Google Charlie-and-Lola-Edit模型",
        "100%保证真实模型，无需抽卡",
        "预制热门模版一键生成",
        "3D角色手办制作",
        "明星合影生成",
        "专业教程博客指导",
        "实时生成高质量图片"
      ] : [
        "No sign-up required - Use instantly for free",
        "Advanced Google Charlie-and-Lola-Edit model",
        "100% guaranteed authentic model, no lottery",
        "Pre-built popular templates for one-click generation",
        "3D character figure creation",
        "Celebrity selfie generation",
        "Professional tutorial blog guidance",
        "Real-time high-quality image generation"
      ],
      "screenshot": `https://pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev/template/toy_org.jpg`,
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
          "name": "什么是Charlie-and-Lola-Edit模型？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Charlie-and-Lola-Edit是Google最新发布的AI图像编辑模型，专门用于高质量角色图像生成和编辑，100%保证使用真实模型，无需抽卡。"
          }
        },
        {
          "@type": "Question", 
          "name": "如何使用Charlie and Lola生成角色手办？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "只需上传您的图片，选择预制的角色手办模板，点击生成按钮即可一键创建专业3D角色手办效果图片。"
          }
        }
      ] : [
        {
          "@type": "Question",
          "name": "What is the Charlie-and-Lola-Edit model?",
          "acceptedAnswer": {
            "@type": "Answer", 
            "text": "Charlie-and-Lola-Edit is Google's latest AI image editing model, specifically designed for high-quality character image generation and editing, 100% guaranteed authentic model with no lottery system."
          }
        },
        {
          "@type": "Question",
          "name": "How to generate character figures with Charlie and Lola?",
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
