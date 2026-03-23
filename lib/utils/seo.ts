export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleJsonLd(post: {
  title: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  published_at?: string;
  updated_at?: string;
  author_name?: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    image: post.image_url || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    author: {
      '@type': 'Person',
      name: post.author_name || 'ZTech Grup',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ZTech Grup',
      url: 'https://ztechco.my.id',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ztechco.my.id/blog/${post.slug}`,
    },
  };
}
