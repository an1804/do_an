'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ACCENT = '#4285DE'

export default function AuthPromptModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const go = (path: string) => {
    onClose()
    router.push(path)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Đóng"
        onClick={onClose}
        className="absolute inset-0 bg-[#1A1A1A]/45 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-prompt-title"
        className="relative w-full max-w-[560px] rounded-2xl bg-white px-5 pb-6 pt-5 text-center shadow-card"
      >
        <button
          type="button"
          aria-label="Đóng"
          onClick={onClose}
          className="absolute right-4 top-3 z-10 cursor-pointer text-2xl leading-none text-[#9AA0A6]"
        >
          ×
        </button>
        <h2 id="auth-prompt-title" className="font-header text-[28px] font-extrabold" style={{ color: ACCENT }}>
          Thành viên
        </h2>
        <div className="relative mx-auto mt-2 aspect-[5/3] w-full max-w-[520px]">
          <Image
            src="/auth/login-mascot-v2.png"
            alt=""
            width={1000}
            height={600}
            className="h-full w-full object-contain"
            sizes="520px"
            unoptimized
            priority
          />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 px-2">
          <button
            type="button"
            onClick={() => go('/register')}
            className="h-12 cursor-pointer rounded-full border-2 font-header text-[16px] font-semibold"
            style={{ borderColor: ACCENT, color: ACCENT }}
          >
            Đăng ký
          </button>
          <button
            type="button"
            onClick={() => go('/login')}
            className="h-12 cursor-pointer rounded-full font-header text-[16px] font-semibold text-white"
            style={{ backgroundColor: ACCENT }}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  )
}
