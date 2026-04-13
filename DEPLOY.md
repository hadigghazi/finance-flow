# Deployment Checklist

## 1. GitHub

Create a repository, then push this project:

```bash
git init
git add .
git commit -m "Initial deploy-ready finance tracker"
git branch -M main
git remote add origin https://github.com/hadigghazi/finance-flow.git
git push -u origin main
```

## 2. MongoDB Atlas

1. Create a free Atlas project and free cluster.
2. Create a database user.
3. In Atlas Network Access, allow the IP range you want to use for Vercel access.
4. Copy the driver connection string and set the database name to `finance-flow`.

Example:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/finance-flow?retryWrites=true&w=majority
FINANCE_PROFILE_KEY=default
```

## 3. Vercel

1. Log in to Vercel.
2. Import the GitHub repository.
3. Add:
   - `MONGODB_URI`
   - `FINANCE_PROFILE_KEY`
4. Deploy.

## 4. Cloudflare

1. In Vercel, add the custom domain `finances.hadighazi.com`.
2. Vercel will show the DNS target you need.
3. In Cloudflare DNS, create the matching record for `finances`.
4. Wait for the domain to verify in Vercel.
