import React from 'react'
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '../../config/firebase-config';
import { Navigate, useNavigate } from 'react-router-dom';
import useGetUserInfo from '../../hooks/useGetUserInfo';
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
    <div className='login-page'>
        <p>Sign In With Google to Continue</p>
        <button className='login-with-google-btn' onClick={signInWithGoogle}>Sign In With Google</button>
    </div>
  )
}

export default Auth