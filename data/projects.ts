import type { Project } from "@/types/data";

export const projectsData: Project[] = [
  {
    _id: "1",
    _updatedAt: "2024-01-01T00:00:00Z",
    name: "High-Performance Trading System",
    slug: "trading-system",
    tagline:
      "Low-latency trading engine built with C++ and optimized algorithms",
    description: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "A high-frequency trading system designed for minimal latency and maximum throughput, handling thousands of transactions per second.",
          },
        ],
      },
    ],
    features: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Real-time market data processing, order matching engine, risk management, multi-threaded architecture",
          },
        ],
      },
    ],
    development: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Built using C++17, custom memory allocators, lock-free data structures, and optimized for NUMA architecture",
          },
        ],
      },
    ],
    status: "live" as const,
    githubURL: "https://github.com/arifrahim/trading-system",
    liveURL: null,
    tags: ["C++", "Low Latency", "Financial Systems", "Multi-threading"],
    languages: [
      { language: "C++", percent: 85 },
      { language: "Python", percent: 10 },
      { language: "Shell", percent: 5 },
    ],
    stack: [
      {
        title: "C++",
        icon: { asset: { url: "/icons/cpp.svg" } },
      },
      {
        title: "Linux",
        icon: { asset: { url: "/icons/linux.svg" } },
      },
    ],
    screenshots: [
      { url: "/projects/trading-1.jpg" },
      { url: "/projects/trading-2.jpg" },
    ],
  },
  {
    _id: "2",
    _updatedAt: "2024-01-02T00:00:00Z",
    name: "Enterprise Microservices Platform",
    slug: "microservices-platform",
    tagline: "Scalable Java-based microservices with Kubernetes orchestration",
    description: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "A comprehensive microservices platform for enterprise applications, featuring service discovery, load balancing, and distributed tracing.",
          },
        ],
      },
    ],
    features: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Service mesh architecture, API gateway, distributed caching, event-driven communication, monitoring and observability",
          },
        ],
      },
    ],
    development: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Developed with Java Spring Boot, deployed on Kubernetes, using Redis for caching and PostgreSQL for persistence",
          },
        ],
      },
    ],
    status: "live" as const,
    githubURL: "https://github.com/arifrahim/microservices-platform",
    liveURL: "https://enterprise-platform.example.com",
    tags: ["Java", "Spring Boot", "Kubernetes", "Microservices"],
    languages: [
      { language: "Java", percent: 70 },
      { language: "YAML", percent: 15 },
      { language: "Shell", percent: 10 },
      { language: "Dockerfile", percent: 5 },
    ],
    stack: [
      {
        title: "Java",
        icon: { asset: { url: "/icons/java.svg" } },
      },
      {
        title: "Kubernetes",
        icon: { asset: { url: "/icons/kubernetes.svg" } },
      },
      {
        title: "Docker",
        icon: { asset: { url: "/icons/docker.svg" } },
      },
    ],
    screenshots: [
      { url: "/projects/microservices-1.jpg" },
      { url: "/projects/microservices-2.jpg" },
    ],
  },
  {
    _id: "3",
    _updatedAt: "2024-01-03T00:00:00Z",
    name: "Cloud Infrastructure Automation",
    slug: "cloud-automation",
    tagline:
      "Infrastructure as Code with Terraform and automated CI/CD pipelines",
    description: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Complete cloud infrastructure automation solution with Infrastructure as Code, automated deployments, and comprehensive monitoring.",
          },
        ],
      },
    ],
    features: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Multi-cloud deployment, auto-scaling, disaster recovery, security compliance, cost optimization",
          },
        ],
      },
    ],
    development: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Built using Terraform, Jenkins, Ansible, and deployed across AWS and Azure with comprehensive monitoring via Prometheus and Grafana",
          },
        ],
      },
    ],
    status: "live" as const,
    githubURL: "https://github.com/arifrahim/cloud-automation",
    liveURL: null,
    tags: ["DevOps", "Terraform", "AWS", "Jenkins", "Ansible"],
    languages: [
      { language: "HCL", percent: 40 },
      { language: "Python", percent: 30 },
      { language: "Shell", percent: 20 },
      { language: "YAML", percent: 10 },
    ],
    stack: [
      {
        title: "AWS",
        icon: { asset: { url: "/icons/aws.svg" } },
      },
      {
        title: "Jenkins",
        icon: { asset: { url: "/icons/jenkins.svg" } },
      },
      {
        title: "Docker",
        icon: { asset: { url: "/icons/docker.svg" } },
      },
    ],
    screenshots: [
      { url: "/projects/cloud-1.jpg" },
      { url: "/projects/cloud-2.jpg" },
    ],
  },
];
