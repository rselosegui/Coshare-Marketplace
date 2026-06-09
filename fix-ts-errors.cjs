const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add useRef
if (content.includes("import React, { useState, useEffect }")) {
  content = content.replace("import React, { useState, useEffect }", "import React, { useState, useEffect, useRef }");
} else if (content.includes("import { useState, useEffect }")) {
  content = content.replace("import { useState, useEffect }", "import { useState, useEffect, useRef }");
}

// 2. Add PenTool to lucide-react imports
if (!content.includes("PenTool")) {  
  content = content.replace("import {", "import { PenTool,");
}

// 3. Add participantId to Conversation
content = content.replace(
  `interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  listingTitle: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
}`,
  `interface Conversation {
  id: string;
  participantId?: string;
  participantName: string;
  participantAvatar: string;
  listingTitle: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
}`
);

// 4. Add location to AssetListing
content = content.replace(
  `interface AssetListing {
  id: string;
  title: string;
  subtitle: string;
  pricePerMonth: number;
  totalValue?: number;
  availableSlots?: number;
  totalSlots?: number;
  category: string;
  subcategory?: string;
  goal: ListingGoal;
  isVerified: boolean;
  image: string;
  images?: string[];
  specs?: { label: string, value: string }[];
  agent?: { name: string, rating: number };
}`,
  `interface AssetListing {
  id: string;
  title: string;
  subtitle: string;
  pricePerMonth: number;
  totalValue?: number;
  availableSlots?: number;
  totalSlots?: number;
  category: string;
  subcategory?: string;
  goal: ListingGoal;
  location?: string;
  isVerified: boolean;
  image: string;
  images?: string[];
  specs?: { label: string, value: string }[];
  agent?: { name: string, rating: number };
}`
);

fs.writeFileSync('src/App.tsx', content);
console.log('Fixed typescript errors');
