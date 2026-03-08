# Banking App Backend API Specification

**Version:** 1.0.0  
**Stack:** Node.js + Express + Prisma + PostgreSQL  
**Platform:** AWS (EC2/ECS + RDS + S3)  
**Date:** March 7, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [User Management](#user-management)
4. [Account Management](#account-management)
5. [Transactions](#transactions)
6. [Transfers](#transfers)
7. [Statistics & Reports](#statistics--reports)
8. [File Uploads](#file-uploads)
9. [Error Handling](#error-handling)
10. [Database Schema](#database-schema)

---

## Overview

This document outlines all REST API endpoints required for the banking mobile application. The backend will be built with:

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL (AWS RDS)
- **Storage:** S3 (for documents/images)
- **Authentication:** JWT (access + refresh tokens)
- **Validation:** Joi

---

## Authentication & Authorization

### 1.1 User Registration

**Endpoint:** `POST /api/v1/auth/register`  
**Access:** Public  
**Description:** Register a new user account

**Request Body (Joi Schema):**
```typescript
{
  firstName: string (required, min: 2)
  lastName: string (required, min: 2)
  username: string (required, min: 3, pattern: /^[a-zA-Z0-9._-]+$/)
  email: string (required, email)
  password: string (required, min: 8, pattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  confirmPassword: string (required, must match password)
}
```

**Success Response (201):**
```typescript
{
  success: true,
  message: "Account created successfully",
  data: {
    user: {
      id: string,
      firstName: string,
      lastName: string,
      username: string,
      email: string,
      createdAt: string (ISO 8601),
      lastLogin: string (ISO 8601),
      isActive: boolean
    },
    tokens: {
      accessToken: string,
      refreshToken: string,
      expiresIn: number (3600),
      tokenType: "Bearer"
    },
    sessionId: string
  }
}
```

**Error Responses:**
- `400`: Validation error (email already exists, username taken, password mismatch)
- `409`: Conflict (email or username already registered)

---

### 1.2 User Login

**Endpoint:** `POST /api/v1/auth/login`  
**Access:** Public  
**Description:** Authenticate user and return tokens

**Request Body:**
```typescript
{
  email: string (required, email)
  password: string (required, min: 6)
}
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Login successful",
  data: {
    user: User,
    tokens: AuthToken,
    sessionId: string
  }
}
```

**Error Responses:**
- `401`: Invalid credentials
- `403`: Account inactive
- `404`: User not found

---

### 1.3 Token Refresh

**Endpoint:** `POST /api/v1/auth/refresh`  
**Access:** Public (requires valid refresh token)  
**Description:** Refresh access token using refresh token

**Request Body:**
```typescript
{
  refreshToken: string (required)
}
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Token refreshed successfully",
  data: {
    accessToken: string,
    expiresIn: number (3600),
    tokenType: "Bearer"
  }
}
```

**Error Responses:**
- `401`: Invalid or expired refresh token
- `403`: Token type is not refresh

---

### 1.4 Logout

**Endpoint:** `POST /api/v1/auth/logout`  
**Access:** Protected (requires valid access token)  
**Description:** Invalidate user session

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Logout successful",
  data: {
    success: true
  }
}
```

---

### 1.5 Session Validation

**Endpoint:** `GET /api/v1/auth/session`  
**Access:** Protected  
**Description:** Validate current session/token

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Session is valid",
  data: {
    user: User,
    valid: boolean
  }
}
```

---

## User Management

### 2.1 Get User Profile

**Endpoint:** `GET /api/v1/users/me`  
**Access:** Protected  
**Description:** Get current user's profile information

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Profile retrieved successfully",
  data: {
    user: {
      id: string,
      firstName: string,
      lastName: string,
      username: string,
      email: string,
      createdAt: string,
      lastLogin: string,
      isActive: boolean
    },
    preferences: {
      language: string,
      notifications: boolean,
      biometrics: boolean,
      theme: string
    },
    statistics: {
      accountCount: number,
      totalBalance: number,
      lastLoginDate: string,
      memberSince: string
    }
  }
}
```

---

### 2.2 Update User Profile

**Endpoint:** `PUT /api/v1/users/me`  
**Access:** Protected  
**Description:** Update current user's profile information

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```typescript
{
  firstName?: string,
  lastName?: string,
  email?: string,
  preferences?: {
    language?: string,
    notifications?: boolean,
    biometrics?: boolean,
    theme?: string
  }
}
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Profile updated successfully",
  data: {
    user: UpdatedUser
  }
}
```

---

## Account Management

### 3.1 Get User Accounts

**Endpoint:** `GET /api/v1/accounts`  
**Access:** Protected  
**Description:** Get all accounts for the current user

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `type` (optional): Filter by account type (checking, savings)
- `isActive` (optional): Filter by active status

**Success Response (200):**
```typescript
{
  success: true,
  message: "Accounts retrieved successfully",
  data: {
    accounts: BankAccount[],
    totalBalance: number,
    currency: string
  }
}
```

---

### 3.2 Get Account by ID

**Endpoint:** `GET /api/v1/accounts/:accountId`  
**Access:** Protected  
**Description:** Get specific account details

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Account retrieved successfully",
  data: {
    account: {
      id: string,
      userId: string,
      accountNumber: string,
      accountType: string,
      balance: number,
      currency: string,
      isActive: boolean,
      createdAt: string,
      lastTransactionDate: string
    },
    recentTransactions: Transaction[],
    monthlyStats: {
      totalDebits: number,
      totalCredits: number,
      transactionCount: number
    }
  }
}
```

**Error Responses:**
- `403`: Account doesn't belong to user
- `404`: Account not found

---

### 3.3 Get Account Balance

**Endpoint:** `GET /api/v1/accounts/:accountId/balance`  
**Access:** Protected  
**Description:** Get account balance

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Balance retrieved successfully",
  data: {
    accountId: string,
    accountNumber: string (masked),
    balance: number,
    currency: string,
    lastUpdated: string
  }
}
```

---

### 3.4 Create Account

**Endpoint:** `POST /api/v1/accounts`  
**Access:** Protected  
**Description:** Create a new bank account for the user

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```typescript
{
  accountType: "checking" | "savings" (required)
  initialDeposit?: number (optional, default: 0)
}
```

**Success Response (201):**
```typescript
{
  success: true,
  message: "Account created successfully",
  data: {
    account: NewBankAccount
  }
}
```

---

## Transactions

### 4.1 Get Transaction History

**Endpoint:** `GET /api/v1/transactions`  
**Access:** Protected  
**Description:** Get transaction history with filtering and pagination

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `accountId` (optional): Filter by account
- `type` (optional): debit, credit, transfer
- `category` (optional): transfer, payment, deposit, withdrawal, fee, interest
- `status` (optional): completed, pending, failed
- `startDate` (optional): ISO 8601 date
- `endDate` (optional): ISO 8601 date
- `minAmount` (optional): minimum amount
- `maxAmount` (optional): maximum amount
- `description` (optional): search term
- `page` (optional, default: 1)
- `limit` (optional, default: 20, max: 100)

**Success Response (200):**
```typescript
{
  success: true,
  message: "Transactions retrieved successfully",
  data: {
    transactions: Transaction[],
    summary: {
      totalTransactions: number,
      totalDebits: number,
      totalCredits: number,
      netAmount: number
    },
    meta: PaginationMeta
  }
}
```

---

### 4.2 Get Transaction by ID

**Endpoint:** `GET /api/v1/transactions/:transactionId`  
**Access:** Protected  
**Description:** Get specific transaction details

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Transaction retrieved successfully",
  data: {
    transaction: {
      id: string,
      accountId: string,
      type: string,
      amount: number,
      description: string,
      category: string,
      date: string,
      status: string,
      reference?: string,
      toAccountId?: string
    }
  }
}
```

---

### 4.3 Get Transaction Statistics

**Endpoint:** `GET /api/v1/transactions/stats`  
**Access:** Protected  
**Description:** Get transaction statistics for an account

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `accountId` (required)
- `startDate` (optional)
- `endDate` (optional)

**Success Response (200):**
```typescript
{
  success: true,
  message: "Statistics retrieved successfully",
  data: {
    totalTransactions: number,
    totalDebits: number,
    totalCredits: number,
    totalTransfers: number,
    totalDebitCount: number,
    totalCreditCount: number,
    averageTransactionAmount: number
  }
}
```

---

## Transfers

### 5.1 Validate Transfer

**Endpoint:** `POST /api/v1/transfers/validate`  
**Access:** Protected  
**Description:** Validate transfer before execution

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```typescript
{
  fromAccountId: string (required)
  toAccountId: string (required)
  amount: number (required, min: 0.01)
}
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Transfer validated",
  data: {
    isValid: boolean,
    errors: string[],
    warnings: string[],
    estimatedFee: number,
    fromAccount: {
      id: string,
      balance: number,
      accountNumber: string
    },
    toAccount: {
      id: string,
      accountNumber: string
    }
  }
}
```

---

### 5.2 Execute Transfer

**Endpoint:** `POST /api/v1/transfers`  
**Access:** Protected  
**Description:** Execute a fund transfer

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```typescript
{
  fromAccountId: string (required)
  toAccountId: string (required)
  amount: number (required, min: 0.01)
  description: string (required, max: 255)
  transferType: "internal" | "external" (optional, default: internal)
}
```

**Success Response (201):**
```typescript
{
  success: true,
  message: "Transfer completed successfully",
  data: {
    transactionId: string,
    status: "completed" | "pending" | "failed",
    amount: number,
    fee: number,
    fromAccount: {
      id: string,
      newBalance: number
    },
    toAccount: {
      id: string,
      newBalance: number
    },
    reference: string,
    completedAt: string
  }
}
```

**Error Responses:**
- `400`: Insufficient funds
- `403`: Account doesn't belong to user
- `404`: Account not found

---

## Statistics & Reports

### 6.1 Get User Financial Summary

**Endpoint:** `GET /api/v1/statistics/summary`  
**Access:** Protected  
**Description:** Get comprehensive financial summary

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `startDate` (optional)
- `endDate` (optional)

**Success Response (200):**
```typescript
{
  success: true,
  message: "Financial summary retrieved",
  data: {
    accounts: {
      totalAccounts: number,
      totalBalance: number,
      accounts: AccountSummary[]
    },
    transactions: {
      period: {
        start: string,
        end: string
      },
      totalDebits: number,
      totalCredits: number,
      netFlow: number,
      byCategory: {
        [category: string]: number
      }
    },
    monthlyAverage: {
      income: number,
      expenses: number,
      savings: number
    }
  }
}
```

---

### 6.2 Get Monthly Spending Report

**Endpoint:** `GET /api/v1/statistics/spending`  
**Access:** Protected  
**Description:** Get monthly spending breakdown

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Query Parameters:**
- `year` (optional, default: current year)
- `month` (optional, default: current month)

**Success Response (200):**
```typescript
{
  success: true,
  message: "Spending report retrieved",
  data: {
    year: number,
    month: number,
    totalSpent: number,
    byCategory: {
      payment: number,
      withdrawal: number,
      fee: number,
      transfer: number
    },
    byAccount: {
      [accountId: string]: {
        accountNumber: string,
        spent: number
      }
    },
    topCategories: CategorySummary[],
    dailyBreakdown: DailySummary[]
  }
}
```

---

## File Uploads

### 7.1 Upload Document

**Endpoint:** `POST /api/v1/uploads`  
**Access:** Protected  
**Description:** Upload documents to S3

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` (required): File to upload
- `type` (required): document, id_proof, statement

**Success Response (201):**
```typescript
{
  success: true,
  message: "File uploaded successfully",
  data: {
    fileName: string,
    filePath: string,
    fileSize: number,
    fileType: string,
    uploadedAt: string
  }
}
```

---

## Error Handling

### Standard Error Response Format

```typescript
{
  success: false,
  message: string,
  error: {
    code: string,
    details?: Record<string, any>
  },
  timestamp: string,
  requestId?: string
}
```

### Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `UNAUTHORIZED` | Invalid or missing authentication | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `CONFLICT_ERROR` | Resource already exists | 409 |
| `INTERNAL_ERROR` | Server error | 500 |
| `RATE_LIMITED` | Too many requests | 429 |

---

## Database Schema (Prisma)

### Models

```prisma
model User {
  id            String    @id @default(cuid())
  firstName     String
  lastName      String
  username      String    @unique
  email         String    @unique
  passwordHash  String
  createdAt     DateTime  @default(now())
  lastLogin     DateTime?
  isActive      Boolean   @default(true)
  accounts      Account[]
  transactions  Transaction[]
  preferences   Preference?
}

model Preference {
  id          String   @id @default(cuid())
  userId      String   @unique
  language    String   @default("en")
  notifications Boolean @default(true)
  biometrics  Boolean  @default(false)
  theme       String   @default("system")
  user        User     @relation(fields: [userId], references: [id])
}

model Account {
  id               String    @id @default(cuid())
  userId           String
  accountNumber    String    @unique
  accountType      String    // checking, savings, credit, investment
  balance          Decimal   @db.Decimal(19,2)
  currency         String    // USD, EUR, COP, DOP
  isActive         Boolean   @default(true)
  createdAt        DateTime  @default(now())
  lastTransactionDate DateTime?
  user             User      @relation(fields: [userId], references: [id])
  transactions     Transaction[]
}

model Transaction {
  id           String    @id @default(cuid())
  accountId    String
  type         String    // debit, credit, transfer
  amount       Decimal   @db.Decimal(19,2)
  description  String?
  category     String    // transfer, payment, deposit, withdrawal, fee, interest
  date         DateTime  @default(now())
  status       String    // completed, pending, failed
  reference    String?
  toAccountId  String?
  fromAccount  Account   @relation(fields: [accountId], references: [id])
  toAccount    Account?  @relation(fields: [toAccountId], references: [id])
}

model RefreshToken {
  id         String   @id @default(cuid())
  userId     String
  token      String   @unique
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id])
}
```

---

## AWS Infrastructure

### Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **EC2/ECS** | Application hosting | t3.medium (EC2) or fargate (ECS) |
| **RDS** | PostgreSQL database | db.t3.medium, 20GB storage |
| **S3** | File storage | Public bucket for uploads |
| **CloudFront** | CDN (optional) | For static assets |
| **Route53** | DNS | Custom domain |
| **ACM** | SSL Certificate | Free certificate |
| **CloudWatch** | Monitoring & Logs | Alarms for errors |

### Environment Variables

```env
# Application
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@host:5432/banking

# JWT
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRES_IN=3600
JWT_REFRESH_EXPIRES_IN=604800

# AWS
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=banking-app-uploads

# Logging
LOG_LEVEL=info
```

---

## Implementation Priority

### Phase 1: Core Authentication
1. User registration
2. User login
3. Token refresh
4. Session validation
5. Logout

### Phase 2: User & Account Management
6. Get user profile
7. Update user profile
8. Get user accounts
9. Get account details
10. Get account balance

### Phase 3: Transactions
11. Get transaction history
12. Get transaction by ID
13. Get transaction statistics

### Phase 4: Transfers
14. Validate transfer
15. Execute transfer

### Phase 5: Statistics & Reports
16. Financial summary
17. Monthly spending report

### Phase 6: File Uploads
18. Document upload

---

## Notes

- All endpoints require proper input validation using Joi
- Implement rate limiting (e.g., 100 requests per minute per IP)
- Use request IDs for tracing
- Implement proper logging with context
- Add request/response logging middleware
- Use environment-specific configurations
- Implement database connection pooling
- Add health check endpoint (`GET /health`)
- Add metrics endpoint (`GET /metrics`)
