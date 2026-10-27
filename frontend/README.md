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

Backend chưa có. `NEXT_PUBLIC_API_URL` để trống để sau này gọi API qua proxy `/api` → `http://localhost:8080`.
