export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  about: string;
  location: string;
  email: string;
  resumeURL: string;
  photo: {
    url: string;
    label: string;
    alt: string;
  };
  socials: {
    linkedin?: string;
    github?: string;
    email?: string;
    facebook?: string;
    twitter?: string;
  };
  metrics: Array<{
    label: string;
    value: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
}

export interface Project {
  _id: string;
  _updatedAt: string;
  name: string;
  slug: string;
  tagline: string;
  description?: Array<{
    _type: string;
    children: Array<{
      _type: string;
      text: string;
    }>;
  }>;
  features?: Array<{
    _type: string;
    children: Array<{
      _type: string;
      text: string;
    }>;
  }>;
  development?: Array<{
    _type: string;
    children: Array<{
      _type: string;
      text: string;
    }>;
  }>;
  status: "live" | "archived" | "development";
  githubURL?: string;
  liveURL?: string | null;
  tags?: string[];
  languages?: Array<{
    language: string;
    percent: number;
  }>;
  stack?: Array<{
    title: string;
    icon: {
      asset: {
        url: string;
      };
    };
  }>;
  screenshots?: Array<{
    url: string;
  }>;
}

// API Response interfaces
export interface ProjectApiResponse {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  categoryId: unknown;
  images: string[];
  thumbnailImage: string;
  technologies: string[];
  features: string[];
  liveUrl: string;
  sourceCodeUrl: string;
  demoUrl: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  likes: number;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface Technology {
  title: string;
  icon: {
    asset: {
      url: string;
    };
  };
}

export interface Blog {
  _id: string;
  title: string;
  content?: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  isFeatured: boolean;
  images: string[];
  sourceCode?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  // Legacy fields for backward compatibility
  _updatedAt?: string;
  slug?: string;
  publishedAt?: string;
  readTime?: string;
  featured?: boolean;
  image?: string;
}
