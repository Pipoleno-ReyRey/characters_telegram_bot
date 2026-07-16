type TelegramLogoProps = {
  className?: string
}

export function TelegramLogo({ className }: TelegramLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="telegram-gradient"
          x1="0.667"
          x2="0.417"
          y1="0.167"
          y2="0.75"
        >
          <stop offset="0" stopColor="#37aee2" />
          <stop offset="1" stopColor="#1e96c8" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="120" fill="url(#telegram-gradient)" />
      <path
        fill="#c8daea"
        d="M98 175c-3.888 0-3.227-1.468-4.568-5.174L82 132.207 170 80"
      />
      <path
        fill="#a9c9dd"
        d="M98 175c3 0 4.325-1.372 6-3l16-15.6-20-12"
      />
      <path
        fill="#fff"
        d="M100.04 144.41l48.36 35.729c5.519 3.045 9.501 1.468 10.832-5.093l19.764-93.063c2.061-8.812-3.356-12.634-9.103-10.512L37.98 108.588c-8.746 3.382-8.657 8.13-1.586 10.203l31.972 9.975 74.221-46.775c3.496-2.275 6.692-1.035 4.058 1.434"
      />
    </svg>
  )
}
