export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  thumbnail?: string;
  content?: string; // HTML string — sanitized before render
};

export type BlogListResult = {
  posts: BlogPost[];
  total: number;
  totalPages: number;
};

// External blog API — set BLOG_API_URL in .env to use a real data source.
// When unset, falls back to built-in mock data.
const BLOG_API_URL = process.env.BLOG_API_URL;

// Mock data — replace with your real data source
const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    slug: "introduction-to-blockchain-technology",
    title: "Introduction to Blockchain Technology",
    description: "Learn the fundamental concepts of blockchain and its real-world applications.",
    date: "2026-03-15",
    category: "Technology",
    thumbnail: "https://placehold.co/800x500/1a56db/ffffff?text=Blog+1",
    content: `<h2>What is Blockchain?</h2><p>A blockchain is a distributed ledger that records transactions across many computers so that the record cannot be altered retroactively.</p><h2>Key Concepts</h2><ul><li><strong>Decentralization</strong> — no single point of control.</li><li><strong>Immutability</strong> — once recorded, data cannot be changed.</li><li><strong>Transparency</strong> — all participants can view the ledger.</li></ul><p>Blockchain technology underpins cryptocurrencies like Bitcoin and Ethereum, but its applications extend far beyond finance into supply chain, healthcare, and identity management.</p>`,
  },
  {
    slug: "smart-contracts-explained",
    title: "Smart Contracts Explained",
    description: "Discover how smart contracts work and why they matter.",
    date: "2026-03-10",
    category: "Technology",
    thumbnail: "https://placehold.co/800x500/1e429f/ffffff?text=Blog+2",
    content: `<h2>What Are Smart Contracts?</h2><p>Smart contracts are self-executing programs stored on a blockchain that run when predetermined conditions are met.</p><h2>How They Work</h2><ol><li>Two parties agree on terms encoded in the contract.</li><li>The contract is deployed to the blockchain.</li><li>When conditions are satisfied, the contract executes automatically.</li></ol><blockquote><p>Smart contracts eliminate the need for intermediaries, reducing costs and increasing trust.</p></blockquote>`,
  },
  {
    slug: "our-platform-v2-launch",
    title: "Platform v2.0 Launch",
    description: "We are excited to announce the launch of version 2.0 with many new features.",
    date: "2026-03-05",
    category: "Product",
    thumbnail: "https://placehold.co/800x500/155e75/ffffff?text=Blog+3",
    content: `<h2>What's New in v2.0</h2><p>We've been working hard over the past six months to bring you the most significant update to our platform yet.</p><h2>Highlights</h2><ul><li><strong>Faster performance</strong> — 3x speed improvement across all operations.</li><li><strong>New dashboard</strong> — redesigned UI with improved analytics.</li><li><strong>API v2</strong> — a cleaner, more consistent REST API.</li></ul><p>Existing users will be automatically migrated. See our <a href="#">migration guide</a> for details.</p>`,
  },
  {
    slug: "industry-partnership-announcement",
    title: "Strategic Partnership Announcement",
    description: "We have signed a strategic partnership agreement with leading industry partners.",
    date: "2026-02-28",
    category: "News",
    thumbnail: "https://placehold.co/800x500/14532d/ffffff?text=Blog+4",
    content: `<h2>A New Chapter</h2><p>We are thrilled to announce our strategic partnership with several leading organizations in the industry.</p><p>This partnership will accelerate our roadmap and bring more value to our users through expanded integrations and co-developed features.</p><h2>What This Means for You</h2><ul><li>Access to exclusive partner integrations.</li><li>Expanded customer support coverage.</li><li>Joint product development initiatives.</li></ul>`,
  },
  {
    slug: "decentralized-identity-future",
    title: "The Future of Decentralized Identity",
    description: "How DID is transforming the way we manage digital identity.",
    date: "2026-02-20",
    category: "Technology",
    thumbnail: "https://placehold.co/800x500/4c1d95/ffffff?text=Blog+5",
    content: `<h2>The Problem with Centralized Identity</h2><p>Today, our digital identities are fragmented across dozens of platforms, each holding personal data in siloed, vulnerable databases.</p><h2>Decentralized Identifiers (DIDs)</h2><p>DIDs are a new type of identifier that enables verifiable, self-sovereign digital identity. Users control their own data without relying on any central authority.</p><h2>Real-World Applications</h2><ul><li>Passwordless login across services.</li><li>Portable, verifiable credentials (diplomas, licenses).</li><li>Privacy-preserving KYC for financial services.</li></ul>`,
  },
];

/** Fetch posts filtered by category — used by /api/blogs route for client-side TanStack Query. */
export async function getBlogPostsByCategory({
  category,
  page = 1,
  pageSize = 9999,
}: {
  category: string;
  page?: number;
  pageSize?: number;
}): Promise<BlogPost[]> {
  if (BLOG_API_URL) {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (category !== "all") params.set("category", category);
    const res = await fetch(`${BLOG_API_URL}/posts?${params}`, { next: { revalidate: 60 } });
    return res.json();
  }
  const filtered = category !== "all" ? MOCK_BLOG_POSTS.filter((p) => p.category === category) : MOCK_BLOG_POSTS;
  return filtered.slice((page - 1) * pageSize, page * pageSize);
}

/** Fetch all blog posts (latest N for homepage section). */
export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  if (BLOG_API_URL) {
    const url = limit ? `${BLOG_API_URL}/posts?limit=${limit}` : `${BLOG_API_URL}/posts`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    return res.json();
  }
  return limit ? MOCK_BLOG_POSTS.slice(0, limit) : MOCK_BLOG_POSTS;
}

/** Fetch paginated + filtered blog posts for the blog list page. */
export async function getBlogPostsPaginated({
  page = 1,
  pageSize = 6,
  category,
}: {
  page?: number;
  pageSize?: number;
  category?: string;
}): Promise<BlogListResult> {
  if (BLOG_API_URL) {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (category) params.set("category", category);
    const res = await fetch(`${BLOG_API_URL}/posts?${params}`, { next: { revalidate: 60 } });
    return res.json();
  }

  const filtered = category ? MOCK_BLOG_POSTS.filter((p) => p.category === category) : MOCK_BLOG_POSTS;
  const total = filtered.length;
  const posts = filtered.slice((page - 1) * pageSize, page * pageSize);
  return { posts, total, totalPages: Math.ceil(total / pageSize) };
}

/** Fetch all unique categories. */
export async function getBlogCategories(): Promise<string[]> {
  if (BLOG_API_URL) {
    const res = await fetch(`${BLOG_API_URL}/categories`, { next: { revalidate: 3600 } });
    return res.json();
  }
  return [...new Set(MOCK_BLOG_POSTS.map((p) => p.category))];
}

/** Fetch a single blog post by slug. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (BLOG_API_URL) {
    const res = await fetch(`${BLOG_API_URL}/posts/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  }
  return MOCK_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

/** Fetch related posts (same category, excluding current slug). */
export async function getRelatedPosts(category: string, excludeSlug: string): Promise<BlogPost[]> {
  if (BLOG_API_URL) {
    const res = await fetch(`${BLOG_API_URL}/posts?category=${category}&exclude=${excludeSlug}`);
    return res.json();
  }
  return MOCK_BLOG_POSTS.filter((p) => p.category === category && p.slug !== excludeSlug);
}
