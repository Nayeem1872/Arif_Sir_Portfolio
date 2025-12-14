export interface Skill {
  name: string;
  rating: number;
}

export interface CVShowcase {
  _id: string;
  title: string;
  content: string;
  quote?: string;
  skills: Skill[];
  attachments: string[];
  cv_url?: string;
  category: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: "success" | "error";
  message: string;
}

export interface Attachment {
  type: "file" | "url";
  value: File | string;
  name: string;
}
