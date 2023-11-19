
const useGetUserInfo = () => {
    const {name,profilePhoto,userID,isAuth} = JSON.parse(localStorage.getItem('auth')) || {isAuth:false}
  return {name,profilePhoto,userID,isAuth}
}

export default useGetUserInfo