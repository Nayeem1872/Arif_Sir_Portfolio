import type { Blog } from "@/types/data";

export const blogsData: Blog[] = [
  {
    _id: "1",
    title: "Building High-Performance Trading Systems",
    content:
      "Deep dive into creating low-latency trading engines with C++ and optimized algorithms for financial markets. This comprehensive guide covers architecture patterns, performance optimization techniques, and real-world implementation strategies.",
    excerpt:
      "Deep dive into creating low-latency trading engines with C++ and optimized algorithms for financial markets.",
    author: "Arif Rahim",
    category: "Software Engineering",
    tags: ["C++", "Low Latency", "Financial Systems", "Performance"],
    published: true,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&crop=center",
    ],
    createdAt: "2024-12-15T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
    // Legacy fields for backward compatibility
    _updatedAt: "2024-12-15T00:00:00Z",
    slug: "high-performance-trading-systems",
    publishedAt: "2024-12-15T00:00:00Z",
    readTime: "8 min read",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&crop=center",
  },
  {
    _id: "2",
    title: "Microservices Architecture in Enterprise",
    content:
      "Microservices have revolutionized how we build enterprise applications. This article covers best practices, patterns, and real-world implementation strategies for building robust microservices platforms.",
    excerpt:
      "Learn how to design and implement scalable microservices platforms using Java Spring Boot and Kubernetes orchestration.",
    author: "Arif Rahim",
    category: "Architecture",
    tags: ["Java", "Spring Boot", "Kubernetes", "Microservices"],
    published: true,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center",
    ],
    createdAt: "2024-12-10T00:00:00Z",
    updatedAt: "2024-12-10T00:00:00Z",
    // Legacy fields for backward compatibility
    _updatedAt: "2024-12-10T00:00:00Z",
    slug: "microservices-enterprise-architecture",
    publishedAt: "2024-12-10T00:00:00Z",
    readTime: "12 min read",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center",
  },
  {
    _id: "3",
    title: "Infrastructure as Code Best Practices",
    content:
      "Infrastructure as Code (IaC) is essential for modern cloud deployments. Discover how to implement robust, scalable, and maintainable infrastructure using industry best practices.",
    excerpt:
      "Master cloud infrastructure automation with Terraform, CI/CD pipelines, and comprehensive monitoring strategies.",
    author: "Arif Rahim",
    category: "DevOps",
    tags: ["DevOps", "Terraform", "AWS", "CI/CD"],
    published: true,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center",
    ],
    createdAt: "2024-12-05T00:00:00Z",
    updatedAt: "2024-12-05T00:00:00Z",
    // Legacy fields for backward compatibility
    _updatedAt: "2024-12-05T00:00:00Z",
    slug: "infrastructure-as-code-best-practices",
    publishedAt: "2024-12-05T00:00:00Z",
    readTime: "10 min read",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center",
  },
  {
    _id: "4",
    title: "Modern React Development Patterns",
    content:
      "React continues to evolve with new patterns and best practices. This guide covers the latest development patterns, custom hooks, and performance optimization strategies.",
    excerpt:
      "Explore advanced React patterns, hooks, and performance optimization techniques for building scalable applications.",
    author: "Arif Rahim",
    category: "Frontend",
    tags: ["React", "TypeScript", "Performance", "Hooks"],
    published: true,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&crop=center",
    ],
    createdAt: "2024-11-28T00:00:00Z",
    updatedAt: "2024-11-28T00:00:00Z",
    // Legacy fields for backward compatibility
    _updatedAt: "2024-11-28T00:00:00Z",
    slug: "modern-react-development-patterns",
    publishedAt: "2024-11-28T00:00:00Z",
    readTime: "15 min read",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&crop=center",
  },
];
