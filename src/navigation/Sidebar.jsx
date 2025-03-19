import { useState } from 'react'
import { menuItems } from '../config/site'
import SidebarItem from './SidebarItem'

function Sidebar () {
  const [isCollapse, setIsCollapse] = useState(false)

  return (
    <aside className={`flex flex-col ${isCollapse ? 'w-24' : 'w-52'} shadow-lg shadow-r-[5px] py-4 px-2 gap-8 transition-all duration-500`}>
      <button onClick={() => setIsCollapse(!isCollapse)}>{isCollapse ? '>' : '<'}</button>
      <h2>SideBar</h2>
      <div className='flex flex-col gap-2'>
        {
          menuItems.map(item => (
            <SidebarItem key={item.label} item={item} />
          ))
        }
      </div>
    </aside>
  )
}

export default Sidebar
