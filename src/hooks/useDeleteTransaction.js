import React from 'react'
import useGetUserInfo from './useGetUserInfo'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase-config'

const useDeleteTransaction = () => {
    const deleteTransaction = async(id)=>{
        const {userID} =useGetUserInfo()
        try {
            const transactionDoc = doc(db,'transactions',id)
            await deleteDoc(transactionDoc)
            
        } catch (error) {
            console.error(error);
        }
    }
  return {deleteTransaction}
  
}

export default useDeleteTransaction