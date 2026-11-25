import { MetadataRoute } from 'next';
import { TOOLS } from '@/types/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://localkit.online';

  const toolRoutes = TOOLS.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: tool.isPopular ? 0.9 : 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...toolRoutes,
  ];
}
