import React from 'react'
import NavLink from './CustomLink'

export default async function ProjectNavbar() {

  const projects = ['project1', 'project2', 'project3']
  return (
    <nav className='flex flex-col p-2 gap-3.5'>
      {projects.map((project, i) => {
        return (
          <div key={i}>
            <NavLink href={`/dashboard/projects/${project}`}>{project}</NavLink>
          </div>
        )
      })}
    </nav>
  )
}
