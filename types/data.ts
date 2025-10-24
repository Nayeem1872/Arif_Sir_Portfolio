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
    bluesky?: string;
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
  _updatedAt: string;
  title: string;
  slug: string;
  excerpt: string;
  content: Array<{
    _type: string;
    children: Array<{
      _type: string;
      text: string;
    }>;
  }>;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
}
