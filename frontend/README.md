# TechStore frontend

Next.js 16 + React 19 + Tailwind CSS v4.

## Chạy local

```powershell
cd E:\do_an\frontend
copy .env.local.example .env.local
npm install
npm run dev
```

Mở http://localhost:3000

`NEXT_PUBLIC_API_URL` để trống: browser gọi `/api` rồi Next rewrite sang `http://localhost:8081`. Server component gọi thẳng backend `8081`.
