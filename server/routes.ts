import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCategorySchema, insertCartItemSchema, updateCartItemSchema, insertUserSchema, loginUserSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to get or create session ID
  const getSessionId = (req: any) => {
    if (!req.session.id) {
      req.session.id = require('crypto').randomUUID();
    }
    return req.session.id;
  };

  // Authentication routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Store user in session
      req.session.userId = user.id;
      
      // Return user without password
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      console.error("Error registering user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = loginUserSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Check password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Store user in session
      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Error logging in user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const categoryId = req.query.categoryId as string;
      const search = req.query.search as string;
      const featured = req.query.featured === 'true';

      let products;
      
      if (featured) {
        products = await storage.getFeaturedProducts(limit);
      } else if (search) {
        products = await storage.searchProducts(search, limit, offset);
      } else if (categoryId) {
        products = await storage.getProductsByCategory(categoryId, limit, offset);
      } else {
        products = await storage.getProducts(limit, offset);
      }
      
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        sessionId
      });
      
      const cartItem = await storage.addToCart(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.put("/api/cart/:productId", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const { productId } = req.params;
      const updates = updateCartItemSchema.parse(req.body);
      
      const cartItem = await storage.updateCartItem(sessionId, productId, updates);
      
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:productId", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      const { productId } = req.params;
      
      await storage.removeFromCart(sessionId, productId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = getSessionId(req);
      await storage.clearCart(sessionId);
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Initialize with sample data
  app.post("/api/init-data", async (req, res) => {
    try {
      // Create categories
      const electronics = await storage.createCategory({
        name: "Electronics",
        slug: "electronics",
        description: "Latest electronic devices and gadgets",
        imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      });

      const fashion = await storage.createCategory({
        name: "Fashion",
        slug: "fashion",
        description: "Trendy clothing and accessories",
        imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      });

      const home = await storage.createCategory({
        name: "Home & Garden",
        slug: "home-garden",
        description: "Everything for your home and garden",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      });

      const sports = await storage.createCategory({
        name: "Sports",
        slug: "sports",
        description: "Sports and fitness equipment",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      });

      const books = await storage.createCategory({
        name: "Books",
        slug: "books",
        description: "Books and literature",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      });

      const beauty = await storage.createCategory({
        name: "Beauty",
        slug: "beauty",
        description: "Beauty and cosmetics",
        imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"
      });

      // Create products
      const products = [
        {
          name: "Premium Wireless Headphones",
          description: "High-quality sound with active noise cancellation",
          price: "199.99",
          originalPrice: "249.99",
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
          categoryId: electronics.id,
          stock: 50,
          isFeatured: true,
          rating: "4.8",
          reviewCount: 156
        },
        {
          name: "Latest Smartphone Pro",
          description: "Advanced camera system and lightning-fast performance",
          price: "899.00",
          imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
          categoryId: electronics.id,
          stock: 30,
          isFeatured: true,
          rating: "4.5",
          reviewCount: 89
        },
        {
          name: "Professional Laptop Pro",
          description: "High-performance laptop for creative professionals",
          price: "1299.00",
          originalPrice: "1499.00",
          imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
          categoryId: electronics.id,
          stock: 25,
          isFeatured: true,
          rating: "4.9",
          reviewCount: 234
        },
        {
          name: "Smart Fitness Watch",
          description: "Track your health and stay connected",
          price: "299.99",
          imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
          categoryId: electronics.id,
          stock: 75,
          isFeatured: true,
          rating: "4.3",
          reviewCount: 127
        },
        {
          name: "Wireless Gaming Mouse",
          description: "High-precision gaming mouse with RGB lighting",
          price: "79.99",
          imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
          categoryId: electronics.id,
          stock: 100,
          rating: "4.6",
          reviewCount: 92
        },
        {
          name: "Designer T-Shirt",
          description: "Premium cotton t-shirt with modern design",
          price: "39.99",
          imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
          categoryId: fashion.id,
          stock: 200,
          rating: "4.2",
          reviewCount: 45
        },
        {
          name: "Yoga Mat Pro",
          description: "Non-slip yoga mat for all skill levels",
          price: "49.99",
          imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
          categoryId: sports.id,
          stock: 80,
          rating: "4.7",
          reviewCount: 73
        },
        {
          name: "The Great Novel",
          description: "Bestselling fiction novel of the year",
          price: "19.99",
          imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
          categoryId: books.id,
          stock: 150,
          rating: "4.8",
          reviewCount: 312
        }
      ];

      for (const product of products) {
        await storage.createProduct(product);
      }

      res.json({ message: "Sample data initialized successfully" });
    } catch (error) {
      console.error("Error initializing data:", error);
      res.status(500).json({ message: "Failed to initialize data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
