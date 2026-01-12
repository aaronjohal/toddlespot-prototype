import { Venue, Offer } from "@shared/schema";

export const mockVenues: Venue[] = [
  {
    id: 1,
    name: "Cozy Corner Café",
    type: "Café",
    address: "123 Main Street, Islington, London",
    latitude: 51.5362,
    longitude: -0.1033,
    phone: "020-1234-5678",
    website: "https://example.com/cozycorner",
    description: "A family-friendly café with a dedicated quiet space for parents and babies.",
    photos: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&q=80"
    ],
    hours: JSON.stringify({
      "monday-friday": "8:00-18:00",
      "saturday-sunday": "9:00-17:00"
    }),
    changingFacilities: true,
    highChairs: true,
    pramAccess: true,
    quietSpace: true,
    breastfeedingArea: true,
    bottleWarming: true,
    overallRating: 4.8,
    changingFacilitiesRating: 4.0,
    highChairsRating: 5.0,
    pramAccessRating: 4.0,
    staffFriendlinessRating: 5.0,
    noiseLevelRating: 4.0,
    verified: true,
    reviewCount: 24,
    createdAt: new Date()
  },
  {
    id: 2,
    name: "Little Paws Playcentre",
    type: "Play Area",
    address: "45 Child Street, Camden, London",
    latitude: 51.5322,
    longitude: -0.1230,
    phone: "020-8765-4321",
    website: "https://example.com/littlepaws",
    description: "Indoor play area specially designed for babies and toddlers.",
    photos: [
      "https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?w=500&q=80"
    ],
    hours: JSON.stringify({
      "monday-sunday": "10:00-18:00"
    }),
    changingFacilities: true,
    highChairs: true,
    pramAccess: true,
    quietSpace: false,
    breastfeedingArea: true,
    bottleWarming: true,
    overallRating: 4.5,
    changingFacilitiesRating: 4.5,
    highChairsRating: 4.0,
    pramAccessRating: 4.5,
    staffFriendlinessRating: 4.5,
    noiseLevelRating: 3.5,
    verified: true,
    reviewCount: 18,
    createdAt: new Date()
  },
  {
    id: 3,
    name: "Green Garden Restaurant",
    type: "Restaurant",
    address: "789 Park Road, Hackney, London",
    latitude: 51.5344,
    longitude: -0.0500,
    phone: "020-2468-1357",
    website: "https://example.com/greengarden",
    description: "Family restaurant with a garden area, perfect for families with babies.",
    photos: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80"
    ],
    hours: JSON.stringify({
      "monday-sunday": "11:00-22:00"
    }),
    changingFacilities: false,
    highChairs: true,
    pramAccess: true,
    quietSpace: false,
    breastfeedingArea: false,
    bottleWarming: false,
    overallRating: 4.2,
    changingFacilitiesRating: 2.0,
    highChairsRating: 4.5,
    pramAccessRating: 4.0,
    staffFriendlinessRating: 4.0,
    noiseLevelRating: 3.0,
    verified: true,
    reviewCount: 12,
    createdAt: new Date()
  }
];

export const mockOffers: Offer[] = [
  {
    id: 1,
    title: "Baby Sensory Classes - First Session Free",
    description: "Perfect for 0-12 month olds. Develop your baby's senses through play.",
    provider: "Baby Sensory London",
    type: "class",
    targetAges: ["0-12 months"],
    location: "Multiple locations across London",
    validFrom: new Date("2023-07-01"),
    validTo: new Date("2025-09-30"),
    terms: "One free session per baby. New customers only.",
    link: "https://example.com/babysensory",
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&q=80",
    featured: true,
    createdAt: new Date()
  },
  {
    id: 2,
    title: "Parent & Baby Yoga - 20% Off",
    description: "Bond with your baby through gentle yoga poses designed for both of you.",
    provider: "Zen Baby Yoga",
    type: "class",
    targetAges: ["3-12 months"],
    location: "Islington Community Center",
    validFrom: new Date("2023-07-15"),
    validTo: new Date("2025-10-15"),
    terms: "Must book in advance. Subject to availability.",
    link: "https://example.com/babyyoga",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=80",
    featured: false,
    createdAt: new Date()
  },
  {
    id: 3,
    title: "Kids Eat Free at Family Bistro",
    description: "One free kids meal with every adult main course purchased.",
    provider: "Family Bistro",
    type: "meal",
    targetAges: ["0-5 years"],
    location: "5 locations across London",
    validFrom: new Date("2023-06-01"),
    validTo: new Date("2025-12-31"),
    terms: "Valid weekdays 11am-5pm. One free kids meal per adult main course.",
    link: "https://example.com/familybistro",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80",
    featured: false,
    createdAt: new Date()
  },
  {
    id: 4,
    title: "Baby Swimming Lessons - Trial Class",
    description: "Introduce your baby to water in a fun, safe environment.",
    provider: "Splash Babies",
    type: "activity",
    targetAges: ["3-18 months"],
    location: "Camden Leisure Centre",
    validFrom: new Date("2023-08-01"),
    validTo: new Date("2025-11-30"),
    terms: "One trial class per baby. Advance booking required.",
    link: "https://example.com/splashbabies",
    imageUrl: "https://images.unsplash.com/photo-1560090995-01632a28895b?w=300&q=80",
    featured: false,
    createdAt: new Date()
  }
];
