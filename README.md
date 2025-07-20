# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

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

## Environment Setup

### Upstash Redis Configuration

This application uses Upstash Redis for poem view tracking. You'll need to set up a free Upstash Redis account to enable view counting functionality.

#### 1. Create an Upstash Account

1. Go to [Upstash Console](https://console.upstash.com/redis)
2. Sign up for a free account (no credit card required)
3. The free tier includes:
   - 10,000 requests per day
   - 256 MB storage
   - Perfect for view tracking needs

#### 2. Create a Redis Database

1. Click "Create Database" in the Upstash dashboard
2. Choose a name (e.g., "iambic-nana-views")
3. Select a region close to your users
4. Choose "Free" tier
5. Click "Create"

#### 3. Get Your Credentials

1. Click on your newly created database
2. Copy the following values:
   - **UPSTASH_REDIS_REST_URL**: Found in the "REST API" section
   - **UPSTASH_REDIS_REST_TOKEN**: Found in the "REST API" section

#### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and replace the placeholder values with your actual Upstash credentials:

```bash
UPSTASH_REDIS_REST_URL=https://your-actual-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-actual-redis-token
```

#### 5. Production Deployment (Netlify)

For production deployment on Netlify:

1. Go to your Netlify dashboard
2. Navigate to Site settings → Environment variables
3. Add the following environment variables:
   - `UPSTASH_REDIS_REST_URL`: Your Upstash Redis REST URL
   - `UPSTASH_REDIS_REST_TOKEN`: Your Upstash Redis REST Token
4. Redeploy your site for the changes to take effect

**Note**: The view tracking feature will gracefully degrade if Redis is not configured - poems will still display but without view counts.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
