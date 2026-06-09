const fs = require('fs');

const dataFile = 'src/data.ts';
let content = fs.readFileSync(dataFile, 'utf-8');

const newItems = `
  {
    id: '15',
    title: 'Harley Davidson Iron 883',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600&auto=format&fit=crop'
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
    image: 'https://images.unsplash.com/photo-1504280390267-3312c8230b42?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1504280390267-3312c8230b42?q=80&w=600&auto=format&fit=crop'
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
  },
  {
    id: '17',
    title: 'Mini Cooper JCW 2024',
    image: 'https://images.unsplash.com/photo-1555546221-5a044b2afc0d?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1555546221-5a044b2afc0d?q=80&w=600&auto=format&fit=crop'
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
    id: '18',
    title: 'Toyota Prado 2025',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop'
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
    id: '19',
    title: 'Pro Kite Surf Kit',
    image: 'https://images.unsplash.com/photo-1544605581-22444b0593b4?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544605581-22444b0593b4?q=80&w=600&auto=format&fit=crop'
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
    id: '20',
    title: 'Ocean Kayak',
    image: 'https://images.unsplash.com/photo-1502575298075-8bd2870192e2?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1502575298075-8bd2870192e2?q=80&w=600&auto=format&fit=crop'
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
  },`;

// Append inside mockListings array
const idx = content.indexOf('export const mockListings: AssetListing[] = [');
if (idx !== -1) {
    const insertIdx = content.indexOf('[', idx) + 1;
    content = content.slice(0, insertIdx) + newItems + content.slice(insertIdx);
    fs.writeFileSync(dataFile, content);
    console.log('Added new assets to mockListings');
} else {
    console.log('Could not find mockListings');
}

