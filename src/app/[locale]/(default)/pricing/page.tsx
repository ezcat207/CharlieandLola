import Pricing from "@/components/blocks/pricing";
import { getPricingPage } from "@/services/page";
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
      ? 'Charlie and Lola AI 定价 - 最实惠的AI图像编辑服务'
      : 'Charlie and Lola AI Pricing - Affordable AI Image Editing Plans',
    description: isZh
      ? '查看Charlie and Lola AI AI图像编辑器的定价计划。100%保证使用Google Charlie-and-Lola-Edit模型，无需抽卡。选择最适合您需求的套餐。'
      : 'View Charlie and Lola AI AI image editor pricing plans. 100% guaranteed Google Charlie-and-Lola-Edit model, no lottery. Choose the plan that fits your needs.',
    keywords: isZh
      ? 'Charlie and Lola AI 价格, AI图像编辑定价, 订阅计划, 积分套餐, AI编辑费用'
      : 'Charlie and Lola AI pricing, AI image editing cost, subscription plans, credit packages, AI editing fees',
    openGraph: {
      title: isZh ? 'Charlie and Lola AI 定价计划' : 'Charlie and Lola AI Pricing Plans',
      description: isZh
        ? '100%保证使用Google Charlie-and-Lola-Edit模型的AI图像编辑服务定价'
        : '100% guaranteed Google Charlie-and-Lola-Edit model AI image editing service pricing',
      url: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}/pricing`,
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getPricingPage(locale);

  return <>{page.pricing && <Pricing pricing={page.pricing} />}</>;
}
