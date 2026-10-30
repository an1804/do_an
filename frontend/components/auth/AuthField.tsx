import type { HTMLAttributes, ReactNode } from 'react'

export function AuthField({
  name,
  type = 'text',
  value,
  placeholder,
  autoComplete,
  maxLength,
  inputMode,
  error,
  icon,
  onChange,
}: {
  name: string
  type?: string
  value: string
  placeholder: string
  autoComplete?: string
  maxLength?: number
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode']
  error?: string
  icon: ReactNode
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="sr-only" htmlFor={name}>
        {placeholder}
      </label>
      <div
        className={`flex h-12 items-center rounded-xl border bg-white px-3.5 ${
          error ? 'border-[#E31C25]' : 'border-[#E5E7EB] focus-within:border-[#4285DE]'
        }`}
      >
        <span className={`shrink-0 ${error ? 'text-[#E31C25]' : 'text-[#9CA3AF]'}`}>{icon}</span>
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          inputMode={inputMode}
          onChange={(event) => onChange(event.target.value)}
          className="ml-2.5 h-full min-w-0 flex-1 bg-transparent text-[15px] text-[#252A31] outline-none placeholder:text-[#9CA3AF]"
        />
      </div>
      {error ? <AuthFieldError message={error} /> : null}
    </div>
  )
}

export function AuthFieldError({ message }: { message: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[#E31C25]">
      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
        <path d="M8 1.3A6.7 6.7 0 1 0 8 14.7 6.7 6.7 0 0 0 8 1.3Zm.7 9.4H7.3V9.4h1.4v1.3Zm0-2.4H7.3V4.7h1.4v3.6Z" />
      </svg>
      {message}
    </p>
  )
}

export function MailIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

export function UserFieldIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </svg>
  )
}

export function PhoneFieldIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18.5h2" />
    </svg>
  )
}

export function LockIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}
