// components/NavLink.tsx
import Link from 'next/link'
import { headers } from 'next/headers'

export default async function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const headersList = await headers()
  const activePath = headersList.get('x-invoke-path') || ''
  const isActive = href === '/'
    ? activePath === href
    : activePath.startsWith(href)

  return (
    <Link
      href={href}
      className={`text-black hover:text-black/80 transition-colors ${
        isActive ? 'border-b-2 border-black' : ''
      }`}
    >
      {children}
    </Link>
  )
}