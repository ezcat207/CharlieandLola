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
      ? 'Charlie and Lola 风格生成器 - #CharlieAndLola TikTok 热门趋势教程'
      : 'Charlie and Lola Character Maker - #CharlieAndLola TikTok Trend Tutorial',
    description: isZh
      ? '学习如何参与TikTok上超火的#CharlieAndLola趋势！用AI将照片变成Charlie and Lola卡通风格，包含ChatGPT完整prompt教程。'
      : 'Join the viral #CharlieAndLola TikTok trend! Transform your photos into Charlie and Lola cartoon style using AI. Includes complete ChatGPT prompt tutorial.',
    keywords: isZh
      ? 'Charlie and Lola, charlie and lola character maker, charlie and lola chatgpt prompt, #charlieandlola, TikTok趋势, AI卡通生成器'
      : 'Charlie and Lola, charlie and lola character maker, charlie and lola chatgpt prompt, #charlieandlola, TikTok trend, AI cartoon generator',
    openGraph: {
      title: isZh ? 'Charlie and Lola 风格生成器 - TikTok热门趋势' : 'Charlie and Lola Character Maker - TikTok Trend',
      description: isZh
        ? '参与超火的#CharlieAndLola TikTok趋势，AI生成卡通风格头像'
        : 'Join the viral #CharlieAndLola TikTok trend with AI-generated cartoon avatars',
      url: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}/showcase`,
      images: [
        {
          url: '/imgs/showcases/charlie-lola-trend.png',
          width: 1200,
          height: 630,
          alt: isZh ? 'Charlie and Lola 趋势生成器' : 'Charlie and Lola Character Maker',
        },
      ],
    },
  };
}

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
