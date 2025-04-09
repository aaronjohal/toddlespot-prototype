import {
  User,
  InsertUser,
  Venue,
  InsertVenue,
  Review,
  InsertReview,
  Offer,
  InsertOffer,
  Favorite,
  InsertFavorite,
  Location
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Venue methods
  getVenue(id: number): Promise<Venue | undefined>;
  getVenues(limit?: number, offset?: number): Promise<Venue[]>;
  getVenuesByType(type: string): Promise<Venue[]>;
  getVenuesByLocation(location: Location, radius: number): Promise<Venue[]>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  updateVenue(id: number, venue: Partial<Venue>): Promise<Venue | undefined>;

  // Review methods
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByVenue(venueId: number): Promise<Review[]>;
  getReviewsByUser(userId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReviewHelpfulVotes(id: number, increment: number): Promise<Review | undefined>;

  // Offer methods
  getOffer(id: number): Promise<Offer | undefined>;
  getOffers(limit?: number, offset?: number): Promise<Offer[]>;
  getOffersByType(type: string): Promise<Offer[]>;
  getFeaturedOffers(): Promise<Offer[]>;
  createOffer(offer: InsertOffer): Promise<Offer>;

  // Favorite methods
  getFavorite(userId: number, venueId: number): Promise<Favorite | undefined>;
  getFavoritesByUser(userId: number): Promise<Venue[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, venueId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private venues: Map<number, Venue>;
  private reviews: Map<number, Review>;
  private offers: Map<number, Offer>;
  private favorites: Map<number, Favorite>;
  private userIdCounter: number;
  private venueIdCounter: number;
  private reviewIdCounter: number;
  private offerIdCounter: number;
  private favoriteIdCounter: number;

  constructor() {
    this.users = new Map();
    this.venues = new Map();
    this.reviews = new Map();
    this.offers = new Map();
    this.favorites = new Map();
    this.userIdCounter = 1;
    this.venueIdCounter = 1;
    this.reviewIdCounter = 1;
    this.offerIdCounter = 1;
    this.favoriteIdCounter = 1;

    // Seed some initial data
    this.seedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      lastLogin: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userUpdate: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userUpdate };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Venue methods
  async getVenue(id: number): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  async getVenues(limit = 20, offset = 0): Promise<Venue[]> {
    return Array.from(this.venues.values())
      .sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0))
      .slice(offset, offset + limit);
  }

  async getVenuesByType(type: string): Promise<Venue[]> {
    return Array.from(this.venues.values())
      .filter(venue => venue.type === type)
      .sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0));
  }

  async getVenuesByLocation(location: Location, radius: number): Promise<Venue[]> {
    // Simple distance calculation (not actual geodistance)
    return Array.from(this.venues.values())
      .filter(venue => {
        const distance = Math.sqrt(
          Math.pow(venue.latitude - location.latitude, 2) +
          Math.pow(venue.longitude - location.longitude, 2)
        );
        // Convert to approximate km (very rough estimation)
        const distanceKm = distance * 111;
        return distanceKm <= radius;
      })
      .sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0));
  }

  async createVenue(insertVenue: InsertVenue): Promise<Venue> {
    const id = this.venueIdCounter++;
    const venue: Venue = {
      ...insertVenue,
      id,
      reviewCount: 0,
      createdAt: new Date()
    };
    this.venues.set(id, venue);
    return venue;
  }

  async updateVenue(id: number, venueUpdate: Partial<Venue>): Promise<Venue | undefined> {
    const venue = this.venues.get(id);
    if (!venue) return undefined;
    
    const updatedVenue = { ...venue, ...venueUpdate };
    this.venues.set(id, updatedVenue);
    return updatedVenue;
  }

  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsByVenue(venueId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.venueId === venueId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const review: Review = {
      ...insertReview,
      id,
      helpfulVotes: 0,
      createdAt: new Date()
    };
    this.reviews.set(id, review);

    // Update venue ratings
    const venue = this.venues.get(review.venueId);
    if (venue) {
      const venueReviews = await this.getReviewsByVenue(review.venueId);
      const newReviewCount = venueReviews.length;

      // Calculate new average ratings
      const calcAvgRating = (field: keyof Pick<Review, 
        'overallRating' | 'changingFacilitiesRating' | 'highChairsRating' | 
        'pramAccessRating' | 'staffFriendlinessRating' | 'noiseLevelRating'>) => {
        const sum = venueReviews.reduce((acc, rev) => acc + (rev[field] || 0), 0);
        return sum / newReviewCount;
      };

      const updatedVenue: Partial<Venue> = {
        reviewCount: newReviewCount,
        overallRating: calcAvgRating('overallRating'),
        changingFacilitiesRating: calcAvgRating('changingFacilitiesRating'),
        highChairsRating: calcAvgRating('highChairsRating'),
        pramAccessRating: calcAvgRating('pramAccessRating'),
        staffFriendlinessRating: calcAvgRating('staffFriendlinessRating'),
        noiseLevelRating: calcAvgRating('noiseLevelRating')
      };

      await this.updateVenue(review.venueId, updatedVenue);
    }

    return review;
  }

  async updateReviewHelpfulVotes(id: number, increment: number): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;
    
    const updatedReview = { 
      ...review, 
      helpfulVotes: review.helpfulVotes + increment 
    };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  // Offer methods
  async getOffer(id: number): Promise<Offer | undefined> {
    return this.offers.get(id);
  }

  async getOffers(limit = 20, offset = 0): Promise<Offer[]> {
    return Array.from(this.offers.values())
      .sort((a, b) => Number(b.featured) - Number(a.featured))
      .slice(offset, offset + limit);
  }

  async getOffersByType(type: string): Promise<Offer[]> {
    return Array.from(this.offers.values())
      .filter(offer => offer.type === type)
      .sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  async getFeaturedOffers(): Promise<Offer[]> {
    return Array.from(this.offers.values())
      .filter(offer => offer.featured)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createOffer(insertOffer: InsertOffer): Promise<Offer> {
    const id = this.offerIdCounter++;
    const offer: Offer = {
      ...insertOffer,
      id,
      createdAt: new Date()
    };
    this.offers.set(id, offer);
    return offer;
  }

  // Favorite methods
  async getFavorite(userId: number, venueId: number): Promise<Favorite | undefined> {
    return Array.from(this.favorites.values()).find(
      fav => fav.userId === userId && fav.venueId === venueId
    );
  }

  async getFavoritesByUser(userId: number): Promise<Venue[]> {
    const favoriteVenueIds = Array.from(this.favorites.values())
      .filter(fav => fav.userId === userId)
      .map(fav => fav.venueId);
    
    const favoriteVenues: Venue[] = [];
    for (const venueId of favoriteVenueIds) {
      const venue = await this.getVenue(venueId);
      if (venue) {
        favoriteVenues.push(venue);
      }
    }
    
    return favoriteVenues;
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    // Check if already exists
    const existing = await this.getFavorite(insertFavorite.userId, insertFavorite.venueId);
    if (existing) return existing;
    
    const id = this.favoriteIdCounter++;
    const favorite: Favorite = {
      ...insertFavorite,
      id,
      createdAt: new Date()
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFavorite(userId: number, venueId: number): Promise<boolean> {
    const favorite = await this.getFavorite(userId, venueId);
    if (!favorite) return false;
    
    this.favorites.delete(favorite.id);
    return true;
  }

  // Seed some initial data for demo purposes
  private seedData() {
    // Seed venues
    const venues: InsertVenue[] = [
      {
        name: "Cozy Corner Café",
        type: "Café",
        address: "123 Main Street, Islington, London",
        latitude: 51.5362,
        longitude: -0.1033,
        phone: "020-1234-5678",
        website: "https://example.com/cozycorner",
        description: "A family-friendly café with a dedicated quiet space for parents and babies.",
        photos: [
          "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
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
        verified: true
      },
      {
        name: "Little Paws Playcentre",
        type: "Play Area",
        address: "45 Child Street, Camden, London",
        latitude: 51.5322,
        longitude: -0.1230,
        phone: "020-8765-4321",
        website: "https://example.com/littlepaws",
        description: "Indoor play area specially designed for babies and toddlers.",
        photos: [
          "https://images.unsplash.com/photo-1574936611677-f231616a9089?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
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
        verified: true
      },
      {
        name: "Green Garden Restaurant",
        type: "Restaurant",
        address: "789 Park Road, Hackney, London",
        latitude: 51.5344,
        longitude: -0.0500,
        phone: "020-2468-1357",
        website: "https://example.com/greengarden",
        description: "Family restaurant with a garden area, perfect for families with babies.",
        photos: [
          "https://images.unsplash.com/photo-1564758866811-4890819ed2d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
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
        verified: true
      }
    ];

    // Create venues
    venues.forEach(venue => {
      this.createVenue(venue);
    });

    // Seed offers
    const offers: InsertOffer[] = [
      {
        title: "Baby Sensory Classes - First Session Free",
        description: "Perfect for 0-12 month olds. Develop your baby's senses through play.",
        provider: "Baby Sensory London",
        type: "class",
        targetAges: ["0-12 months"],
        location: "Multiple locations across London",
        validFrom: new Date("2023-07-01"),
        validTo: new Date("2023-09-30"),
        terms: "One free session per baby. New customers only.",
        link: "https://example.com/babysensory",
        imageUrl: "https://images.unsplash.com/photo-1596464598937-1a481d21d61b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        featured: true
      },
      {
        title: "Parent & Baby Yoga - 20% Off",
        description: "Bond with your baby through gentle yoga poses designed for both of you.",
        provider: "Zen Baby Yoga",
        type: "class",
        targetAges: ["3-12 months"],
        location: "Islington Community Center",
        validFrom: new Date("2023-07-15"),
        validTo: new Date("2023-10-15"),
        terms: "Must book in advance. Subject to availability.",
        link: "https://example.com/babyyoga",
        imageUrl: "https://images.unsplash.com/photo-1571172964276-91faaa704e1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        featured: false
      },
      {
        title: "Kids Eat Free at Family Bistro",
        description: "One free kids meal with every adult main course purchased.",
        provider: "Family Bistro",
        type: "meal",
        targetAges: ["0-5 years"],
        location: "5 locations across London",
        validFrom: new Date("2023-06-01"),
        validTo: new Date("2023-12-31"),
        terms: "Valid weekdays 11am-5pm. One free kids meal per adult main course.",
        link: "https://example.com/familybistro",
        imageUrl: "https://images.unsplash.com/photo-1558599249-46c436deb339?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        featured: false
      },
      {
        title: "Baby Swimming Lessons - Trial Class",
        description: "Introduce your baby to water in a fun, safe environment.",
        provider: "Splash Babies",
        type: "activity",
        targetAges: ["3-18 months"],
        location: "Camden Leisure Centre",
        validFrom: new Date("2023-08-01"),
        validTo: new Date("2023-11-30"),
        terms: "One trial class per baby. Advance booking required.",
        link: "https://example.com/splashbabies",
        imageUrl: "https://images.unsplash.com/photo-1566454419290-57a0589c9b17?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        featured: false
      }
    ];

    // Create offers
    offers.forEach(offer => {
      this.createOffer(offer);
    });
  }
}

export const storage = new MemStorage();
