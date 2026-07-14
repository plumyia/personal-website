export interface ProjectCard {
  slug: string;
  name: string;
  brand: string;
  date: string;
  tags: string[];
  summary: string;
  cover: string;
  metrics: { label: string; value: string }[];
}

export interface ProjectDetailTheme {
  /** Hero image object-position — "object-top" (crop bottom) or "object-bottom" (crop top) */
  heroObjectPosition?: string;
  /** Hero image CSS filter — e.g. "brightness(1.15) saturate(1.1)" */
  heroFilter?: string;
  /** Hero section overlay gradient midpoint color */
  heroGradientVia?: string;
  /** Hero section overlay gradient endpoint color */
  heroGradientTo?: string;
  /** Content section gradient start color */
  contentGradientStart?: string;
  /** Content section gradient midpoint color */
  contentGradientMid?: string;
}

export interface ProjectDetail extends ProjectCard {
  subtitle?: string;
  hero: string;
  description: string;
  role: string;
  gallery: string[];
  videos?: string[];
  videoCaptions?: string[];
  /** Per-project video max-width (Tailwind class or arbitrary value). Default "100%". */
  videoMaxWidth?: string;
  /** Per-project max-width for the entire video section grid. Default "100%". */
  videoSectionMaxWidth?: string;
  kvImage?: string;
  routeMap?: boolean;
  /** Phone-framed video + review image (pet-party / bangkok-festival style) */
  phoneReview?: {
    video: string;
    reviewImage: string;
    phoneFrame: string;
  };
  /** Show gallery in the video/kv slot instead of at the bottom */
  galleryFirst?: boolean;
  theme?: ProjectDetailTheme;
}

export interface Capability {
  title: string;
  titleEN: string;
  description: string;
}

export interface LanguageSkill {
  name: string;
  nameCN: string;
  level: string;
}

export interface BrandLogo {
  name: string;
  file: string;
  slug: string;
  /** Tailwind height class for the logo on the /brands page. Default "h-12". */
  height?: string;
  /** Tailwind height class for the logo on the homepage carousel. Default "h-12". */
  carouselHeight?: string;
  /** Extra Tailwind classes for the logo <img>, e.g. "mt-2" to push it down. */
  logoClass?: string;
  /** Whether a {slug}-detail0.jpg exists to stack above the main detail image. */
  hasDetail0?: boolean;
  /** Optional subtitle shown below the brand name in the lightbox. */
  subtitle?: string;
}

export interface HeroData {
  name: string;
  taglines: { zh: string; en: string }[];
}

export interface AboutData {
  capabilities: Capability[];
  styles: string[];
  stylesEN: string[];
  languages: LanguageSkill[];
}

export interface ContactData {
  email: string;
  wechat: string;
  location: string;
  locationEN: string;
  directions: string[];
  directionsEN: string[];
}
