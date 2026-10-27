'use client'

import { useState } from 'react'

export default function BuyButton() {
  const [message, setMessage] = useState('')

  return (
    <div>
      <button
        type="button"
        onClick={() => setMessage('Giỏ hàng sẽ làm sau khi có backend catalog.')}
        className="h-11 w-full rounded-md bg-sale font-display text-sm font-semibold text-on-sale hover:opacity-90"
      >
        Mua ngay
      </button>
      {message ? <p className="mt-2 text-sm text-on-surface-variant">{message}</p> : null}
    </div>
  )
}
