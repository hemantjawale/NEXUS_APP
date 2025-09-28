import { 
  categories, products, cartItems, users,
  type Category, type InsertCategory,
  type Product, type InsertProduct, type ProductWithCategory,
  type CartItem, type InsertCartItem, type UpdateCartItem, type CartItemWithProduct,
  type User, type InsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, ilike, or } from "drizzle-orm";

export interface IStorage {
  // Users
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(limit?: number, offset?: number): Promise<ProductWithCategory[]>;
  getProductById(id: string): Promise<ProductWithCategory | undefined>;
  getProductsByCategory(categoryId: string, limit?: number, offset?: number): Promise<ProductWithCategory[]>;
  getFeaturedProducts(limit?: number): Promise<ProductWithCategory[]>;
  searchProducts(query: string, limit?: number, offset?: number): Promise<ProductWithCategory[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(sessionId: string, productId: string, updates: UpdateCartItem): Promise<CartItem | undefined>;
  removeFromCart(sessionId: string, productId: string): Promise<void>;
  clearCart(sessionId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Products
  async getProducts(limit = 20, offset = 0): Promise<ProductWithCategory[]> {
    return await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        imageUrl: products.imageUrl,
        categoryId: products.categoryId,
        stock: products.stock,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        rating: products.rating,
        reviewCount: products.reviewCount,
        createdAt: products.createdAt,
        category: categories,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getProductById(id: string): Promise<ProductWithCategory | undefined> {
    const [product] = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        imageUrl: products.imageUrl,
        categoryId: products.categoryId,
        stock: products.stock,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        rating: products.rating,
        reviewCount: products.reviewCount,
        createdAt: products.createdAt,
        category: categories,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.id, id), eq(products.isActive, true)));
    
    return product || undefined;
  }

  async getProductsByCategory(categoryId: string, limit = 20, offset = 0): Promise<ProductWithCategory[]> {
    return await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        imageUrl: products.imageUrl,
        categoryId: products.categoryId,
        stock: products.stock,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        rating: products.rating,
        reviewCount: products.reviewCount,
        createdAt: products.createdAt,
        category: categories,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getFeaturedProducts(limit = 8): Promise<ProductWithCategory[]> {
    return await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        imageUrl: products.imageUrl,
        categoryId: products.categoryId,
        stock: products.stock,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        rating: products.rating,
        reviewCount: products.reviewCount,
        createdAt: products.createdAt,
        category: categories,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(eq(products.isFeatured, true), eq(products.isActive, true)))
      .orderBy(desc(products.createdAt))
      .limit(limit);
  }

  async searchProducts(query: string, limit = 20, offset = 0): Promise<ProductWithCategory[]> {
    return await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        imageUrl: products.imageUrl,
        categoryId: products.categoryId,
        stock: products.stock,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        rating: products.rating,
        reviewCount: products.reviewCount,
        createdAt: products.createdAt,
        category: categories,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(
        and(
          eq(products.isActive, true),
          or(
            ilike(products.name, `%${query}%`),
            ilike(products.description, `%${query}%`)
          )
        )
      )
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  // Cart
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    return await db
      .select({
        id: cartItems.id,
        sessionId: cartItems.sessionId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
        product: products,
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.sessionId, sessionId));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.sessionId, item.sessionId), eq(cartItems.productId, item.productId!)));

    if (existingItem) {
      // Update quantity
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + (item.quantity || 1) })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    } else {
      // Insert new item
      const [newItem] = await db.insert(cartItems).values(item).returning();
      return newItem;
    }
  }

  async updateCartItem(sessionId: string, productId: string, updates: UpdateCartItem): Promise<CartItem | undefined> {
    const [updatedItem] = await db
      .update(cartItems)
      .set(updates)
      .where(and(eq(cartItems.sessionId, sessionId), eq(cartItems.productId, productId)))
      .returning();
    
    return updatedItem || undefined;
  }

  async removeFromCart(sessionId: string, productId: string): Promise<void> {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.sessionId, sessionId), eq(cartItems.productId, productId)));
  }

  async clearCart(sessionId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
  }
}

export const storage = new DatabaseStorage();
