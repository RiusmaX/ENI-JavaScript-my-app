import { Link } from 'react-router'

function SidebarItem ({ item }) {
  return (
    <Link to={item.href}>
      <div className='flex flex-row items-center p-2 hover:shadow-sm rounded-md'>
        {item.label}
      </div>
    </Link>
  )
}

export default SidebarItem
