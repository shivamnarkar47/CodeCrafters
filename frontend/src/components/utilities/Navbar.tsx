import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
    const location = useLocation();
    
  return (
    <div className={`p-10 bg-gray-200 ${location.pathname.split('/')[1]  === 'dashboard' || ' ' ? 'hidden' : ''}`}>
        <nav className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold'>Navbar</h1>
            <ul className='flex gap-10 '>
            <Link to={"/"}>Home</Link>
            <Link to={"/investments"}>Investments</Link>
            <Link to={"/auth"}>Auth</Link>
            
            </ul>
        </nav>
    </div>
  )
}

export default Navbar