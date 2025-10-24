import type { Blog } from "@/types/data";

export const blogsData: Blog[] = [
  {
    _id: "1",
    _updatedAt: "2024-12-15T00:00:00Z",
    title: "Building High-Performance Trading Systems",
    slug: "high-performance-trading-systems",
    excerpt:
      "Deep dive into creating low-latency trading engines with C++ and optimized algorithms for financial markets.",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "In the world of high-frequency trading, every microsecond counts. This comprehensive guide explores the architecture and implementation of trading systems that can handle thousands of transactions per second with minimal latency.",
          },
        ],
      },
    ],
    publishedAt: "2024-12-15T00:00:00Z",
    readTime: "8 min read",
    category: "Software Engineering",
    tags: ["C++", "Low Latency", "Financial Systems", "Performance"],
    featured: true,
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&crop=center",
    author: {
      name: "Arif Rahim",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
  },
  {
    _id: "2",
    _updatedAt: "2024-12-10T00:00:00Z",
    title: "Microservices Architecture in Enterprise",
    slug: "microservices-enterprise-architecture",
    excerpt:
      "Learn how to design and implement scalable microservices platforms using Java Spring Boot and Kubernetes orchestration.",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Microservices have revolutionized how we build enterprise applications. This article covers best practices, patterns, and real-world implementation strategies for building robust microservices platforms.",
          },
        ],
      },
    ],
    publishedAt: "2024-12-10T00:00:00Z",
    readTime: "12 min read",
    category: "Architecture",
    tags: ["Java", "Spring Boot", "Kubernetes", "Microservices"],
    featured: true,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center",
    author: {
      name: "Arif Rahim",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
  },
  {
    _id: "3",
    _updatedAt: "2024-12-05T00:00:00Z",
    title: "Infrastructure as Code Best Practices",
    slug: "infrastructure-as-code-best-practices",
    excerpt:
      "Master cloud infrastructure automation with Terraform, CI/CD pipelines, and comprehensive monitoring strategies.",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Infrastructure as Code (IaC) is essential for modern cloud deployments. Discover how to implement robust, scalable, and maintainable infrastructure using industry best practices.",
          },
        ],
      },
    ],
    publishedAt: "2024-12-05T00:00:00Z",
    readTime: "10 min read",
    category: "DevOps",
    tags: ["DevOps", "Terraform", "AWS", "CI/CD"],
    featured: false,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center",
    author: {
      name: "Arif Rahim",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
  },
  {
    _id: "4",
    _updatedAt: "2024-11-28T00:00:00Z",
    title: "Modern React Development Patterns",
    slug: "modern-react-development-patterns",
    excerpt:
      "Explore advanced React patterns, hooks, and performance optimization techniques for building scalable applications.",
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "React continues to evolve with new patterns and best practices. This guide covers the latest development patterns, custom hooks, and performance optimization strategies.",
          },
        ],
      },
    ],
    publishedAt: "2024-11-28T00:00:00Z",
    readTime: "15 min read",
    category: "Frontend",
    tags: ["React", "TypeScript", "Performance", "Hooks"],
    featured: false,
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&crop=center",
    author: {
      name: "Arif Rahim",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
  },
];
