---
name: TechStore
description: Design system for TechStore — thương mại điện tử đồ công nghệ, lấy cảm hứng nhận diện bán lẻ Thế Giới Di Động (vàng #FFD400 + đen), không sao chép logo hay thương hiệu MWG
colors:
  surface: "#F5F5F5"
  surface-dim: "#EEEEEE"
  surface-bright: "#FFFFFF"
  surface-container-lowest: "#FFFFFF"
  surface-container-low: "#FAFAFA"
  surface-container: "#F5F5F5"
  surface-container-high: "#EEEEEE"
  surface-container-highest: "#E0E0E0"
  on-surface: "#1A1A1A"
  on-surface-variant: "#4A4A4A"
  inverse-surface: "#1A1A1A"
  inverse-on-surface: "#FFFFFF"
  outline: "#DDDDDD"
  outline-variant: "#EEEEEE"
  surface-tint: "#FFD400"
  primary: "#FFD400"
  on-primary: "#1A1A1A"
  primary-hover: "#F0C400"
  primary-container: "#FFF6C2"
  on-primary-container: "#3D3200"
  inverse-primary: "#FFD400"
  secondary: "#1A1A1A"
  on-secondary: "#FFFFFF"
  secondary-container: "#333333"
  on-secondary-container: "#F5F5F5"
  tertiary: "#E31C25"
  on-tertiary: "#FFFFFF"
  tertiary-container: "#FFE8E8"
  on-tertiary-container: "#7A0C12"
  error: "#E31C25"
  on-error: "#FFFFFF"
  error-container: "#FFE8E8"
  on-error-container: "#7A0C12"
  sale: "#E31C25"
  on-sale: "#FFFFFF"
  primary-fixed: "#FFF6C2"
  primary-fixed-dim: "#FFE566"
  on-primary-fixed: "#1A1A1A"
  on-primary-fixed-variant: "#3D3200"
  secondary-fixed: "#4A4A4A"
  secondary-fixed-dim: "#333333"
  on-secondary-fixed: "#FFFFFF"
  on-secondary-fixed-variant: "#F5F5F5"
  background: "#F5F5F5"
  on-background: "#1A1A1A"
  surface-variant: "#FAFAFA"
typography:
  display:
    fontFamily: Be Vietnam Pro
    fontSize: 40px
    fontWeight: "800"
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: "700"
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 22px
    fontWeight: "700"
    lineHeight: 28px
  title-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: "700"
    lineHeight: 24px
  body-lg:
    fontFamily: Roboto
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-md:
    fontFamily: Roboto
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 22px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.5rem
  lg: 0.75rem
  xl: 1rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin: 16px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  button-buy:
    backgroundColor: "{colors.sale}"
    textColor: "{colors.on-sale}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 12px
    height: 44px
  card:
    backgroundColor: "{colors.surface-container-lowest}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  card-product:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"
  input-field:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 10px
  nav-header:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    padding: "{spacing.sm}"
  nav-footer:
    backgroundColor: "{colors.inverse-surface}"
    textColor: "{colors.inverse-on-surface}"
    padding: "{spacing.lg}"
  badge-sale:
    backgroundColor: "{colors.sale}"
    textColor: "{colors.on-sale}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.sm}"
    padding: 4px
  price:
    backgroundColor: transparent
    textColor: "{colors.sale}"
    typography: "{typography.title-lg}"
---

## Brand & Style

TechStore bán điện thoại, laptop, tai nghe và phụ kiện. Cảm giác cần đạt: **siêu thị điện máy Việt Nam** — vàng nổi, đen chắc, giá đỏ, tìm kiếm ngay trên header.

Phong cách lấy cảm hứng **Thế Giới Di Động / MWG**: vàng `#FFD400` + đen `#1A1A1A`. Đây **không** phải bản sao thương hiệu MWG. Không dùng logo người trong vòng tròn, không dùng chữ thegioididong.com.

Vàng cho thanh điều hướng và CTA phụ. Đen cho chữ, footer, logo. Đỏ `#E31C25` cho giá khuyến mãi và nút Mua ngay.

## Colors

- **Primary (Retail Yellow #FFD400):** Header toàn rộng, nút Đăng ký / Tìm kiếm. Chữ trên vàng **luôn đen** (`on-primary`), không trắng.
- **Secondary (Ink Black #1A1A1A):** Logo, nav trên header, footer.
- **Sale / Tertiary (Promo Red #E31C25):** Giá giảm, badge `-X%`, nút Mua ngay. Không dùng vàng cho giá.
- **Neutral (Retail Gray #F5F5F5):** Nền trang. Card trắng nổi, viền `#DDDDDD`.
- **Link on white:** đen hoặc đỏ — **không** chữ vàng trên nền trắng (contrast kém).

## Typography

- **Inter 14px** — chữ trên header (danh mục, Đăng nhập / Voucher / Giỏ hàng, ô tìm). Màu `#111827`.
- **Inter 24px / 700 / `#252A31` / line-height 36px** — tiêu đề khối Khuyến mãi online.
- **Be Vietnam Pro** — logo, tiêu đề, nút, giá. Đậm, gần khách Việt.
- **Roboto** — mô tả sản phẩm, form, footer (gần font site bán lẻ điện máy).

Quy tắc:
- Tên sản phẩm: `title-lg`, tối đa 2 dòng
- Giá: `title-lg` + `text-sale`, không gạch dưới
- Label form: `label-sm`

## Layout & Spacing

Desktop max **1200px** (gần layout thegioididong). Dày thông tin hơn BandHub — bán lẻ, không “luxury whitespace”.

| Vùng | Quy tắc |
|------|---------|
| Promo bar | Dải vàng trên header, không sticky; campaign TechStore, không copy slogan MWG |
| Header | Sticky, nền `primary`; logo + ô tìm trắng + Đăng nhập + Voucher + Giỏ hàng. Danh mục luôn hiện, không ẩn khi scroll |
| Category strip | Icon + chữ trên vàng, cố định cùng header |
| Home | Ngay dưới header: banner 1200×240 (`aspect 5/1`, `rounded-8px`, `object-contain`), tự chuyển ảnh; rồi tiêu đề Khuyến mãi online (Inter 24/700) ngoài hộp. Hộp trắng 1200×994, `rounded-16px`, `overflow-hidden`, `mt-5`. Trong hộp: tab FLASH SALE GIÁ SỐC + danh mục chữ, khung giờ countdown, lưới 6×2, mũi tên. Không copy badge/logo MWG |
| Product card | Ảnh vuông, tên, giá đỏ, giá gốc gạch + `-%`, nút Mua ngay đỏ |
| Footer | Nền `inverse-surface`, chữ trắng/xám |

## Elevation & Depth

Ít shadow, nhiều **viền mỏng**. Siêu thị điện máy không dùng glassmorphism.

| Level | Dùng cho | Style |
|-------|----------|-------|
| 0 | Page | `#F5F5F5` |
| 1 | Card sản phẩm | Trắng + border `outline` |
| 2 | Dropdown, modal | `0 8px 24px rgba(0,0,0,0.12)` |

## Shapes

Góc **vừa phải**, hơi vuông hơn BandHub.

- Header search: `rounded-full`
- Button: `rounded-md` (0.5rem)
- Card: `rounded-md`
- Badge sale: `rounded-sm`

## Components

### Header (`nav-header`)

Nền vàng, chữ đen, sticky. Hàng trên: logo sát trái, ô tìm trắng pill (~380px), nhóm Đăng nhập / Voucher / Giỏ hàng sát phải. Hàng danh mục nhỏ, trải đều theo chiều ngang container 1200px. Không dùng sidebar tối kiểu dashboard BandHub cho storefront.

### Buttons

| Variant | Khi nào | Style |
|---------|---------|-------|
| Primary | Tìm kiếm, Đăng ký trên header | Vàng, chữ đen |
| Buy | Mua ngay, thêm giỏ | Đỏ, chữ trắng |
| Secondary | Hủy | Viền xám, chữ đen |

### Cards

- **card-product:** trắng, hover viền vàng 2px, giá `sale`
- Ảnh sản phẩm nền `#FAFAFA`

### Inputs

- Search trên header: trắng, `rounded-full`, không viền đậm
- Form login: trắng, border `outline`, focus ring vàng

### Footer (`nav-footer`)

Đen, nhóm Hotline / Chính sách / Danh mục. Không nền vàng.

## Do's and Don'ts

- **Do** header vàng full-width như siêu thị điện máy.
- **Do** giá màu đỏ, CTA mua màu đỏ.
- **Do** sync token giữa `DESIGN.md` và `frontend/app/globals.css`.
- **Don't** copy logo MWG / TGDD.
- **Don't** chữ vàng trên nền trắng.
- **Don't** dùng cam BandHub `#FF7518` hay xanh forest.
- **Don't** hardcode hex trong component nếu đã có token Tailwind.
