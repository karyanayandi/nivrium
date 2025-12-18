# Nivrium - Shopify Headless Storefront

A modern, high-performance headless Shopify storefront built with Astro, React, and TailwindCSS.

## Quick Install

```bash
cd nivrium
bun install
cp .env.example .env
# Edit .env with your Shopify credentials
bun run dev
```

## Prerequisites

- Shopify store with Storefront API access
- Node.js 18+ or Bun installed
- Products set up in Shopify admin

## Shopify Store Setup

### 1. Create a Storefront API Access Token

1. Log in to your Shopify admin
2. Go to **Settings** → **Apps and sales channels**
3. Click **Develop apps**
4. Click **Create an app** and give it a name (e.g., "Headless Storefront")
5. Click **Configure Storefront API scopes**
6. Enable the following scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
7. Click **Save** and then **Install app**
8. Copy the **Storefront API access token**

### 2. Set Up Your Product

1. Create a product in Shopify admin (e.g., "Hydrocolloid Treatment")
2. Add variants for different quantities (e.g., "1 Roll", "2 Rolls", "3 Rolls")
3. Set prices and compare-at prices for each variant
4. Add product images
5. Note the product handle (found in the URL: `/products/your-product-handle`)

### 3. Optional: Set Up Free Gift Products

1. Create separate products for free gifts
2. Tag them with `free-gift` in Shopify admin
3. These will automatically appear as conditional gifts

## Installation

```bash
git clone <repository-url>
cd nivrium
bun install
cp .env.example .env
```

Update `.env` with your Shopify credentials:

```env
PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token

PUBLIC_BRAND_NAME=Nivrium
SHOPIFY_PRODUCT_HANDLE=hydrocolloid-treatment

PUBLIC_SITE_TITLE=Nivrium - Premium Hydrocolloid Treatment
PUBLIC_SITE_DESCRIPTION=Get clearer, smoother, and acne-free skin overnight.
PUBLIC_SITE_URL=https://nivrium.com
PUBLIC_OG_IMAGE=/og-image.png

PUBLIC_HERO_TITLE=Get Clearer, Smoother, and Acne Free Skin Overnight.
PUBLIC_HERO_SUBTITLE=Are you ready to look your best? Try our premium hydrocolloid treatment.
PUBLIC_GUARANTEE_DAYS=90
PUBLIC_PRODUCT_RATING=4.9
PUBLIC_REVIEW_COUNT=1842

PUBLIC_SALE_BANNER_TEXT=

PUBLIC_TWITTER_HANDLE=@nivrium
PUBLIC_FACEBOOK_URL=https://facebook.com/nivrium
PUBLIC_INSTAGRAM_HANDLE=@nivrium
```

## Environment Variables

### Required

- `PUBLIC_SHOPIFY_STORE_DOMAIN` - Your Shopify store domain (e.g., `store.myshopify.com`)
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` - Storefront API access token from Shopify
- `PUBLIC_BRAND_NAME` - Your brand name (displayed in header and metadata)
- `SHOPIFY_PRODUCT_HANDLE` - The handle of your main product

### Optional (with defaults)

- `PUBLIC_SITE_TITLE` - Browser title and OG title
- `PUBLIC_SITE_DESCRIPTION` - Meta description
- `PUBLIC_SITE_URL` - Canonical URL for SEO
- `PUBLIC_OG_IMAGE` - Open Graph image path
- `PUBLIC_HERO_TITLE` - Hero section headline
- `PUBLIC_HERO_SUBTITLE` - Hero section subheadline
- `PUBLIC_GUARANTEE_DAYS` - Money-back guarantee period (default: 90)
- `PUBLIC_PRODUCT_RATING` - Product star rating (default: 4.9)
- `PUBLIC_REVIEW_COUNT` - Number of reviews (default: 1842)
- `PUBLIC_SALE_BANNER_TEXT` - Optional sale banner text (leave empty to hide)
- Social media handles for footer and meta tags

## Development

```bash
bun run dev
```

Site available at `http://localhost:3000`

## Usage

```bash
bun run dev      # Start development server
bun run build    # Build for production
bun run preview  # Preview production build
```

## Building for Production

```bash
bun run build
bun run preview
```

## Deployment

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Set environment variables when prompted or in Vercel dashboard.

### Other Platforms

This site can also be deployed to:

- Netlify
- Cloudflare Pages
- AWS Amplify

Make sure to set all required environment variables in your hosting provider's dashboard.

## Project Structure

```
src/
├── components/
│   ├── astro/          # Astro components (Hero, Features, etc.)
│   └── react/          # React components (Header, Cart, Product)
├── contexts/
│   └── CartContext.tsx # Shopping cart state management
├── layouts/
│   └── BaseLayout.astro # Base HTML layout with SEO
├── lib/
│   ├── env.ts          # Environment variable configuration
│   └── shopify/        # Shopify API client and queries
│       ├── client.ts
│       ├── products.ts
│       ├── types.ts
│       └── queries/
│           ├── cart.ts
│           └── product.ts
├── pages/
│   └── index.astro     # Home page
├── styles/
│   └── global.css      # Global styles and Tailwind
└── types.ts            # TypeScript type definitions
```

## How It Works

### Product Data Flow

1. At build time, Astro fetches product data from Shopify using the Storefront API
2. Product variants are transformed into pricing options
3. Static HTML is generated with real product data

### Cart Functionality

1. User selects a variant and clicks "Add to Cart"
2. CartContext creates or updates a Shopify cart via API
3. Cart ID is stored in localStorage for persistence
4. Cart sidebar displays items with quantity controls
5. Checkout redirects to Shopify's secure checkout

### Branding Customization

All branding elements are controlled via environment variables:

- Brand name
- Hero content
- SEO metadata
- Social links
- Sale banners

## Customization

### Changing the Brand

Update these environment variables:

- `PUBLIC_BRAND_NAME`
- `PUBLIC_SITE_TITLE`
- `PUBLIC_SITE_DESCRIPTION`
- Social media URLs

### Adding Products

To add more products:

1. Create products in Shopify admin
2. Update the code to fetch multiple products
3. Create product listing pages as needed

### Styling

- Global styles: `src/styles/global.css`
- TailwindCSS configuration: `tailwind.config.js`
- Component-specific styles: inline Tailwind classes

## Troubleshooting

### Build Fails with "Product not found"

- Verify `SHOPIFY_PRODUCT_HANDLE` matches your product handle in Shopify
- Ensure the product is published and active

### "Missing required environment variable"

- Check that all required env vars are set
- Restart the dev server after changing `.env`

### Cart Not Working

- Verify Storefront API token has cart write permissions
- Check browser console for API errors
- Clear localStorage and try again

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run check` - Run Astro checks
- `bun run lint` - Run ESLint
- `bun run typecheck` - Run TypeScript compiler
- `bun run format:check` - Check code formatting
- `bun run format:write` - Format code with Prettier
