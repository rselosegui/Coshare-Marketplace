import { AssetListing } from './types';
import regeneratedImage from './assets/images/regenerated_image_1778928072560.jpg';
import regeneratedImage0 from './assets/images/regenerated_image_1778928315786.jpg';
import regeneratedImage1 from './assets/images/regenerated_image_1779086714836.png';
import regeneratedImage4 from './assets/images/regenerated_image_1778928314864.png';
import regeneratedImage5 from './assets/images/regenerated_image_1778928314137.jpg';
import regeneratedImage6 from './assets/images/regenerated_image_1778928313065.jpg';
import regeneratedImage8 from './assets/images/regenerated_image_1778928317106.jpg';
import regeneratedImage3 from './assets/images/regenerated_image_1779029790204.jpg';
import regeneratedImage7 from './assets/images/regenerated_image_1779029791192.jpg';
import regeneratedImage9 from './assets/images/regenerated_image_1779079916346.jpg';
import regeneratedImage10 from './assets/images/regenerated_image_1779079917912.jpg';
import regeneratedImage11 from './assets/images/regenerated_image_1779080022773.jpg';

import regeneratedImage12 from './assets/images/regenerated_image_1779080151171.jpg';
import regeneratedImage13 from './assets/images/regenerated_image_1779080248355.jpg';
import regeneratedImage14 from './assets/images/regenerated_image_1779082153441.jpg';

