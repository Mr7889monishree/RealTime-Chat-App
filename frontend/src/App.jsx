import React, { useEffect } from 'react'
import Navbar from './Components/Navbar'
import {Routes,Route, Navigate} from "react-router-dom"
import HomePage from './Pages/HomePage'
import SignUpPage from './Pages/SignUpPage'
import LoginPage from './Pages/LoginPage'
import SettingsPage from './Pages/SettingsPage'
import ProfilePage from './Pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"
import '/src/App.css'
import { usethemeStore } from './store/UsethemStore'
const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}= useAuthStore();
  const {theme}=usethemeStore();
  console.log({onlineUsers});
  useEffect(()=>{
    checkAuth();
  },[checkAuth])
  console.log({authUser});
  //if user is not authenticated
  if(isCheckingAuth && !authUser)
    return(
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
    </div>
    );
  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to="/"/>}></Route>
        <Route path='/login' element={!authUser ? <LoginPage/>: <Navigate to="/"/>}></Route>
        <Route path='/settings' element={<SettingsPage/>}></Route>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login"/>}></Route>

      </Routes>
      <Toaster/>
    </div>
  )
}

export default App