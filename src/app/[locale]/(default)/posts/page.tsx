import Blog from "@/components/blocks/blog";
import { BlogItem, Blog as BlogType } from "@/types/blocks/blog";
import { getPostsByLocale, getPostsByLocaleAndCategory } from "@/models/post";
import {
  CategoryStatus,
  getCategories,
  findCategoryByName,
} from "@/models/category";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const isZh = locale === 'zh';

  let canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/posts`;

  if (locale !== "en") {
    canonicalUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/posts`;
  }

  return {
    title: isZh 
      ? 'Nano Banana 教程博客 - AI图像编辑技巧与指南'
      : 'Nano Banana Tutorial Blog - AI Image Editing Tips & Guides',
    description: isZh
      ? '学习如何使用Nano Banana AI图像编辑器。100%保证使用Google Nano-Banana-Edit模型的专业教程、技巧和创意灵感。掌握AI图像编辑的最佳实践。'
      : 'Learn how to use Nano Banana AI image editor. Professional tutorials, tips, and creative inspiration using our 100% guaranteed Google Nano-Banana-Edit model. Master AI image editing best practices.',
    keywords: isZh
      ? 'Nano Banana 教程, AI图像编辑技巧, 图像编辑指南, AI编辑教程, Nano Banana 使用方法'
      : 'Nano Banana tutorials, AI image editing tips, image editing guide, AI editing tutorials, Nano Banana how to use',
    openGraph: {
      title: isZh ? 'Nano Banana 教程博客' : 'Nano Banana Tutorial Blog',
      description: isZh
        ? '专业的Nano Banana AI图像编辑教程和技巧分享'
        : 'Professional Nano Banana AI image editing tutorials and tips',
      url: canonicalUrl,
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function PostsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations();

  const categories = await getCategories({
    status: CategoryStatus.Online,
    page: 1,
    limit: 200,
  });

  let posts;
  if (category) {
    const matched = await findCategoryByName(category);
    posts = matched
      ? await getPostsByLocaleAndCategory(locale, matched.uuid!)
      : [];
  } else {
    posts = await getPostsByLocale(locale);
  }

  const blog: BlogType = {
    title: t("blog.title"),
    description: t("blog.description"),
    items: posts as unknown as BlogItem[],
    read_more_text: t("blog.read_more_text"),
  };

  return (
    <div className="container py-6 md:py-8">
      <Blog
        blog={blog}
        categories={categories as any}
        category={category as any}
      />
    </div>
  );
}
