'use client'

import { useState } from 'react'
import { AuthFieldError, LockIcon } from '@/components/auth/AuthField'

export default function PasswordField({
  name,
  label,
  value,
  autoComplete,
  placeholder,
  error,
  onChange,
}: {
  name: string
  label?: string
  value: string
  autoComplete: string
  placeholder?: string
  error?: string
  onChange: (value: string) => void
}) {
  const [visible, setVisible] = useState(false)
  const hint = placeholder || label || 'Mật khẩu'

  return (
    <div>
      {label ? (
        <label className="sr-only" htmlFor={name}>
          {label}
        </label>
      ) : null}
      <div
        className={`flex h-12 items-center rounded-xl border bg-white px-3.5 ${
          error ? 'border-[#E31C25]' : 'border-[#E5E7EB] focus-within:border-[#4285DE]'
        }`}
      >
        <span className={`shrink-0 ${error ? 'text-[#E31C25]' : 'text-[#9CA3AF]'}`}>
          <LockIcon />
        </span>
        <input
          id={name}
          type={visible ? 'text' : 'password'}
          name={name}
          value={value}
          placeholder={hint}
          onChange={(event) => onChange(event.target.value)}
          className="ml-2.5 h-full min-w-0 flex-1 bg-transparent text-[15px] text-[#252A31] outline-none placeholder:text-[#9CA3AF]"
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="ml-2 shrink-0 cursor-pointer text-xs font-medium text-[#4285DE]"
        >
          {visible ? 'Ẩn' : 'Hiện'}
        </button>
      </div>
      {error ? <AuthFieldError message={error} /> : null}
    </div>
  )
}
