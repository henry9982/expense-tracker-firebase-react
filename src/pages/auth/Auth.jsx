import React from 'react'
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '../../config/firebase-config';
import { Navigate, useNavigate } from 'react-router-dom';
import useGetUserInfo from '../../hooks/useGetUserInfo';
import { FcGoogle } from "react-icons/fc";
import "./auth.css"

const Auth = () => {
    const navigate =useNavigate()
    const {isAuth}=useGetUserInfo()

    const signInWithGoogle =async()=>{
        const results = await signInWithPopup(auth,provider)
        console.log(results);
        const authInfo = {
            userID: results.user.uid,
            name:results.user.displayName,
            profilePhoto:results.user.photoURL,
            isAuth:true,
        }
        localStorage.setItem('auth',JSON.stringify(authInfo))
        navigate('/expense-tracker')
    }
    if (isAuth) {
      return <Navigate to={'/expense-tracker'}/>
    }

  return (
    // <div className=''>
    //   <div>
    //     <p>Sign In With Google to Continue</p>
    //     <div onClick={signInWithGoogle} className='border text-2xl w-fit flex items-center gap-3'>
    //       <FcGoogle className='-mb-1'/>
    //       <button className='login-with-google-btn' >Sign In With Google</button>
    //     </div>
        
    //   </div>

      
    // </div>
    <div className='body'>
          
      <div className=' h-full flex flex-col justify-center items-center sm:gap-6 gap-3'>
        <p className='text-white sm:text-3xl text-2xl max-[430px]:text-xl max-[350px]:text-lg font-semibold flex items-center gap-1'>Sign In With         <ul className='flex sm:text-3xl text-2xl max-[430px]:text-xl max-[350px]:text-lg font-semibold hover:bg-white transition rounded-sm px-2'>
          <li className='text-blue-400'>G</li>
          <li className='text-red-500'>O</li>
          <li className='text-orange-400'>O</li>
          <li className='text-blue-400'>G</li>
          <li className='text-green-500'>L</li>
          <li className='text-red-500'>E</li>
        </ul> to Continue</p>

        <div onClick={signInWithGoogle} className='rounded-lg cursor-pointer hover:scale-105 transition duration-300 sm:text-2xl text-xl w-fit flex items-center gap-3 bg-white px-2 py-2'>
          <FcGoogle className='-mb-1 sm:text-3xl text-2xl'/>
          <button className='login-with-google-btn' >Sign In With Google</button>
        </div>
        
      </div>
    </div>
  )
}

export default Auth