

export enum Studio {
  RealEstate = 'Real Estate',
  Fashion = 'Fashion',
  Restaurant = 'Restaurant',
  Beauty = 'Beauty',
}

export interface GeneratedImage {
  id: string;
  created_at: string;
  user_id: string;
  image_url: string;
  prompt: string;
  style: string;
  studio: Studio;
}