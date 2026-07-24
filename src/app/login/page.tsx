    'use client'
    import { Eye, EyeOff } from 'lucide-react';
    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import { toast } from 'react-hot-toast';
    import { useRouter} from 'next/navigation'
    import Link from 'next/link';

    export default function LoginPage() {
        const router = useRouter();
        const [user, setUser] = useState({        
        email: "",
        password: "",
    }) 
        const [showPassword, setShowPassword] = useState(false);
        const [buttonDisabled, setButtonDisabled] = useState(false);
        const [loading, setLoading] = useState(false);
        const onLogin = async (e: React.FormEvent)  => {
          e.preventDefault();
            
          try {
        setLoading(true);
        const response = await axios.post("/api/users/login", user);
        console.log("login success", response.data);
         // toast.success("signup successful");     //extra line
        
    
          toast.success("login successful");
          router.push("/dashboard")       

          } catch (error: any) {
          console.log("login failed"); 
        toast.error(error.response?.data?.error || "Login failed"); 
        } finally {
          setLoading(false);
        }
        
          };  
          useEffect(() => {
          if (user.email.length > 5 && user.password.length > 5) {
            setButtonDisabled(false);
          } else {
            setButtonDisabled(true);
          }
            }, [user])
          
        return (
        <div className=' min-h-screen flex items-center justify-center'>
          <div className=' w-full max-w-md p-8 rounded-lg shadow-md'>
          
          <form onSubmit={onLogin} 
            className='flex flex-col items-center justify-center min-h-screen py-2 bg-slate-300 text-orange-900' >
                            {/* Username */}


            <h1>{loading ? "Processing..." : "Login"}</h1>

            <hr />           
            
            <div />
                   {/* Email */}
            <div className='flex flex-col items-center justify-center  py-2 bg-slate-300 text-orange-900'>             
    
              <label  className="block mb-1" htmlFor="email">Email</label>
            <input
            className=' w-full p-2 border border-gray-500 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-gray-900 text-black'
            id="email"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder='Enter email' 
            type="email"/>
            </div>

                      {/* Password */}
            <div className='flex flex-col items-center justify-center py-2 bg-slate-300 text-orange-900'>
            <label className='block mb-1' htmlFor="password">password</label>
            <div className='relative w-full'>
            <input
            className='w-full p-2 pr-10 border border-gray-500 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-gray-900 text-black'
            id="password"
            type={showPassword ? "text" : "password"}
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder='password'/>
        
            <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-600'
    >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            </div>
            </div>
                       {/* Button */}
          
            <button            
            type="submit"    //extra line
            disabled={buttonDisabled}
            // type="button"
            className="w-full text-2xl bg-orange-600 font-bold text-black py-2 rounded-md  transition">
            {buttonDisabled ? "No Login" : "Login"}
            
            </button>
            <Link href="/signup">Visit Signup page </Link>
            <Link href="/forgotpassword">Forgot Password?</Link>
           

            </form>
            </div>
          </div>
          
      )
      }

