/**
 * @fileoverview Mock user data for banking app simulation
 * @author Eduardo Valenzuela
 * @version 1.0.0
 */

import type { RegisterData, User } from '../../../../shared/types';

/**
 * Mock users database
 */
export const mockUsers: User[] = [
  {
    id: 'user_001',
    firstName: 'Eduardo',
    lastName: 'Valenzuela',
    username: 'eduardo.val',
    email: 'eduardo@example.com',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: 'user_002',
    firstName: 'María',
    lastName: 'González',
    username: 'maria.gonzalez',
    email: 'maria@example.com',
    createdAt: new Date('2024-02-10T14:30:00Z'),
    lastLogin: new Date(Date.now() - 86400000), // 1 day ago
    isActive: true,
  },
  {
    id: 'user_003',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    username: 'carlos.rodriguez',
    email: 'carlos@example.com',
    createdAt: new Date('2024-03-05T09:15:00Z'),
    lastLogin: new Date(Date.now() - 172800000), // 2 days ago
    isActive: true,
  },
];

/**
 * Mock user credentials for authentication
 */
export const mockCredentials = [
  { email: 'eduardo@example.com', password: 'password123' },
  { email: 'maria@example.com', password: 'password123' },
  { email: 'carlos@example.com', password: 'password123' },
  // Demo credentials
  { email: 'demo@banking.com', password: 'demo123' },
  { email: 'test@banking.com', password: 'test123' },
];

/**
 * Finds user by email
 * @param email User email
 * @returns User or undefined
 */
export const findUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

/**
 * Finds user by username
 * @param username Username
 * @returns User or undefined
 */
export const findUserByUsername = (username: string): User | undefined => {
  return mockUsers.find(user => user.username.toLowerCase() === username.toLowerCase());
};

/**
 * Finds user by ID
 * @param id User ID
 * @returns User or undefined
 */
export const findUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

/**
 * Validates user credentials
 * @param email User email
 * @param password User password
 * @returns True if valid credentials
 */
export const validateCredentials = (email: string, password: string): boolean => {
  return mockCredentials.some(
    cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
  );
};

/**
 * Checks if email already exists
 * @param email Email to check
 * @returns True if email exists
 */
export const emailExists = (email: string): boolean => {
  return mockUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
};

/**
 * Checks if username already exists
 * @param username Username to check
 * @returns True if username exists
 */
export const usernameExists = (username: string): boolean => {
  return mockUsers.some(user => user.username.toLowerCase() === username.toLowerCase());
};

/**
 * Creates a new user (simulates registration)
 * @param userData Registration data
 * @returns Created user
 */
export const createUser = (userData: RegisterData): User => {
  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    firstName: userData.firstName,
    lastName: userData.lastName,
    username: userData.username,
    email: userData.email,
    createdAt: new Date(),
    lastLogin: new Date(),
    isActive: true,
  };

  // Add to mock database
  mockUsers.push(newUser);
  
  // Add credentials
  mockCredentials.push({
    email: userData.email,
    password: userData.password,
  });

  console.log('✅ Mock user created:', JSON.stringify({
    id: newUser.id,
    email: newUser.email,
    username: newUser.username,
  }, null, 2));

  return newUser;
};

/**
 * Updates user last login timestamp
 * @param userId User ID
 */
export const updateLastLogin = (userId: string): void => {
  const user = findUserById(userId);
  if (user) {
    user.lastLogin = new Date();
    
    console.log('✅ User last login updated:', JSON.stringify({
      userId: user.id,
      lastLogin: user.lastLogin.toISOString(),
    }, null, 2));
  }
};

console.log('🗄️ Mock users database initialized with', mockUsers.length, 'users');
