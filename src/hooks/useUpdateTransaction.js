import React from 'react'
import { db } from '../config/firebase-config'
import { updateDoc ,doc} from 'firebase/firestore'

const useUpdateTransaction = () => {
    const updateTransaction = async({docId,newDescription,newAmount,newType})=>{
        try {
            const transactionRef = doc(db,'transactions',docId)
            await updateDoc(transactionRef,{description:newDescription,transactionAmount:newAmount,transactionType:newType})
        } catch (error) {
            console.error(error);
        }
         
    }
  return {updateTransaction}
}

export default useUpdateTransaction