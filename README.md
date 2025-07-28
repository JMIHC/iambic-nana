# Iambic Nana

A poetry and tiny books website by Susan Engle, built with React Router v7, TypeScript, and Tailwind CSS.

## Features

- 🚀 Server-side rendering with React Router v7
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization with Vite
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📚 Tiny books e-commerce with Stripe payments
- 📊 Poem view tracking with Upstash Redis
- 🔍 Full-text search functionality
- 📱 Responsive design
- 🌙 Dark mode support

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

For local testing with Netlify functions:

```bash
npm run netlify
```

## Environment Setup

This application requires several environment variables for full functionality. Copy the `.env` file to `.env.local` and configure the following services:

```bash
cp .env .env.local
```

### Required Environment Variables

| Variable                   | Required For    | Description                                 |
| -------------------------- | --------------- | ------------------------------------------- |
| `UPSTASH_REDIS_REST_URL`   | Runtime         | Redis database URL for view tracking        |
| `UPSTASH_REDIS_REST_TOKEN` | Runtime         | Redis database token                        |
| `STRIPE_PUBLIC_KEY`        | Build + Runtime | Stripe publishable key (embedded in client) |
| `STRIPE_SECRET_KEY`        | Runtime         | Stripe secret key (functions only)          |

### 1. Upstash Redis Setup (View Tracking)

Used for tracking poem views and generating popular poems lists.

1. **Create Account**: Go to [Upstash Console](https://console.upstash.com/redis)
2. **Create Database**:
   - Name: `iambic-nana-views`
   - Region: Choose closest to your users
   - Tier: Free (10K requests/day, 256MB storage)
3. **Get Credentials**: From database details page, copy:
   - REST URL → `UPSTASH_REDIS_REST_URL`
   - REST Token → `UPSTASH_REDIS_REST_TOKEN`

### 2. Stripe Setup (Payments)

Used for tiny books e-commerce functionality.

1. **Create Account**: Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. **Get API Keys**: From Developers → API keys:
   - **For Development**: Use test keys (start with `pk_test_` and `sk_test_`)
   - **For Production**: Use live keys (start with `pk_live_` and `sk_live_`)
3. **Configure Variables**:
   - Publishable key → `STRIPE_PUBLIC_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

**⚠️ Security Note**: Never commit your actual API keys to version control. The `VITE_` prefix exposes variables to the client, so only use publishable keys there.

### 3. Local Development Setup

1. Copy environment template:

   ```bash
   cp .env .env.local
   ```

2. Edit `.env.local` with your actual values:

   ```bash
   UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-redis-token
   STRIPE_PUBLIC_KEY=pk_test_your-public-key
   STRIPE_SECRET_KEY=sk_test_your-secret-key
   ```

3. Install dependencies and start development:
   ```bash
   npm install
   npm run dev
   ```

### 4. Production Deployment (Netlify)

1. **Set Environment Variables** in Netlify dashboard:
   - Site settings → Environment variables
   - Add all four variables with production values
2. **Deploy Configuration**:
   - Build command: `npm run build` (configured in `netlify.toml`)
   - Publish directory: `build/client`
   - Functions directory: `netlify/functions`

### Build vs Runtime Requirements

**Build Time** (needed during `npm run build`):

- `STRIPE_PUBLIC_KEY` - Embedded into client bundle

**Runtime** (needed when app is running):

- `UPSTASH_REDIS_REST_URL` - View tracking
- `UPSTASH_REDIS_REST_TOKEN` - View tracking
- `STRIPE_SECRET_KEY` - Payment processing (functions only)
- `STRIPE_PUBLIC_KEY` - Client-side Stripe integration

**Graceful Degradation**: The app will work without these services but with reduced functionality:

- Without Redis: No view tracking or popular poems
- Without Stripe: Tiny books display but no purchasing

## Building for Production

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

### Netlify (Recommended)

This project is optimized for Netlify deployment with the included `netlify.toml` configuration.

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Configure Environment Variables**: Add all required environment variables in Site settings
3. **Deploy**: Netlify will automatically build and deploy using the configuration in `netlify.toml`

Build settings (automatically configured):

- Build command: `npm run build`
- Publish directory: `build/client`
- Functions directory: `netlify/functions`

### Other Deployment Options

#### Docker Deployment

```bash
docker build -t iambic-nana .
docker run -p 3000:3000 iambic-nana
```

#### Static Hosting

For static hosting platforms, use the `build/client` directory after running `npm run build`. Note that server-side features (functions) won't work on static hosting.

#### Self-Hosted

Deploy the full build output including server files:

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
