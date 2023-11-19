import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../config/firebase-config"
import useGetUserInfo from "./useGetUserInfo"

const useGetTransactions = () => {
    const transactionCollectionRef = collection(db,'transactions')
    const {userID} = useGetUserInfo()

    const [transactions,setTransactions] = useState([])

    const [transactionsTotals,setTransactionsTotals] = useState({balance:0,totalIncome:0,totalExpense:0})


    const getTransactions = async()=>{
        let unsubscribe;
        try {
            
            const queryTransactions =  query(
                transactionCollectionRef,
                where("userID",'==',userID),
                orderBy("createdAt")
            );
             unsubscribe = onSnapshot(queryTransactions,(snapshot)=>{
                let docs = []
                let totalIncome = 0
                let totalExpenses = 0
                snapshot.forEach(doc=>{
                    const data = doc.data()
                    const id = doc.id

                    docs.push({...data,id})
                    if (data.transactionType === 'expense') {
                        totalExpenses += Number(data.transactionAmount)
                    }else{
                        totalIncome += Number(data.transactionAmount)
                    }

                })
                setTransactions(docs)
                let balance = totalIncome-totalExpenses
                setTransactionsTotals({
                    balance,
                    totalIncome,
                    totalExpenses,
                })
            })

        } catch (err) {
            console.error(err);
        }
        return ()=> unsubscribe()
    }

    useEffect(()=>{
        getTransactions()
    },[])
    
  return {transactions,transactionsTotals}
}

export default useGetTransactions