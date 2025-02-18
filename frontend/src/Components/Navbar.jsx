import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link} from 'react-router-dom';
import { MessageSquare,User,Settings,LogOut} from 'lucide-react';

const Navbar = () => {
  const {logout,authUser} = useAuthStore();
  return (
    <header
    className='bg-base-100/80 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg'>
      <div className='container mx-auto px-4 h-16'>
        <div className='flex item-center justify-between h-full'>
          {/*LOGO DESIGN OF THE CHAT APP*/}
          <div className='flex items-center gap-8'>
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className='size-9 rounded-lg bg-primary/10 flex items-center justify-center'> {/*if you have width and height of same value instead of seperately specifying them we can just give size-9*/}
              <MessageSquare className="w-5 h-5  text-primary"/>
            </div>
            <h1 className='text-lg font-bold'>ConvoHub</h1>
            </Link>
          </div>
          {/*div right side section*/}
          <div className='flex items-center gap-2'>
            <Link
            to={"/settings"}
            className={`btn btn-sm gap-2 transition-colors`}>
              <Settings className="size-4"/>
              <span className='hidden sm:inline'>Settings</span>
            </Link>
            {authUser &&(
              <>
              <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                <User className="size-5"/>
                <span className='hidden sm:inline'>Profile</span>
              </Link>
              
              <button className='flex gap-2 items-center' onClick={logout}>
                <LogOut className="size-5"/>
                <span className='hidden sm:inline'>Logout</span>
              </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar