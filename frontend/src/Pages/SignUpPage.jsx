import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { MessagesSquare,User,Mail, EyeOff,Eye,Lock,Loader2} from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePatterns from '../Components/AuthImagePatterns';
import {toast} from 'react-hot-toast'

const SignUpPage = () => {
  const [showPassword,setshowPassword]=useState(false);
  const [formData,setformData] = useState({
    fullName:"",
    email:"",
    password:"",
  });
  const {signup,isSigningUp} = useAuthStore();
  const validateForm=()=>{
    if(!formData.fullName.trim()) return toast.error("Fullname is Required");
    if(!formData.email.trim()) return toast.error("Email is Required");
    if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid Email Format");
    if(!formData.password.trim()) return toast.error("Password is required");
    if(formData.password.length<6) return toast.error("Password must of be atleast of 6 Characters");

    return true;

  }

  const handelSubmit=(e)=>{
    e.preventDefault();
    const success=validateForm(); //which we are gonna get success case either true or false

    if(success === true) signup(formData);
  };
  return (
    //ui part of signup page
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/*LEFT SIDE OF FORM*/}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/*LOGO*/}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center  justify-center group-hover:bg-primary/20 tramsition-colors'>
              <MessagesSquare  className='size-6 text-primary'/>
              </div>
              <h1 className="text-2xl  font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get Started with free account</p>
            </div>
          </div>
          <form onSubmit={handelSubmit} className='space-y-6'>
          <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setformData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>
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
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp?(
                <>
                <Loader2 className="size-5 animate-spin"/>
                Loading...
                </>
              ):(
                "Create Account"
              )}
            </button>
          </form>
          <div className='text-center'>
            <p className='text-base-content/60'>
            Already Have an Account?{""}
            <Link to="/login" className="link link-primary">
              Sign in
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

export default SignUpPage