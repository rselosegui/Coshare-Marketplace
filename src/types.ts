export interface AssetListing {
  id: string;
  title: string;
  image: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  subtitle: string;
  pricePerMonth: number; // AED
  totalSlots: number;
  availableSlots: number;
  isFeatured: boolean;
  type: 'dealer' | 'user';
  visibility: 'public' | 'private';
  category: string;
  location?: string;
  goal?: string;
  goals?: string[];
  isVerified?: boolean;
  totalValue?: number; // Total asset value in AED
  coOwnersCount?: number;
  agent?: {
    name: string;
    avatar: string;
    isVerified: boolean;
    rating: number;
  };
  specifications?: Record<string, string>;
  extras?: { title: string, price: string }[];
}

export interface Offer {
  price: number;
  startDate?: string;
  duration?: number; // in months
  shares?: number;
  type?: 'co-own' | 'share' | 'swap';
  status: 'pending' | 'accepted' | 'countered' | 'declined';
}

export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: string;
  type: 'text' | 'offer';
  offer?: Offer;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participantId?: string;
  listingTitle?: string;
  messages: Message[];
}

export type ViewMode = 'marketplace' | 'list-asset' | 'community' | 'hub-asset' | 'messages' | 'saved' | 'profile' | 'notifications' | 'handover';
export type EntityType = 'individual' | 'business';
export type ListingGoal = 'Co-own' | 'Share' | 'Swap' | 'All';
export type NavPreference = 'messages' | 'saved';

export interface ListingForm {
  entityType: EntityType;
  category: string;
  subcategory: string;
  name: string;
  description: string;
  location: string;
  specifications: Record<string, string>;
  askingPrice?: string;
  annualOperatingCosts?: string;
  totalFractions?: number;
  maintenanceAllocation?: 'proportional' | 'equal';
  usageRules?: 'booking-system' | 'fixed-schedule';
  goal?: ListingGoal;
  goals: ListingGoal[];
  isVerified: boolean;
  visibility: 'public' | 'private';
}

export interface FilterState {
  location: string;
  minPrice: string;
  maxPrice: string;
  goals: ListingGoal[];
  verifiedOnly: boolean;
  minRating: number;
  conditions?: string[];
  minSlotsAvailable?: number;
}
