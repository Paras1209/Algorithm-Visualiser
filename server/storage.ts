import { db } from "@db";
import { eq, and } from "drizzle-orm";
import {
  algorithms,
  algorithmCategories,
  users,
  userPreferences,
  algorithmExamples,
  type AlgorithmCategory,
  type Algorithm,
  type UserPreferences,
  type AlgorithmExample,
  type InsertAlgorithmCategory,
  type InsertAlgorithm,
} from "@shared/schema";

// Algorithm Categories
export async function getAllAlgorithmCategories(): Promise<AlgorithmCategory[]> {
  return await db.query.algorithmCategories.findMany();
}

export async function getAlgorithmCategoryById(id: number): Promise<AlgorithmCategory | undefined> {
  return await db.query.algorithmCategories.findFirst({
    where: eq(algorithmCategories.id, id)
  });
}

export async function createAlgorithmCategory(data: InsertAlgorithmCategory): Promise<AlgorithmCategory> {
  const [newCategory] = await db.insert(algorithmCategories).values(data).returning();
  return newCategory;
}

// Algorithms
export async function getAllAlgorithms(): Promise<Algorithm[]> {
  return await db.query.algorithms.findMany({
    with: {
      category: true
    }
  });
}

export async function getAlgorithmById(id: number): Promise<Algorithm | undefined> {
  return await db.query.algorithms.findFirst({
    where: eq(algorithms.id, id),
    with: {
      category: true
    }
  });
}

export async function getAlgorithmsByCategoryId(categoryId: number): Promise<Algorithm[]> {
  return await db.query.algorithms.findMany({
    where: eq(algorithms.categoryId, categoryId),
    with: {
      category: true
    }
  });
}

export async function createAlgorithm(data: InsertAlgorithm): Promise<Algorithm> {
  const [newAlgorithm] = await db.insert(algorithms).values(data).returning();
  return newAlgorithm;
}

// User Preferences
export async function getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
  return await db.query.userPreferences.findFirst({
    where: eq(userPreferences.userId, userId),
    with: {
      lastAlgorithm: true
    }
  });
}

export async function updateUserPreferences(
  userId: number,
  data: Partial<UserPreferences>
): Promise<UserPreferences | undefined> {
  // First check if preferences exist
  const existingPrefs = await db.query.userPreferences.findFirst({
    where: eq(userPreferences.userId, userId)
  });

  if (existingPrefs) {
    // Update existing preferences
    const [updatedPrefs] = await db
      .update(userPreferences)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(userPreferences.userId, userId))
      .returning();
    
    return updatedPrefs;
  } else {
    // Create new preferences
    const [newPrefs] = await db
      .insert(userPreferences)
      .values({
        userId,
        animationSpeed: data.animationSpeed || 3,
        arraySize: data.arraySize || 20,
        theme: data.theme || 'light',
        lastAlgorithmId: data.lastAlgorithmId,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return newPrefs;
  }
}

// Algorithm Examples
export async function createAlgorithmExample(
  data: Omit<AlgorithmExample, "id" | "createdAt">
): Promise<AlgorithmExample> {
  const [newExample] = await db
    .insert(algorithmExamples)
    .values({
      ...data,
      createdAt: new Date()
    })
    .returning();
  
  return newExample;
}

export async function getAlgorithmExamplesByUserId(userId: number): Promise<AlgorithmExample[]> {
  return await db.query.algorithmExamples.findMany({
    where: eq(algorithmExamples.userId, userId),
    with: {
      algorithm: true
    }
  });
}

export async function getAlgorithmExampleById(id: number): Promise<AlgorithmExample | undefined> {
  return await db.query.algorithmExamples.findFirst({
    where: eq(algorithmExamples.id, id),
    with: {
      algorithm: true,
      user: true
    }
  });
}

// Export all storage functions
export const storage = {
  getAllAlgorithmCategories,
  getAlgorithmCategoryById,
  createAlgorithmCategory,
  getAllAlgorithms,
  getAlgorithmById,
  getAlgorithmsByCategoryId,
  createAlgorithm,
  getUserPreferences,
  updateUserPreferences,
  createAlgorithmExample,
  getAlgorithmExamplesByUserId,
  getAlgorithmExampleById
};
