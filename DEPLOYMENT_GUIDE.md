# Credit Card Fraud Detection Application - Deployment Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Deployment on Railway](#deployment-on-railway)
5. [Deployment on Vercel](#deployment-on-vercel)
6. [Deployment on Heroku](#deployment-on-heroku)
7. [Environment Variables](#environment-variables)
8. [Database Setup](#database-setup)
9. [Usage Guide](#usage-guide)
10. [Troubleshooting](#troubleshooting)

## Project Overview

The Credit Card Fraud Detection Application is a full-stack web application that allows users to:
- Test different machine learning models (Logistic Regression, Random Forest, SVM)
- Input transaction features and receive real-time fraud predictions
- Compare model performance metrics and visualizations
- Track prediction history

**Tech Stack:**
- **Frontend:** React 19, TypeScript, Tailwind CSS 4, Recharts
- **Backend:** Express.js, tRPC, Node.js
- **Database:** MySQL/TiDB
- **ML Models:** scikit-learn (Logistic Regression, Random Forest, SVM)
- **Build Tool:** Vite, esbuild
- **Testing:** Vitest

## Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- pnpm package manager (`npm install -g pnpm`)
- Git installed
- A MySQL/TiDB database (for production)
- An account on your chosen deployment platform (Railway, Vercel, or Heroku)

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd ccf_model_app

# Install dependencies
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/ccf_model_app"

# OAuth (Manus)
VITE_APP_ID="your-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://portal.manus.im"

# JWT
JWT_SECRET="your-jwt-secret-key"

# Owner Info
OWNER_NAME="Your Name"
OWNER_OPEN_ID="your-open-id"

# API Keys (if using Manus services)
BUILT_IN_FORGE_API_KEY="your-api-key"
BUILT_IN_FORGE_API_URL="https://api.manus.im"
VITE_FRONTEND_FORGE_API_KEY="your-frontend-api-key"
VITE_FRONTEND_FORGE_API_URL="https://api.manus.im"

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT="https://analytics.example.com"
VITE_ANALYTICS_WEBSITE_ID="your-website-id"
```

### 3. Set Up Database

```bash
# Push database schema
pnpm db:push

# Run tests
pnpm test
```

### 4. Start Development Server

```bash
# Terminal 1: Start backend
pnpm dev

# Terminal 2: In another terminal, the dev server handles both frontend and backend
# Access at http://localhost:3000
```

### 5. Build for Production

```bash
pnpm build
```

## Deployment on Railway

Railway is recommended for its simplicity and built-in database support.

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### Step 2: Connect GitHub Repository
1. Click "New" → "GitHub Repo"
2. Select your repository
3. Railway will auto-detect the Node.js project

### Step 3: Add MySQL Database
1. In Railway dashboard, click "Add Service"
2. Select "MySQL"
3. Railway will automatically set `DATABASE_URL`

### Step 4: Configure Environment Variables
1. Go to Variables tab
2. Add all environment variables from `.env.local`
3. Important: Set `NODE_ENV=production`

### Step 5: Deploy
1. Railway auto-deploys on git push
2. Monitor deployment in the "Deployments" tab
3. Your app will be available at the provided Railway URL

### Step 6: Run Migrations
1. In Railway, open the terminal
2. Run: `pnpm db:push`

## Deployment on Vercel

Vercel is ideal for frontend-focused deployments but requires separate backend hosting.

### Option A: Full Stack on Vercel (Recommended)

### Step 1: Prepare Project
```bash
# Ensure build is optimized
pnpm build
```

### Step 2: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository

### Step 3: Configure Build Settings
- **Build Command:** `pnpm build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

### Step 4: Add Environment Variables
1. Go to Settings → Environment Variables
2. Add all variables from `.env.local`
3. Apply to Production, Preview, and Development

### Step 5: Add Database
1. Use Vercel's Postgres or connect external MySQL
2. Set `DATABASE_URL` environment variable

### Step 6: Deploy
1. Click "Deploy"
2. Vercel will build and deploy automatically

**Note:** Vercel's serverless functions have limitations. For better performance, consider using Railway or Heroku for the backend.

## Deployment on Heroku

### Step 1: Create Heroku Account
1. Go to [heroku.com](https://www.heroku.com)
2. Sign up
3. Create a new app

### Step 2: Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

### Step 3: Connect to Heroku
```bash
heroku login
heroku git:remote -a your-app-name
```

### Step 4: Add MySQL Database
```bash
# Add ClearDB MySQL addon
heroku addons:create cleardb:ignite

# Get database URL
heroku config | grep CLEARDB_DATABASE_URL
```

### Step 5: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="your-secret"
heroku config:set VITE_APP_ID="your-app-id"
# ... set all other variables
```

### Step 6: Deploy
```bash
git push heroku main
```

### Step 7: Run Migrations
```bash
heroku run pnpm db:push
```

## Environment Variables

### Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host:3306/db` |
| `NODE_ENV` | Environment | `production` |
| `JWT_SECRET` | Session signing key | `your-secret-key` |

### OAuth Variables (if using Manus)
| Variable | Description |
|----------|-------------|
| `VITE_APP_ID` | Manus OAuth app ID |
| `OAUTH_SERVER_URL` | Manus OAuth server URL |
| `VITE_OAUTH_PORTAL_URL` | Manus login portal URL |

### Optional Variables
| Variable | Description |
|----------|-------------|
| `VITE_ANALYTICS_ENDPOINT` | Analytics service endpoint |
| `VITE_ANALYTICS_WEBSITE_ID` | Analytics website ID |

## Database Setup

### MySQL Connection String Format
```
mysql://username:password@host:port/database_name
```

### Example for Different Platforms

**Railway:**
```
mysql://root:password@containers-us-west-xyz.railway.app:3306/railway
```

**Heroku ClearDB:**
```
mysql://user:password@us-cdbr-east-05.cleardb.net/heroku_db
```

**Local Development:**
```
mysql://root:password@localhost:3306/ccf_model_app
```

## Usage Guide

### 1. Access the Application
- Navigate to your deployed URL
- Click "Sign In" to authenticate (if OAuth is configured)
- Or click "Launch Application" to access the fraud detection tool

### 2. Using the Fraud Detection Tool

#### Select a Model
- Use the dropdown to choose between:
  - **Logistic Regression:** Fast, interpretable, good baseline
  - **Random Forest:** Best performance (87% F1-Score), recommended
  - **Support Vector Machine:** High recall, good for catching fraud

#### Enter Transaction Features
- Fill in the 15 feature fields:
  - `Time`: Transaction timestamp
  - `Amount`: Transaction amount
  - `V1-V28`: Anonymized PCA features
- Use realistic values for accurate predictions

#### Get Prediction
- Click "Check for Fraud"
- View result: **FRAUD** or **LEGITIMATE** with confidence %
- See model performance metrics on the right panel

#### Compare Models
- Scroll down to see the comparison table
- View visualizations showing F1-Score, AUPRC, and other metrics

### 3. Model Performance Reference

| Model | F1-Score | AUPRC | Precision | Recall |
|-------|----------|-------|-----------|--------|
| Logistic Regression | 10.56% | 71.53% | 5.6% | 91.84% |
| **Random Forest** | **87.01%** | **88.46%** | **97.47%** | **78.57%** |
| SVM | 0.81% | 64.34% | 0.41% | 90.82% |

## Troubleshooting

### Database Connection Issues

**Error: "ECONNREFUSED"**
```bash
# Check database URL format
echo $DATABASE_URL

# Test connection
mysql -h host -u user -p database_name
```

**Error: "Access denied for user"**
- Verify username and password in DATABASE_URL
- Check database user permissions

### Build Errors

**Error: "Cannot find module"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Error: "TypeScript errors"**
```bash
# Check for type errors
pnpm check

# Fix errors
pnpm format
```

### Deployment Issues

**Railway: Build fails**
- Check build logs: `railway logs`
- Ensure `pnpm` is available: Add `RAILWAY_DOCKERFILE_PATH` if needed

**Vercel: Timeout errors**
- Increase timeout in `vercel.json`:
```json
{
  "functions": {
    "api/**": {
      "maxDuration": 60
    }
  }
}
```

**Heroku: Slug size too large**
```bash
# Remove unnecessary files
echo "node_modules/" >> .gitignore
echo "dist/" >> .gitignore
git rm -r --cached node_modules dist
git commit -m "Remove large directories"
git push heroku main
```

### ML Model Issues

**Error: "Model not found"**
- Ensure model files are in `server/models/` directory
- Check file permissions: `ls -la server/models/`

**Predictions always return same result**
- Verify model files are correctly loaded
- Check `server/ml.ts` for model loading logic

## Performance Optimization

### Frontend Optimization
```bash
# Build with optimization
pnpm build

# Analyze bundle size
npm install -g vite-plugin-visualizer
```

### Backend Optimization
- Use connection pooling for database
- Cache model metrics in memory
- Implement rate limiting for predictions

### Database Optimization
```sql
-- Create indexes for faster queries
CREATE INDEX idx_user_id ON fraudPredictions(userId);
CREATE INDEX idx_created_at ON fraudPredictions(createdAt);
```

## Monitoring and Logging

### Railway
- View logs: Dashboard → Deployments → Logs
- Set up alerts in Settings

### Vercel
- View logs: Deployments → Logs
- Real-time monitoring dashboard

### Heroku
```bash
heroku logs --tail
heroku logs --source app
heroku logs --source heroku
```

## Support and Resources

- **Documentation:** See README.md in project root
- **Issues:** Check GitHub Issues
- **ML Models:** Trained on Credit Card Fraud Detection dataset
- **Framework Docs:** [tRPC](https://trpc.io), [React](https://react.dev), [Express](https://expressjs.com)

## Security Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Use HTTPS for all connections
- [ ] Enable database SSL/TLS
- [ ] Set up rate limiting
- [ ] Keep dependencies updated: `pnpm update`
- [ ] Use environment variables for all secrets
- [ ] Enable CORS only for trusted domains
- [ ] Implement input validation
- [ ] Set up monitoring and alerts

---

**Last Updated:** December 2025
**Version:** 1.0.0
