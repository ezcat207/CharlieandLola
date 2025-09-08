export interface TwitterEmbedData {
  html: string;
  id: string;
}

export function parseTwitterEmbedsFromMarkdown(content: string): TwitterEmbedData[] {
  const embeds: TwitterEmbedData[] = [];
  
  // Split by double line breaks to separate embeds
  const sections = content.split(/\n\n+/);
  
  let embedIndex = 1;
  
  for (const section of sections) {
    const trimmedSection = section.trim();
    
    // Check if this section contains a Twitter blockquote
    if (trimmedSection.includes('<blockquote class="twitter-tweet"') && 
        trimmedSection.includes('</blockquote>') && 
        trimmedSection.includes('<script async src="https://platform.twitter.com/widgets.js"')) {
      
      // Extract the blockquote HTML (without the script tag since we'll handle that separately)
      const blockquoteMatch = trimmedSection.match(/<blockquote class="twitter-tweet"[\s\S]*?<\/blockquote>/);
      
      if (blockquoteMatch) {
        const blockquoteHtml = blockquoteMatch[0];
        
        // Extract tweet ID from the URL if possible
        const urlMatch = blockquoteHtml.match(/href="https:\/\/twitter\.com\/\w+\/status\/(\d+)/);
        const tweetId = urlMatch ? urlMatch[1] : `embed-${embedIndex}`;
        
        embeds.push({
          html: blockquoteHtml,
          id: tweetId
        });
        
        embedIndex++;
      }
    }
  }
  
  return embeds;
}