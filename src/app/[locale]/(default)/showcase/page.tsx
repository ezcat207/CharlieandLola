import Showcase from "@/components/blocks/showcase";
import { getShowcasePage } from "@/services/page";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isZh = locale === 'zh';
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;

  return {
    title: isZh 
      ? 'Nano Banana 社区展示 - Twitter 用户作品分享'
      : 'Nano Banana Community Showcase - Twitter User Creations',
    description: isZh
      ? '看看Twitter上用户使用Nano Banana AI创造的精彩作品。下一代AI图像编辑技术的真实应用案例和创意分享。'
      : 'See what people are creating with Nano Banana AI on Twitter. Real examples and creative inspiration from the next generation of AI image editing.',
    keywords: isZh
      ? 'Nano Banana, Twitter展示, AI编辑案例, 社区作品, 用户创作, AI图像编辑'
      : 'Nano Banana, Twitter showcase, AI edit examples, community creations, user artwork, AI image editing',
    openGraph: {
      title: isZh ? 'Nano Banana Twitter 社区展示' : 'Nano Banana Twitter Community',
      description: isZh
        ? '探索Twitter用户使用Nano Banana AI创作的精彩作品和教程'
        : 'Explore amazing creations and tutorials from Twitter users using Nano Banana AI',
      url: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}/showcase`,
      images: [
        {
          url: '/imgs/gallery/cyberpunk-neon-city-street-scene.png',
          width: 1200,
          height: 630,
          alt: isZh ? 'Nano Banana 社区作品展示' : 'Nano Banana Community Showcase',
        },
      ],
    },
  };
}

export default async function ShowcasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getShowcasePage(locale);

  // Dynamically import TwitterShowcase to avoid SSR issues
  const TwitterShowcase = (await import("@/components/blocks/twitter-showcase")).default;
  
  // Type assertion since we know the structure of our showcase data
  return <>{page.showcase && <TwitterShowcase section={page.showcase as any} />}</>;
}
