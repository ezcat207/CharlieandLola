import { Metadata } from "next";
import Script from 'next/script';

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
      ? 'Charlie and Lola 潮流玩法 - TikTok 热门教程'
      : 'Charlie and Lola Trend - TikTok Tutorial',
    description: isZh
      ? '学习如何参与TikTok上热门的Charlie and Lola潮流。简单三步，将你的照片变成可爱的卡通风格。'
      : 'Learn how to join the popular Charlie and Lola trend on TikTok. Turn your photos into cute cartoon style in just three simple steps.',
    keywords: isZh
      ? 'Charlie and Lola, TikTok 潮流, AI教程, 卡通滤镜, 热门挑战'
      : 'Charlie and Lola, TikTok trend, AI tutorial, cartoon filter, popular challenge',
    openGraph: {
      title: isZh ? 'Charlie and Lola 潮流玩法' : 'Charlie and Lola Trend',
      description: isZh
        ? '学习如何参与TikTok上热门的Charlie and Lola潮流。'
        : 'Learn how to join the popular Charlie and Lola trend on TikTok.',
      url: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}/showcase`,
      images: [
        {
          url: '/imgs/showcases/charlie-lola-trend.png',
          width: 1200,
          height: 630,
          alt: isZh ? 'Charlie and Lola 潮流' : 'Charlie and Lola Trend',
        },
      ],
    },
  };
}

export default function ShowcasePage() {
  const tiktokEmbeds = `
    <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@nicholejacklyne/video/7546708648509164813" data-video-id="7546708648509164813" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@nicholejacklyne" href="https://www.tiktok.com/@nicholejacklyne?refer=embed">@nicholejacklyne</a> Charlie and Lola trend tutorial using AI! The prompt is in the comments! Going to try to add it in the caption as well. I use ChatGPTAI to do the Charlie and Lola trend and this is my tutorial!! <a title="charlieandlola" target="_blank" href="https://www.tiktok.com/tag/charlieandlola?refer=embed">#charlieandlola</a> <a title="ai" target="_blank" href="https://www.tiktok.com/tag/ai?refer=embed">#ai</a> <a title="howto" target="_blank" href="https://www.tiktok.com/tag/howto?refer=embed">#howto</a> <a title="tutorial" target="_blank" href="https://www.tiktok.com/tag/tutorial?refer=embed">#tutorial</a> <a title="howtocharlieandlola" target="_blank" href="https://www.tiktok.com/tag/howtocharlieandlola?refer=embed">#howtocharlieandlola</a> <a target="_blank" title="♬ Man I Need - Olivia Dean" href="https://www.tiktok.com/music/Man-I-Need-7537414199037052945?refer=embed">♬ Man I Need - Olivia Dean</a> </section> </blockquote>
    <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@jingtian_6/video/7546530343692586247" data-video-id="7546530343692586247" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@jingtian_6" href="https://www.tiktok.com/@jingtian_6?refer=embed">@jingtian_6</a> Comment “yw” for the project 😽 <a title="charlieandlola" target="_blank" href="https://www.tiktok.com/tag/charlieandlola?refer=embed">#charlieandlola</a> <a title="charlielola" target="_blank" href="https://www.tiktok.com/tag/charlielola?refer=embed">#charlielola</a> <a title="inspo" target="_blank" href="https://www.tiktok.com/tag/inspo?refer=embed">#inspo</a> <a title="tutorial" target="_blank" href="https://www.tiktok.com/tag/tutorial?refer=embed">#tutorial</a> <a title="aifilter" target="_blank" href="https://www.tiktok.com/tag/aifilter?refer=embed">#aifilter</a> <a title="youware" target="_blank" href="https://www.tiktok.com/tag/youware?refer=embed">#youware</a> <a title="fyp" target="_blank" href="https://www.tiktok.com/tag/fyp?refer=embed">#fyp</a> <a title="fypage" target="_blank" href="https://www.tiktok.com/tag/fypage?refer=embed">#fypage</a> <a title="fypシ゚viral🖤tiktok" target="_blank" href="https://www.tiktok.com/tag/fyp%E3%82%B7%E3%82%9Aviral%F0%9F%96%A4tiktok?refer=embed">#fypシ゚viral🖤tiktok</a> <a title="fyppppppppppppppppppppppp" target="_blank" href="https://www.tiktok.com/tag/fyppppppppppppppppppppppp?refer=embed">#fyppppppppppppppppppppppp</a> <a target="_blank" title="♬ Call me maybe sped - Speed Songs" href="https://www.tiktok.com/music/Call-me-maybe-sped-7265817647822965536?refer=embed">♬ Call me maybe sped - Speed Songs</a> </section> </blockquote>
    <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@s.oupi/video/7547301820222262548" data-video-id="7547301820222262548" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@s.oupi" href="https://www.tiktok.com/@s.oupi?refer=embed">@s.oupi</a> saw this trend &#38; immediately opened procreate °❀ <a title="charlieandlola" target="_blank" href="https://www.tiktok.com/tag/charlieandlola?refer=embed">#charlieandlola</a> <a target="_blank" title="♬ Brasilian Skies - Masayoshi Takanaka" href="https://www.tiktok.com/music/Brasilian-Skies-7028804243830081537?refer=embed">♬ Brasilian Skies - Masayoshi Takanaka</a> </section> </blockquote>
    <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@kenna.day/video/7547021986875198775" data-video-id="7547021986875198775" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@kenna.day" href="https://www.tiktok.com/@kenna.day?refer=embed">@kenna.day</a> prompt: Transform the subject from the uploaded image into a character in the style of Charlie and Lola (children&#39;s cartoon). Match the official cartoon look - thin sketchy outlines, flat colors, childlike proportions, playful hand-drawn charm, and simple textures. Retain the subject&#39;s original clothing, hairstyle, facial features, accessories, skin tone, pose, and expression - but reinterpret them as if they belong in the Charlie and Lola world. Clothing should be simplified into flat shapes and bright colors, while keeping the overall outfit recognizable. Background: transparent to keep the focus on the character.&#34; Negative Prompt: &#34;No realistic shading, no detailed rendering, no anime or manga style, no 3D modeling, no photographic textures!&#39;  (I found this from another creator on tiktok, but this is the prompt I used!)🤍 <a title="charlieandlola" target="_blank" href="https://www.tiktok.com/tag/charlieandlola?refer=embed">#charlieandlola</a> <a title="chat" target="_blank" href="https://www.tiktok.com/tag/chat?refer=embed">#chat</a> <a title="chatgpt" target="_blank" href="https://www.tiktok.com/tag/chatgpt?refer=embed">#chatgpt</a> <a title="tutorial" target="_blank" href="https://www.tiktok.com/tag/tutorial?refer=embed">#tutorial</a> <a title="outfitinspo" target="_blank" href="https://www.tiktok.com/tag/outfitinspo?refer=embed">#outfitinspo</a> <a target="_blank" title="♬ Man I Need - Olivia Dean" href="https://www.tiktok.com/music/Man-I-Need-7537414199037052945?refer=embed">♬ Man I Need - Olivia Dean</a> </section> </blockquote>
  `;

  return (
    <>
      <Script async src="https://www.tiktok.com/embed.js" />
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">Charlie and Lola Trend Tutorial</h1>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">How to Create the Trend:</h2>
            <ol className="list-decimal list-inside space-y-2 mb-8">
              <li>Go to <a href="http://charlielola.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">http://charlielola.com</a></li>
              <li>Upload your image and click "Generate"</li>
              <li>Download the image and create an animation in TikTok</li>
            </ol>
          </div>
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            dangerouslySetInnerHTML={{ __html: tiktokEmbeds }}
          />
        </div>
      </div>
    </>
  );
}