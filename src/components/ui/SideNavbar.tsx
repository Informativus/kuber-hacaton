import NavLink from '@/components/ui/CustomLink'
import React from 'react'

export default function SideNavbar () {
  return (
    <nav className='flex flex-col p-2 gap-3.5'>
      <NavLink href={'/dashboard/projects'}>Проекты</NavLink>
      <NavLink href={'/dashboard/settings'}>Настройки</NavLink>
    </nav>
  )
}
