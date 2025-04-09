import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  profileType: text("profile_type"), // parent, caregiver, etc.
  childAges: text("child_ages").array(), // Array of child ages
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  profileType: true,
  childAges: true,
  location: true
});

// Venues model
export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // café, restaurant, play area, etc.
  address: text("address").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  phone: text("phone"),
  website: text("website"),
  description: text("description"),
  photos: text("photos").array(),
  hours: text("hours"), // JSON string of operating hours
  // Baby-friendly features
  changingFacilities: boolean("changing_facilities").default(false),
  highChairs: boolean("high_chairs").default(false),
  pramAccess: boolean("pram_access").default(false),
  quietSpace: boolean("quiet_space").default(false),
  breastfeedingArea: boolean("breastfeeding_area").default(false),
  bottleWarming: boolean("bottle_warming").default(false),
  // Average ratings
  overallRating: doublePrecision("overall_rating"),
  changingFacilitiesRating: doublePrecision("changing_facilities_rating"),
  highChairsRating: doublePrecision("high_chairs_rating"),
  pramAccessRating: doublePrecision("pram_access_rating"),
  staffFriendlinessRating: doublePrecision("staff_friendliness_rating"),
  noiseLevelRating: doublePrecision("noise_level_rating"),
  reviewCount: integer("review_count").default(0),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertVenueSchema = createInsertSchema(venues).omit({
  id: true,
  reviewCount: true,
  createdAt: true
});

// Reviews model
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  venueId: integer("venue_id").notNull(),
  userId: integer("user_id").notNull(),
  visitDate: timestamp("visit_date"),
  childAge: text("child_age"),
  overallRating: integer("overall_rating").notNull(),
  changingFacilitiesRating: integer("changing_facilities_rating"),
  highChairsRating: integer("high_chairs_rating"),
  pramAccessRating: integer("pram_access_rating"),
  staffFriendlinessRating: integer("staff_friendliness_rating"),
  noiseLevelRating: integer("noise_level_rating"),
  content: text("content").notNull(),
  photos: text("photos").array(),
  helpfulVotes: integer("helpful_votes").default(0),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  helpfulVotes: true,
  createdAt: true
});

// Offers model
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  provider: text("provider").notNull(),
  type: text("type").notNull(), // class, activity, product, meal, etc.
  targetAges: text("target_ages").array(),
  location: text("location"),
  validFrom: timestamp("valid_from"),
  validTo: timestamp("valid_to"),
  terms: text("terms"),
  link: text("link"),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertOfferSchema = createInsertSchema(offers).omit({
  id: true,
  createdAt: true
});

// Favorites model (join table)
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  venueId: integer("venue_id").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVenue = z.infer<typeof insertVenueSchema>;
export type Venue = typeof venues.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type Offer = typeof offers.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// Location object type used for searches
export type Location = {
  latitude: number;
  longitude: number;
};
