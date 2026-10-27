export default function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-lowest">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-on-surface-variant">
        © {new Date().getFullYear()} TechStore — website thương mại điện tử đồ công nghệ.
      </div>
    </footer>
  )
}
