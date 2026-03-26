// Shared TypeScript type definitions for AREV Lights

export interface CloudinaryMedia {
  url: string;
  publicId: string;
}

export interface ProductImage extends CloudinaryMedia {
  isPrimary: boolean;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image: CloudinaryMedia;
  description?: string;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IBrand {
  _id: string;
  name: string;
  logo: CloudinaryMedia;
  websiteUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface IBrochure {
  _id: string;
  title: string;
  category?: ICategory;
  pdfUrl?: string;
  pdfPublicId?: string;
  previewImage: CloudinaryMedia;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  images: ProductImage[];
  category: ICategory;
  brand?: IBrand;
  specs: ProductSpec[];
  tags: string[];
  brochure?: IBrochure;
  isFeatured: boolean;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProject {
  _id: string;
  title: string;
  description: string;
  location?: string;
  completionDate?: string;
  images: CloudinaryMedia[];
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface ITestimonial {
  _id: string;
  clientName: string;
  designation?: string;
  company?: string;
  reviewText: string;
  image?: CloudinaryMedia;
  rating: number;
  isVisible: boolean;
  sortOrder: number;
}

export interface IInquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  type: "general" | "dealer" | "product";
  productRef?: { _id: string; title: string; slug: string };
  status: "new" | "contacted" | "converted";
  city?: string;
  state?: string;
  businessType?: string;
  createdAt: string;
}

export interface ISiteSettings {
  _id: string;
  address: string;
  phones: string[];
  emails: string[];
  whatsappNumber: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };
  mapEmbedUrl?: string;
  footerTagline?: string;
  showNavbar?: boolean;
  showWhyArev?: boolean;
  showProjects?: boolean;
}

export interface ISeoMetadata {
  _id: string;
  pageKey: string;
  pageLabel: string;
  title: string;
  description: string;
  ogImage?: CloudinaryMedia;
  canonical?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationInfo;
}
