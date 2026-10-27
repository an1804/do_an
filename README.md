# TechStore

Website thương mại điện tử đồ công nghệ (hệ thống gợi ý sản phẩm làm sau).

## Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Axios
- Backend: Spring Boot 3.5, Java 21, Spring Security, JPA
- Database: PostgreSQL

## Chạy frontend

```powershell
cd E:\do_an\frontend
npm install
npm run dev
```

http://localhost:3000

## Chạy backend

TechStore dùng Postgres riêng: container `techstoredb`, máy host port **5433**.

Tạo database Docker (một lần):

```powershell
docker run --name techstoredb -e POSTGRES_DB=techstoredb -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=TechStoreDb@2026 -e TZ=UTC -p 5433:5432 -d postgres
```

Nếu container đã có:

```powershell
docker start techstoredb
```

```powershell
cd E:\do_an\backend
copy src\main\resources\application.properties.example src\main\resources\application.properties
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.jvmArguments=-Duser.timezone=UTC"
```

http://localhost:8081/api/health

TechStore dùng cổng **8081** (không dùng 8080 — cổng đó thường bị chiếm).
Nếu báo `Port 8081 was already in use` thì backend **đã chạy**, chỉ việc mở link trên, **đừng** gõ `spring-boot:run` lần nữa.

Tài khoản seed:

- Admin: `admin@techstore.local` / `Admin@123`
- Seller: `seller@techstore.local` / `Seller@123`
