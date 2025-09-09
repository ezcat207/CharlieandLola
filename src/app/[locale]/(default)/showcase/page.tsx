'use client';

import Script from 'next/script';

export default function ShowcasePage() {
  const tiktokEmbeds = `
    <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@nicholejacklyne/video/7546708648509164813" data-video-id="7546708648509164813" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@nicholejacklyne" href="https://www.tiktok.com/@nicholejacklyne?refer=embed">@nicholejacklyne</a> Charlie and Lola trend tutorial using AI! The prompt is in the comments! Going to try to add it in the caption as well. I use ChatGPTAI to do the Charlie and Lola trend and this is my tutorial!! <a title="charlieandlola" target="_blank" href="https://www.tiktok.com/tag/charlieandlola?refer=embed">#charlieandlola</a> <a title="ai" target="_blank" href="https://www.tiktok.com/tag/ai?refer=embed">#ai</a> <a title="howto" target="_blank" href="https://www.tiktok.com/tag/howto?refer=embed">#howto</a> <a title="tutorial" target="_blank" href="https://www.tiktok.com/tag/tutorial?refer=embed">#tutorial</a> <a title="howtocharlieandlola" target="_blank" href="https://www.tiktok.com/tag/howtocharlieandlola?refer=embed">#howtocharlieandlola</a> <a target="_blank" title="♬ Man I Need - Olivia Dean" href="https://www.tiktok.com/music/Man-I-Need-7537414199037052945?refer=embed">♬ Man I Need - Olivia Dean</a> </section> </blockquote>
    <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@jingtian_6/video/7546530343692586247" data-video-id="7546530343692586247" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@jingtian_6" href="https://www.tiktok.com/@jingtian_6?refer=embed">@jingtian_6</a> Comment "yw" for the project 😽 <a title="charlieandlola" target="_blank" href="https://www.tiktok.com/tag/charlieandlola?refer=embed">#charlieandlola</a> <a title="charlielola" target="_blank" href="https://www.tiktok.com/tag/charlielola?refer=embed">#charlielola</a> <a title="inspo" target="_blank" href="https://www.tiktok.com/tag/inspo?refer=embed">#inspo</a> <a title="tutorial" target="_blank" href="https://www.tiktok.com/tag/tutorial?refer=embed">#tutorial</a> <a title="aifilter" target="_blank" href="https://www.tiktok.com/tag/aifilter?refer=embed">#aifilter</a> <a title="youware" target="_blank" href="https://www.tiktok.com/tag/youware?refer=embed">#youware</a> <a title="fyp" target="_blank" href="https://www.tiktok.com/tag/fyp?refer=embed">#fyp</a> <a title="fypage" target="_blank" href="https://www.tiktok.com/tag/fypage?refer=embed">#fypage</a> <a title="fypシ゚viral🖤tiktok" target="_blank" href="https://www.tiktok.com/tag/fyp%E3%82%B7%E3%82%9Aviral%F0%9F%96%A4tiktok?refer=embed">#fypシ゚viral🖤tiktok</a> <a title="fyppppppppppppppppppppppp" target="_blank" href="https://www.tiktok.com/tag/fyppppppppppppppppppppppp?refer=embed">#fyppppppppppppppppppppppp</a> <a target="_blank" title="♬ Call me maybe sped - Speed Songs" href="https://www.tiktok.com/music/Call-me-maybe-sped-7265817647822965536?refer=embed">♬ Call me maybe sped - Speed Songs</a> </section> </blockquote>
    <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@s.oupi/video/7547301820222262548" data-video-id="7547301820222262548" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@s.oupi" href="https://www.tiktok.com/@s.oupi?refer=embed">@s.oupi</a> saw this trend &#38; immediately opened procreate °❀ <a title="charlieandlola" target="_blank" href="https://www.tiktok.com/tag/charlieandlola?refer=embed">#charlieandlola</a> <a target="_blank" title="♬ Brasilian Skies - Masayoshi Takanaka" href="https://www.tiktok.com/music/Brasilian-Skies-7028804243830081537?refer=embed">♬ Brasilian Skies - Masayoshi Takanaka</a> </section> </blockquote>
    <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@kenna.day/video/7547021986875198775" data-video-id="7547021986875198775" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@kenna.day" href="https://www.tiktok.com/@kenna.day?refer=embed">@kenna.day</a> prompt: Transform the subject from the uploaded image into a character in the style of Charlie and Lola (children's cartoon). Match the official cartoon look - thin sketchy outlines, flat colors, childlike proportions, playful hand-drawn charm, and simple textures. Retain the subject's original clothing, hairstyle, facial features, accessories, skin tone, pose, and expression - but reinterpret them as if they belong in the Charlie and Lola world. Clothing should be simplified into flat shapes and bright colors, while keeping the overall outfit recognizable. Background: transparent to keep the focus on the character. Negative Prompt: No realistic shading, no detailed rendering, no anime or manga style, no 3D modeling, no photographic textures! (I found this from another creator on tiktok, but this is the prompt I used!)🤍 <a title="charlieandlola" target="_blank" href="https://www.tiktok.com/tag/charlieandlola?refer=embed">#charlieandlola</a> <a title="chat" target="_blank" href="https://www.tiktok.com/tag/chat?refer=embed">#chat</a> <a title="chatgpt" target="_blank" href="https://www.tiktok.com/tag/chatgpt?refer=embed">#chatgpt</a> <a title="tutorial" target="_blank" href="https://www.tiktok.com/tag/tutorial?refer=embed">#tutorial</a> <a title="outfitinspo" target="_blank" href="https://www.tiktok.com/tag/outfitinspo?refer=embed">#outfitinspo</a> <a target="_blank" title="♬ Man I Need - Olivia Dean" href="https://www.tiktok.com/music/Man-I-Need-7537414199037052945?refer=embed">♬ Man I Need - Olivia Dean</a> </section> </blockquote>
  `;

  return (
    <>
      <Script async src="https://www.tiktok.com/embed.js" />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/30 px-4 py-2 rounded-full text-pink-700 dark:text-pink-300 font-medium mb-6">
              <span className="text-2xl">🎨</span>
              <span>#CharlieAndLola Trend</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-500 bg-clip-text text-transparent mb-6">
              Charlie and Lola Character Maker
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Transform your photos into adorable Charlie and Lola style characters! Join the viral TikTok trend that's taking over social media.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-16">
            {/* What Is This Trend */}
            <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🌟</span>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">What Is The #CharlieAndLola Trend?</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                <p className="text-lg leading-relaxed mb-6">
                  The <strong className="text-pink-600 dark:text-pink-400">#CharlieAndLola</strong> trend transforms ordinary photos into whimsical British storybook characters with:
                </p>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-2xl">
                    <h3 className="font-semibold text-pink-700 dark:text-pink-300 mb-3">✨ Visual Style</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Thin sketchy outlines</li>
                      <li>• Flat, bright colors</li>
                      <li>• Playful proportions</li>
                      <li>• Hand-drawn charm</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">🚀 Why It's Viral</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Nostalgic childhood vibes</li>
                      <li>• Easy "before → after" content</li>
                      <li>• Wholesome & recognizable</li>
                      <li>• Perfect for all ages</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border-l-4 border-yellow-400">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    🎯 <strong>Goal:</strong> Create 1 character → reuse as avatar, sticker, animation, or TikTok content!
                  </p>
                </div>
              </div>
            </section>

            {/* Easy Way */}
            <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">⚡</span>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Easiest Way: Charlie and Lola Character Maker</h2>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl mb-6">
                <p className="text-green-800 dark:text-green-200 font-medium">
                  🎉 <strong>No prompts, no tweaking, no hassle!</strong> Get perfect results in 10 seconds.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">📝 Simple Steps:</h3>
                  <ol className="space-y-3">
                    {[
                      { step: "Visit", text: "charlielola.com", highlight: true },
                      { step: "Upload", text: "clear face/half-body photo" },
                      { step: "Generate", text: "click & wait ~10 seconds" },
                      { step: "Download", text: "transparent PNG ready!" },
                      { step: "Create", text: "TikTok with transition effect" }
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          <strong>{item.step}:</strong> {item.highlight ? (
                            <a href="https://charlielola.com" target="_blank" rel="noopener noreferrer" 
                               className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium">
                              {item.text}
                            </a>
                          ) : item.text}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">✅ Why Choose This:</h3>
                  <ul className="space-y-3">
                    {[
                      "Zero prompt engineering needed",
                      "Consistent Charlie & Lola style",
                      "Transparent background included",
                      "Batch processing friendly",
                      "Optimized for social media"
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <span className="text-green-500 text-xl">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* ChatGPT Way */}
            <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🤖</span>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">DIY Method: Charlie and Lola ChatGPT Prompt</h2>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl mb-6">
                <p className="text-orange-800 dark:text-orange-200 font-medium">
                  ⚠️ <strong>More complex route:</strong> Requires manual tweaking, multiple attempts, and extra steps for best results.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">🛠️ What You'll Need:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• ChatGPT Plus or similar AI tool</li>
                      <li>• Background removal tool (remove.bg)</li>
                    </ul>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• Photo editing skills for tweaks</li>
                      <li>• Patience for multiple attempts</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">📋 Charlie and Lola ChatGPT Prompt:</h3>
                  <div className="bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 overflow-x-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-green-400 font-mono text-sm">charlie-lola-prompt.txt</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(`Transform the subject from the uploaded image into a character in the style of Charlie and Lola (children's cartoon). Match the official cartoon look - thin sketchy outlines, flat colors, childlike proportions, playful hand-drawn charm, and simple textures. Retain the subject's original clothing, hairstyle, facial features, accessories, skin tone, pose, and expression - but reinterpret them as if they belong in the Charlie and Lola world. Clothing should be simplified into flat shapes and bright colors, while keeping the overall outfit recognizable. Background: transparent to keep the focus on the character.

Negative Prompt: No realistic shading, no detailed rendering, no anime or manga style, no 3D modeling, no photographic textures.`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Copy Prompt
                      </button>
                    </div>
                    <pre className="text-green-300 text-sm leading-relaxed whitespace-pre-wrap">
{`Transform the subject from the uploaded image into a character in the style of Charlie and Lola (children's cartoon). Match the official cartoon look - thin sketchy outlines, flat colors, childlike proportions, playful hand-drawn charm, and simple textures. Retain the subject's original clothing, hairstyle, facial features, accessories, skin tone, pose, and expression - but reinterpret them as if they belong in the Charlie and Lola world. Clothing should be simplified into flat shapes and bright colors, while keeping the overall outfit recognizable. Background: transparent to keep the focus on the character.

Negative Prompt: No realistic shading, no detailed rendering, no anime or manga style, no 3D modeling, no photographic textures.`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">🔧 Extra Steps You'll Need:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• Remove background manually if needed</li>
                      <li>• Adjust prompt if proportions look off</li>
                    </ul>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• Retry with different wording variations</li>
                      <li>• Edit colors if they're too muted</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border-l-4 border-red-400">
                  <p className="text-red-800 dark:text-red-200">
                    <strong>Reality Check:</strong> This method gives you more control but is significantly slower and less predictable than using the dedicated character maker tool.
                  </p>
                </div>
              </div>
            </section>

            {/* TikTok Examples */}
            <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">📱</span>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Viral #CharlieAndLola Examples</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
                See how creators are using this trend to create engaging content and grow their following!
              </p>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 justify-items-center"
                dangerouslySetInnerHTML={{ __html: tiktokEmbeds }}
              />
            </section>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-500 p-8 rounded-3xl text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Join the Trend?</h2>
              <p className="text-xl mb-6 opacity-90">
                Create your Charlie and Lola character in seconds and start making viral content!
              </p>
              <a 
                href="https://charlielola.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                <span className="text-2xl">🎨</span>
                Start Creating Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
