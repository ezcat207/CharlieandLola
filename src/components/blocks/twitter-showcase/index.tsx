import { TwitterEmbed } from "@/components/ui/twitter-embed";

interface TwitterShowcaseItem {
  html: string;
  id: string;
}

interface TwitterShowcaseSection {
  title?: string;
  description?: string;
  disabled?: boolean;
  items?: TwitterShowcaseItem[];
}

export default function TwitterShowcase({ section }: { section: TwitterShowcaseSection }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section className="container py-16">
      <div className="mx-auto mb-12 text-center">
        <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
          {section.title}
        </h2>
        <p className="mb-4 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
          {section.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {section.items?.map((item, index) => (
          <div 
            key={item.id || index} 
            className="flex justify-center"
          >
            <TwitterEmbed 
              html={item.html} 
              className="w-full max-w-md"
            />
          </div>
        ))}
      </div>
    </section>
  );
}