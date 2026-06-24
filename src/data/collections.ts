export type PriceType = 'fixed' | 'by-weight' | 'enquire';
export type MaterialType = 'silver' | 'stone-set' | 'bullion';

export interface CollectionItem {
  id: string;
  name: string;
  collection: string;
  material: MaterialType;
  images: string[];
  priceType: PriceType;
  price?: number; // Only for 'fixed'
  weightGrams?: number; // Only for 'by-weight'
  makingPremium?: number; // Added to bullion computed price
  feature?: boolean;
}

export interface CollectionConfig {
  slug: string;
  eyebrow: string;
  title: string;
  standfirst: string;
  gridType: 'sparse' | 'utilitarian';
  image: string;
  darkGround: boolean;
}

/**
 * Returns the live spot rate of silver per gram.
 * TODO: Hook this into your live bullion API.
 */
export const getLiveSilverRate = (): number => {
  return 92.5; // Mock static rate: ₹92.5/g
};

export const COLLECTIONS_CONFIG: Record<string, CollectionConfig> = {
  'idols': {
    slug: 'idols',
    eyebrow: 'Divine Idols',
    title: 'Forms of the Divine',
    standfirst: 'A curated selection of silver idols, crafted with reverence and designed to be handed down through generations.',
    gridType: 'sparse',
    image: '/assets/silver-ganesha.png',
    darkGround: true,
  },
  'auspicious-animals': {
    slug: 'auspicious-animals',
    eyebrow: 'Auspicious Animals',
    title: 'Symbols of Prosperity',
    standfirst: 'Elephants, lions, and peacocks rendered in solid silver. Objects of significance for the home.',
    gridType: 'sparse',
    image: '/assets/silver-elephant.png',
    darkGround: true,
  },
  'coins-and-bars': {
    slug: 'coins-and-bars',
    eyebrow: 'Investment & Gifting',
    title: 'Coins & Bars',
    standfirst: 'Pure silver bullion crafted to the highest assay standards. Available in classic and contemporary forms.',
    gridType: 'utilitarian',
    image: '/assets/logo.png',
    darkGround: true,
  },
  'frames': {
    slug: 'frames',
    eyebrow: 'Stone-Set Frames',
    title: 'Marble & Silver',
    standfirst: 'Semi-precious stone and marble frames, elevated by heavy silver mounts. A dignified setting for your memories.',
    gridType: 'sparse',
    image: '/assets/marble-photoframe.png',
    darkGround: false,
  }
};

export const MOCK_COLLECTION_ITEMS: CollectionItem[] = [
  // Idols
  {
    id: 'idol-1',
    name: 'The Seated Ganesha',
    collection: 'idols',
    material: 'silver',
    images: ['/assets/silver-ganesha.png', '/assets/silver-ganesha-2.png'],
    priceType: 'enquire',
    feature: true,
  },
  {
    id: 'idol-2',
    name: 'Standing Lakshmi',
    collection: 'idols',
    material: 'silver',
    images: ['/assets/idolize.png'],
    priceType: 'fixed',
    price: 45000,
  },
  {
    id: 'idol-3',
    name: 'Minimal Ganesha',
    collection: 'idols',
    material: 'silver',
    images: ['/assets/silver-ganesha-2.png'],
    priceType: 'fixed',
    price: 32000,
  },
  
  // Auspicious Animals
  {
    id: 'anim-1',
    name: 'The Royal Elephant',
    collection: 'auspicious-animals',
    material: 'silver',
    images: ['/assets/silver-elephant.png'],
    priceType: 'enquire',
    feature: true,
  },
  
  // Frames
  {
    id: 'frame-1',
    name: 'Verde Marble Frame',
    collection: 'frames',
    material: 'stone-set',
    images: ['/assets/marble-photoframe.png'],
    priceType: 'fixed',
    price: 18500,
  },
  {
    id: 'frame-2',
    name: 'Bianco Classic Frame',
    collection: 'frames',
    material: 'stone-set',
    images: ['/assets/white-and-yellow.png'],
    priceType: 'fixed',
    price: 16000,
  },

  // Coins & Bars
  {
    id: 'bullion-1',
    name: '100g Minted Bar',
    collection: 'coins-and-bars',
    material: 'bullion',
    images: ['/assets/logo.png'], // Placeholder
    priceType: 'by-weight',
    weightGrams: 100,
    makingPremium: 500,
  },
  {
    id: 'bullion-2',
    name: '50g Minted Bar',
    collection: 'coins-and-bars',
    material: 'bullion',
    images: ['/assets/logo.png'],
    priceType: 'by-weight',
    weightGrams: 50,
    makingPremium: 300,
  },
  {
    id: 'bullion-3',
    name: '250g Cast Bar',
    collection: 'coins-and-bars',
    material: 'bullion',
    images: ['/assets/logo.png'],
    priceType: 'by-weight',
    weightGrams: 250,
    makingPremium: 800,
  },
  {
    id: 'bullion-4',
    name: '10g Ganesha Coin',
    collection: 'coins-and-bars',
    material: 'bullion',
    images: ['/assets/silver-ganesha.png'],
    priceType: 'by-weight',
    weightGrams: 10,
    makingPremium: 200,
  }
];

export async function getCollectionItems(collectionSlug: string): Promise<CollectionItem[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_COLLECTION_ITEMS.filter(item => item.collection === collectionSlug);
}
