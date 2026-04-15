This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
kamus-kpi
├─ .sixth
│  └─ skills
├─ app
│  ├─ (dashboard)
│  │  ├─ admin
│  │  │  ├─ karyawan
│  │  │  │  └─ page.jsx
│  │  │  ├─ monitoring
│  │  │  │  └─ page.jsx
│  │  │  ├─ page.jsx
│  │  │  └─ rekap
│  │  │     └─ page.jsx
│  │  ├─ key-partner
│  │  │  ├─ kamus
│  │  │  │  └─ page.jsx
│  │  │  ├─ page.jsx
│  │  │  ├─ rekap
│  │  │  │  └─ page.jsx
│  │  │  └─ review
│  │  │     └─ page.jsx
│  │  ├─ layout.jsx
│  │  ├─ manajemen
│  │  │  ├─ approval
│  │  │  │  └─ page.jsx
│  │  │  └─ page.jsx
│  │  └─ user
│  │     ├─ kamus
│  │     │  └─ page.jsx
│  │     ├─ page.jsx
│  │     └─ rekap
│  │        └─ page.jsx
│  ├─ api
│  │  ├─ auth
│  │  │  ├─ login
│  │  │  │  └─ route.js
│  │  │  └─ recovery
│  │  │     └─ route.js
│  │  ├─ kamus
│  │  │  ├─ route.js
│  │  │  └─ [id]
│  │  │     ├─ export
│  │  │     │  └─ route.js
│  │  │     └─ route.js
│  │  ├─ karyawan
│  │  │  ├─ route.js
│  │  │  └─ [id]
│  │  │     └─ route.js
│  │  ├─ notifikasi
│  │  ├─ rekap
│  │  │  └─ route.js
│  │  └─ stats
│  │     └─ departemen
│  │        └─ route.js
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ login
│  │  └─ page.jsx
│  └─ page.tsx
├─ components
│  ├─ layout
│  │  ├─ Header.jsx
│  │  └─ Sidebar.jsx
│  ├─ tables
│  │  └─ KamusTable.jsx
│  └─ ui
│     ├─ Badge.jsx
│     ├─ Button.jsx
│     ├─ FormComponents.jsx
│     ├─ Input.jsx
│     ├─ Select.jsx
│     ├─ Skeleton.jsx
│     └─ StatCard.jsx
├─ data
│  ├─ Home.png
│  └─ logopkt.png
├─ eslint.config.mjs
├─ import
│  └─ route.js
├─ lib
│  ├─ auth.js
│  ├─ db.js
│  └─ utils.js
├─ middleware.js
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ scripts
│  └─ import-karyawan.js
├─ tailwind.config.ts
└─ tsconfig.json

```