export const mockListings: AssetListing[] = [
  {
    id: '99',
    title: 'Aston Martin DB11',
    image: 'https://images.unsplash.com/photo-1603463999905-2d93e115c544?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1603463999905-2d93e115c544?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 5.0,
    reviewCount: 3,
    subtitle: 'Private group',
    pricePerMonth: 21000,
    totalSlots: 4,
    availableSlots: 0,
    isFeatured: false,
    type: 'user',
    visibility: 'private',
    category: 'Cars',
    goal: 'Co-own',
    isVerified: true,
    totalValue: 850000,
    coOwnersCount: 4,
    agent: { name: 'James B.', avatar: 'https://i.pravatar.cc/150?u=james', isVerified: true, rating: 5.0 },
    specifications: {
      'Condition': 'New',
      'Mileage': '1,500 km',
      'Fuel Type': 'Petrol',
      'Specs': 'GCC Specs'
    }
  },
  {
    id: '1',
    title: 'Porsche 911 Carrera S',
    image: regeneratedImage,
    images: [
      regeneratedImage,
      'https://images.unsplash.com/photo-1503376712344-652d2f1f51ee?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-775f00546cb2?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 34,
    subtitle: 'Invite cosharers to join',
    pricePerMonth: 12500,
    totalSlots: 4,
    availableSlots: 2,
    isFeatured: false,
    type: 'user',
    visibility: 'public',
    category: 'Cars',
    goal: 'Co-own',
    isVerified: true,
    totalValue: 650000,
    coOwnersCount: 2,
    agent: { name: 'Marcus V.', avatar: 'https://i.pravatar.cc/150?u=marcus', isVerified: true, rating: 4.9 },
    specifications: {
      'Condition': 'Pre-owned',
      'Mileage': '12,500 km',
      'Fuel Type': 'Petrol',
      'Specs': 'GCC Specs',
      'Transmission': 'PDK'
    },
    extras: [
      { title: 'Chauffeur / Driver', price: 'AED 500/day' },
      { title: 'Premium Insurance', price: 'AED 200/day' }
    ]
  },
  {
    id: '2',
    title: 'Ducati Panigale V4',
    image: regeneratedImage1,
    images: [
      regeneratedImage1,
      'https://images.unsplash.com/photo-1581232777983-500693540da0?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 21,
    subtitle: 'Co-own this machine!',
    pricePerMonth: 7500,
    totalSlots: 2,
    availableSlots: 1,
    isFeatured: true,
    type: 'dealer',
    visibility: 'public',
    category: 'Bikes',
    goal: 'Co-own',
    isVerified: true,
    totalValue: 120000,
    coOwnersCount: 1,
    agent: { name: 'Ducati Dubai', avatar: 'https://i.pravatar.cc/150?u=ducati', isVerified: true, rating: 4.7 }
  },
  {
    id: '10',
    title: 'Hanse 458 Sailing Yacht',
    image: regeneratedImage8,
    images: [
      regeneratedImage8,
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 14,
    subtitle: 'Performance sailing redefined',
    pricePerMonth: 15000,
    totalSlots: 8,
    availableSlots: 4,
    isFeatured: false,
    type: 'dealer',
    visibility: 'public',
    category: 'Boats',
    goal: 'Co-own',
    totalValue: 1200000,
    extras: [
      { title: 'Captain / Skipper', price: 'AED 800/day' },
      { title: 'Catering Package', price: 'AED 450' }
    ]
  },
  {
    id: '4',
    title: 'Rolex Submariner Date',
    image: regeneratedImage3,
    images: [
      regeneratedImage3,
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 26,
    subtitle: 'Timeless value, shared',
    pricePerMonth: 5000,
    totalSlots: 5,
    availableSlots: 2,
    isFeatured: true,
    type: 'user',
    visibility: 'public',
    category: 'Luxury Watches',
    goal: 'Swap',
    totalValue: 65000
  },
  {
    id: '5',
    title: 'Vespa PX 150',
    image: regeneratedImage4,
    images: [
      regeneratedImage4,
      'https://images.unsplash.com/photo-1534067783941-51c9c23eceab?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 18,
    subtitle: 'Classic Italian style',
    pricePerMonth: 800,
    totalSlots: 2,
    availableSlots: 1,
    isFeatured: false,
    type: 'user',
    visibility: 'public',
    category: 'Bikes',
    goal: 'Share',
    totalValue: 15000
  },
  {
    id: '6',
    title: 'E-Foil Hydrofoil',
    image: regeneratedImage5,
    images: [
      regeneratedImage5,
      'https://images.unsplash.com/photo-1627344588523-a5ff9509df63?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 12,
    subtitle: 'Fly above the water',
    pricePerMonth: 1200,
    totalSlots: 3,
    availableSlots: 2,
    isFeatured: false,
    type: 'user',
    visibility: 'public',
    category: 'Others',
    goal: 'Share',
    totalValue: 25000
  },
  {
    id: '7',
    title: 'Kawasaki Jet Ski Ultra 310LX',
    image: regeneratedImage6,
    images: [
      regeneratedImage6,
      'https://images.unsplash.com/photo-1593361868516-ec84e03fcccb?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 45,
    subtitle: 'The ultimate watercraft experience',
    pricePerMonth: 2500,
    totalSlots: 4,
    availableSlots: 1,
    isFeatured: true,
    type: 'dealer',
    visibility: 'public',
    category: 'Boats',
    goal: 'Co-own',
    totalValue: 70000
  },
  {
    id: '8',
    title: 'Audi R8 V10 Performance',
    image: regeneratedImage7,
    images: [
      regeneratedImage7,
      'https://images.unsplash.com/photo-1603463999905-2d93e115c544?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 5.0,
    reviewCount: 9,
    subtitle: 'Everyday supercar',
    pricePerMonth: 18000,
    totalSlots: 4,
    availableSlots: 3,
    isFeatured: true,
    type: 'dealer',
    visibility: 'public',
    category: 'Cars',
    goal: 'Co-own',
    totalValue: 850000
  },
  {
    id: '19',
    title: 'Pro Kite Surf Kit',
    image: regeneratedImage10,
    images: [
      regeneratedImage10,
    ],
    rating: 4.6,
    reviewCount: 9,
    subtitle: 'Ride the wind',
    pricePerMonth: 1200,
    totalSlots: 3,
    availableSlots: 1,
    isFeatured: false,
    type: 'user',
    visibility: 'public',
    category: 'Others',
    goal: 'Share',
    isVerified: false,
    totalValue: 8000,
    coOwnersCount: 2,
    agent: { name: 'Kite Hub', avatar: 'https://i.pravatar.cc/150?u=kite', isVerified: false, rating: 4.5 },
    specifications: {
      'Brand': 'Duotone',
      'Includes': 'Kite, Board, Harness',
      'Condition': 'Excellent'
    }
  },
  {
    id: '18',
    title: 'Toyota Prado 2025',
    image: regeneratedImage9,
    images: [
      regeneratedImage9,
    ],
    rating: 5.0,
    reviewCount: 2,
    subtitle: 'The Ultimate SUV',
    pricePerMonth: 9500,
    totalSlots: 4,
    availableSlots: 2,
    isFeatured: true,
    type: 'dealer',
    visibility: 'public',
    category: 'Cars',
    goal: 'Co-own',
    isVerified: true,
    totalValue: 280000,
    coOwnersCount: 2,
    agent: { name: 'Al Futtaim', avatar: 'https://i.pravatar.cc/150?u=toyota', isVerified: true, rating: 4.9 },
    specifications: {
      'Condition': 'New',
      'Type': 'SUV',
      'Year': '2025',
      'Specs': 'GCC Specs'
    }
  },
  {
    id: '9',
    title: 'Boston Whaler 270 Dauntless',
    image: regeneratedImage0,
    images: [
      regeneratedImage0,
      'https://images.unsplash.com/photo-1565293220455-d6e81f1d1d8a?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 52,
    subtitle: 'Versatile family boat',
    pricePerMonth: 8500,
    totalSlots: 6,
    availableSlots: 2,
    isFeatured: false,
    type: 'user',
    visibility: 'public',
    category: 'Boats',
    goal: 'Co-own',
    totalValue: 350000
  },
  {
    id: '20',
    title: 'Ocean Kayak',
    image: regeneratedImage11,
    images: [
      regeneratedImage11,
    ],
    rating: 4.8,
    reviewCount: 25,
    subtitle: 'Explore the waters',
    pricePerMonth: 400,
    totalSlots: 4,
    availableSlots: 2,
    isFeatured: false,
    type: 'user',
    visibility: 'public',
    category: 'Boats',
    goal: 'Share',
    isVerified: true,
    totalValue: 3500,
    coOwnersCount: 2,
    agent: { name: 'River Flow', avatar: 'https://i.pravatar.cc/150?u=river', isVerified: true, rating: 4.9 },
    specifications: {
      'Type': 'Single',
      'Material': 'Polyethylene',
      'Condition': 'Good'
    }
  },
  {
    id: '17',
    title: 'Mini Cooper JCW 2024',
    image: regeneratedImage12,
    images: [
      regeneratedImage12
    ],
    rating: 4.7,
    reviewCount: 8,
    subtitle: 'Convertible Thrills',
    pricePerMonth: 6500,
    totalSlots: 4,
    availableSlots: 4,
    isFeatured: true,
    type: 'dealer',
    visibility: 'public',
    category: 'Cars',
    goal: 'Co-own',
    isVerified: true,
    totalValue: 220000,
    coOwnersCount: 0,
    agent: { name: 'Mini Dubai', avatar: 'https://i.pravatar.cc/150?u=mini', isVerified: true, rating: 4.8 },
    specifications: {
      'Condition': 'New',
      'Body': 'Convertible',
      'Year': '2024',
      'Specs': 'GCC Specs'
    }
  },
  {
    id: '3',
    title: 'Azimut 50 Flybridge',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 14,
    subtitle: 'Share the ocean experience',
    pricePerMonth: 15000,
    totalSlots: 8,
    availableSlots: 4,
    isFeatured: false,
    type: 'dealer',
    visibility: 'public',
    category: 'Boats',
    goal: 'Co-own',
    totalValue: 1200000
  },
  {
    id: '15',
    title: 'Harley Davidson Iron 883',
    image: regeneratedImage14,
    images: [
      regeneratedImage14
    ],
    rating: 4.8,
    reviewCount: 42,
    subtitle: 'Classic American Muscle',
    pricePerMonth: 3500,
    totalSlots: 4,
    availableSlots: 2,
    isFeatured: true,
    type: 'user',
    visibility: 'public',
    category: 'Bikes',
    goal: 'Share',
    isVerified: true,
    totalValue: 55000,
    coOwnersCount: 2,
    agent: { name: 'Mike D.', avatar: 'https://i.pravatar.cc/150?u=mike', isVerified: true, rating: 4.9 },
    specifications: {
      'Condition': 'Pre-owned',
      'Mileage': '5,000 km',
      'Type': 'Cruiser',
      'Year': '2022'
    }
  },
  {
    id: '16',
    title: 'Premium Camping Kit',
    image: regeneratedImage13,
    images: [
      regeneratedImage13
    ],
    rating: 4.9,
    reviewCount: 15,
    subtitle: 'Complete set for 4 people',
    pricePerMonth: 800,
    totalSlots: 5,
    availableSlots: 3,
    isFeatured: false,
    type: 'user',
    visibility: 'public',
    category: 'Others',
    goal: 'Share',
    isVerified: true,
    totalValue: 4000,
    coOwnersCount: 2,
    agent: { name: 'Outdoor Pros', avatar: 'https://i.pravatar.cc/150?u=outdoor', isVerified: true, rating: 5.0 },
    specifications: {
      'Capacity': '4 Persons',
      'Includes': 'Tent, Stove, Chairs',
      'Season': '3-Season'
    }
  }
];

export const categories = [
  { id: '0', name: 'All', icon: 'LayoutGrid', subcategories: ['Featured', 'Trending', 'New', 'Ending Soon', 'Most Shared', 'Verified Only', 'High Equity'] },
  { id: '1', name: 'Cars', icon: 'CarFront', subcategories: ['Supercars', '4x4s', 'Classics', 'Sports', 'SUV', 'EVs (Electric)', 'Vans', 'Commercial', 'Others'] },
  { id: '2', name: 'Bikes', icon: 'Bike', subcategories: ['Superbikes', 'Sportbikes', 'Cruisers', 'Off-road', 'Scooters', 'Others'] },
  { id: '3', name: 'Boats', icon: 'Sailboat', subcategories: ['Jet Skis', 'Speedboats', 'Catamaran', 'Sailing', 'Yachts', 'Fishing', 'Others'] },
  { id: '4', name: 'Real Estate', icon: 'Home', subcategories: ['Holiday Homes', 'Villas', 'Townhouses', 'Apartments', 'Offices', 'Coworking', 'Others'] },
  { id: '5', name: 'Luxury Watches', icon: 'Watch', subcategories: ['Luxury', 'Sport', 'Vintage', 'Limited Edition', 'Dress Watch', 'Chronograph', 'Dive Watch'] },
  { id: '6', name: 'Luxury Fashion', icon: 'ShoppingBag', subcategories: ['Handbag', 'Tote', 'Clutch', 'Backpack', 'Vintage Piece', 'Limited Release', 'Jewelry'] },
  { id: '7', name: 'Others', icon: 'Shapes', subcategories: ['Equipment', 'Art', 'Collectibles', 'Electronics', 'Musical Instruments', 'Fitness Gear', 'Tech Gadgets'] },
];

export const mockConversations: any[] = [
  {
    id: '1',
    participantName: 'Porsche Co-owners',
    participantAvatar: regeneratedImage,
    isGroup: true,
    groupMembers: ['Sarah Jenkins', 'Marco Rossi', 'Me'],
    lastMessage: 'Is the Porsche still available for the weekend of the 24th?',
    lastMessageTime: '12:45 PM',
    unreadCount: 2,
    listingTitle: 'Porsche 911 Carrera S',
    messages: [
      { id: '1', senderId: 'them', senderName: 'Sarah J.', text: 'Hi all! I saw the listing for the Porsche 911.', timestamp: '12:30 PM', type: 'text' },
      { id: '2', senderId: 'them', senderName: 'Marco R.', text: 'Is the Porsche still available for the weekend of the 24th?', timestamp: '12:45 PM', type: 'text' },
      { 
        id: '3', 
        senderId: 'them', 
        senderName: 'Sarah J.',
        text: 'I\'d like to make a formal offer to join the cosharing pool.', 
        timestamp: '1:00 PM', 
        type: 'offer',
        offer: {
          price: 17500,
          type: 'co-own',
          shares: 2,
          status: 'pending'
        }
      }
    ]
  },
  {
    id: '2',
    participantName: 'Marco Rossi',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    lastMessage: 'The contract looks good. I\'ll sign it tonight.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    listingTitle: 'Azimut 50 Flybridge',
    messages: [
      { id: '1', senderId: 'me', text: 'Hey Marco, did you get a chance to look at the cosharing agreement?', timestamp: 'Yesterday', type: 'text' },
      { id: '2', senderId: 'them', text: 'The contract looks good. I\'ll sign it tonight.', timestamp: 'Yesterday', type: 'text' }
    ]
  },
  {
    id: '3',
    participantName: 'Elite Motors',
    participantAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=150&auto=format&fit=crop',
    lastMessage: 'We have a new Audi R8 coming in next week if you\'re interested.',
    lastMessageTime: 'Tuesday',
    unreadCount: 1,
    listingTitle: 'Audi R8 V10 Performance',
    messages: [
      { id: '1', senderId: 'them', text: 'We have a new Audi R8 coming in next week if you\'re interested.', timestamp: 'Tuesday', type: 'text' }
    ]
  },
  {
    id: '4',
    participantName: 'Aston Martin DB11 Co-owners',
    participantAvatar: 'https://images.unsplash.com/photo-1603463999905-2d93e115c544?q=80&w=150&auto=format&fit=crop',
    isGroup: true,
    groupMembers: ['James B.', 'Alex M.', 'Elena V.', 'Me'],
    lastMessage: 'I am taking the car this weekend, just a heads up!',
    lastMessageTime: '3 Days Ago',
    unreadCount: 0,
    listingTitle: 'Aston Martin DB11',
    messages: [
      { id: '1', senderId: 'them', senderName: 'Elena V.', text: 'I am taking the car this weekend, just a heads up!', timestamp: '3 Days Ago', type: 'text' }
    ]
  }
];
