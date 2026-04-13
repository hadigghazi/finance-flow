# Finance Flow

A mobile-first personal finance tracker built with Next.js, MongoDB, and Recharts.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set `MONGODB_URI`.
3. Run `npm install`.
4. Run `npm run dev`.

The app expects these environment variables:

- `MONGODB_URI`
- `FINANCE_PROFILE_KEY`

## Production stack

- Frontend and API: Vercel
- Database: MongoDB Atlas
- DNS: Cloudflare
- Planned public URL: `finances.hadighazi.com`

## Atlas notes

Use a connection string that includes the database name, for example:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER_URL/finance-flow?retryWrites=true&w=majority
FINANCE_PROFILE_KEY=default
```

## Vercel environment variables

Add these in the Vercel project settings:

- `MONGODB_URI`
- `FINANCE_PROFILE_KEY`

## Deploy flow

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Create a free MongoDB Atlas cluster.
4. Add the Atlas connection string to Vercel.
5. Add `finances.hadighazi.com` to the Vercel project.
6. Point the Cloudflare DNS record to the Vercel target shown in the Vercel domain settings.
