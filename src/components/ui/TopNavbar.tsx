import Link from 'next/link'
import React from 'react'

export default function TopNavbar() {
  const user = false
  return (
    <nav className='flex justify-around items-center h-20'>
      <Link  href={'/'}>Начало</Link>
      <Link  href={'/dashboard'}>Дашборд</Link>
      {!user ? <Link  href={'/auth'}>Войти</Link> : <Link  href={'/profile'}>Профиль</Link>}
    </nav>
  )
}
