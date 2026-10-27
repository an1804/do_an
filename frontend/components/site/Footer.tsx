export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-inverse-on-surface">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 text-sm sm:grid-cols-3">
        <div>
          <p className="font-display text-base font-extrabold text-primary">TechStore</p>
          <p className="mt-2 text-white/70">Cửa hàng điện thoại, laptop và phụ kiện.</p>
        </div>
        <div>
          <p className="font-display font-semibold">Hỗ trợ</p>
          <p className="mt-2 text-white/70">Hotline: 1800 0000</p>
          <p className="text-white/70">Tư vấn miễn phí</p>
        </div>
        <div>
          <p className="font-display font-semibold">Chính sách</p>
          <p className="mt-2 text-white/70">Đổi trả 15 ngày</p>
          <p className="text-white/70">Bảo hành chính hãng</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} TechStore. Thiết kế lấy cảm hứng siêu thị điện máy, không thuộc MWG.
      </div>
    </footer>
  )
}
