import Link from 'next/link'
import { CATEGORIES } from '@/lib/products'

export default function Footer() {
  return (
    <footer className="mt-5 bg-inverse-surface font-header text-inverse-on-surface">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-[24px] font-extrabold leading-9 text-primary">thegioicongnghe</p>
          <p className="mt-4 text-[14px] leading-6 text-white/70">
            Cửa hàng điện thoại, laptop và phụ kiện. Siêu thị điện máy trực tuyến.
          </p>
        </div>
        <div>
          <p className="text-[16px] font-bold leading-6">Hỗ trợ</p>
          <div className="mt-4 space-y-2 text-[14px] leading-6 text-white/70">
            <p>Hotline: 1800 0000</p>
            <p>8:00 – 21:30</p>
            <p>Tư vấn miễn phí</p>
          </div>
        </div>
        <div>
          <p className="text-[16px] font-bold leading-6">Chính sách</p>
          <div className="mt-4 space-y-2 text-[14px] leading-6 text-white/70">
            <p>Đổi trả 15 ngày</p>
            <p>Bảo hành chính hãng</p>
            <p>Giao hàng toàn quốc</p>
          </div>
        </div>
        <div>
          <p className="text-[16px] font-bold leading-6">Danh mục</p>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[14px] leading-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="text-white/70 hover:text-primary"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1200px] py-5 text-[13px] leading-5 text-white/50">
          © {new Date().getFullYear()} thegioicongnghe. Thiết kế lấy cảm hứng siêu thị điện máy, không thuộc MWG.
        </p>
      </div>
    </footer>
  )
}
