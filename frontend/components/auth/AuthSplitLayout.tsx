import type { ReactNode } from 'react'
import Image from 'next/image'
import ShopShell from '@/components/site/ShopShell'

export const AUTH_ACCENT = '#4285DE'

export default function AuthSplitLayout({ children }: { children: ReactNode }) {
  return (
    <ShopShell>
      <main className="flex flex-1 items-center justify-center bg-[#F3F5F7] px-4 py-12">
        <div className="flex w-full max-w-[980px] flex-col items-center justify-center gap-8 md:flex-row md:gap-14">
          <div className="h-[380px] w-[380px] shrink-0">
            <Image
              src="/auth/login-mascot.png"
              alt=""
              width={380}
              height={380}
              className="h-[380px] w-[380px] object-contain"
              unoptimized
              priority
            />
          </div>
          <div className="w-full max-w-[420px] rounded-2xl bg-white px-8 py-10 shadow-[0_10px_40px_rgba(17,24,39,0.08)]">
            {children}
          </div>
        </div>
      </main>
    </ShopShell>
  )
}
