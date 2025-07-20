export interface BasePoem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  copyright: string;
  category: string;
  audioUrl?: string;
}

export type PoemCategory = 'friends' | 'family' | 'faith';