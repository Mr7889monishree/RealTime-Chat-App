import React from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare,Mail,Lock,Eye,EyeOff,Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePatterns from '../Components/AuthImagePatterns';
import { useState } from 'react';
const LoginPage = () => {
  const [showPassword,setshowPassword]=useState(false);
  const [formData,setformData] = useState({
    email:"",
    password:"",
  });
  const {login,isLoggingIn} = useAuthStore();
  const handelSubmit=(e)=>{
    e.preventDefault();
    login(formData)
  };
  return (
    //ui part of Login page
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/*LEFT SIDE OF FORM*/}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/*LOGO*/}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center  justify-center group-hover:bg-primary/20 tramsition-colors'>
              <MessageSquare  className='size-6 text-primary'/>
              </div>
              <h1 className="text-2xl  font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>
          <form onSubmit={handelSubmit} className='space-y-6'>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="You@example.com"
                  value={formData.email}
                  onChange={(e) => setformData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className="size-5 text-base-content/40"/>
                </div>
                <input 
                type={showPassword ? "text":"password"}
                className={`input input-bordered w-full pl-10`}
                placeholder='••••••••'
                value={formData.password}
                onChange={(e)=>{setformData({...formData,password:e.target.value})}}
                />
                <button type='button'
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={()=>{setshowPassword(!showPassword)}}>
                  {showPassword ?(
                    <EyeOff className='size-5 text-base-content/40'/>
                  ):(
                    <Eye className="size-5 text-base-content/40"/>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn?(
                <>
                <Loader2 className="size-5 animate-spin"/>
                Loading...
                </>
              ):(
                "Sign in"
              )}
            </button>
          </form>
          <div className='text-center'>
            <p className='text-base-content/60'>
            Don&apos; have an account ? {" "}
            <Link to={"/signup"} className="link link-primary">
              Create Account
            </Link>
            </p>
          </div>
        </div>
      </div>

      {/*right side*/}
      <AuthImagePatterns
      title="Join Our Community"
      subtitle="Connect With friends, Share moments, and stay in touch with Your Loved Ones."
      />
      
      </div>
  )
}

export default LoginPage