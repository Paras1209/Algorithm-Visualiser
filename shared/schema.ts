import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User table (for authentication and saving preferences)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Algorithm categories
export const algorithmCategories = pgTable("algorithm_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

// Algorithms table
export const algorithms = pgTable("algorithms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").references(() => algorithmCategories.id).notNull(),
  timeComplexity: text("time_complexity").notNull(),
  spaceComplexity: text("space_complexity").notNull(),
  pseudocode: text("pseudocode").notNull(),
  explanation: text("explanation").notNull(),
  bestCase: text("best_case"),
  averageCase: text("average_case"),
  worstCase: text("worst_case"),
  steps: jsonb("steps").notNull(), // Array of step descriptions
});

// User preferences
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  animationSpeed: integer("animation_speed").default(3), // 1-5 scale
  arraySize: integer("array_size").default(20),
  theme: text("theme").default("light"),
  lastAlgorithmId: integer("last_algorithm_id").references(() => algorithms.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Algorithm examples (for saving specific configurations)
export const algorithmExamples = pgTable("algorithm_examples", {
  id: serial("id").primaryKey(),
  algorithmId: integer("algorithm_id").references(() => algorithms.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  inputData: jsonb("input_data").notNull(), // The starting data structure
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const algorithmCategoriesRelations = relations(algorithmCategories, ({ many }) => ({
  algorithms: many(algorithms),
}));

export const algorithmsRelations = relations(algorithms, ({ one, many }) => ({
  category: one(algorithmCategories, {
    fields: [algorithms.categoryId],
    references: [algorithmCategories.id],
  }),
  examples: many(algorithmExamples),
}));

export const usersRelations = relations(users, ({ many }) => ({
  preferences: many(userPreferences),
  examples: many(algorithmExamples),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
  lastAlgorithm: one(algorithms, {
    fields: [userPreferences.lastAlgorithmId],
    references: [algorithms.id],
  }),
}));

export const algorithmExamplesRelations = relations(algorithmExamples, ({ one }) => ({
  algorithm: one(algorithms, {
    fields: [algorithmExamples.algorithmId],
    references: [algorithms.id],
  }),
  user: one(users, {
    fields: [algorithmExamples.userId],
    references: [users.id],
  }),
}));

// Schemas for validation
export const insertAlgorithmCategorySchema = createInsertSchema(algorithmCategories);
export const insertAlgorithmSchema = createInsertSchema(algorithms);
export const insertUserSchema = createInsertSchema(users);
export const insertUserPreferencesSchema = createInsertSchema(userPreferences);
export const insertAlgorithmExampleSchema = createInsertSchema(algorithmExamples);

// Types for TypeScript
export type AlgorithmCategory = typeof algorithmCategories.$inferSelect;
export type Algorithm = typeof algorithms.$inferSelect;
export type User = typeof users.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type AlgorithmExample = typeof algorithmExamples.$inferSelect;

export type InsertAlgorithmCategory = z.infer<typeof insertAlgorithmCategorySchema>;
export type InsertAlgorithm = z.infer<typeof insertAlgorithmSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type InsertAlgorithmExample = z.infer<typeof insertAlgorithmExampleSchema>;
