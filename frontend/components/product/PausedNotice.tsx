import Link from 'next/link'

export default function PausedNotice({ title }: { title: string }) {
  return (
    <div className="mt-5 flex w-full flex-col items-center justify-center rounded-lg bg-white px-6 py-20 text-center">
      <h1 className="font-header text-[24px] font-bold leading-9 text-[#252A31]">{title}</h1>
      <p className="mt-3 font-header text-[16px] text-on-surface-variant">Tạm thời ngưng kinh doanh</p>
      <Link
        href="/"
        className="mt-6 flex h-11 cursor-pointer items-center rounded-lg bg-buy-link px-8 font-header text-[14px] font-medium text-white hover:bg-buy-link/90"
      >
        Về trang chủ
      </Link>
    </div>
  )
}
