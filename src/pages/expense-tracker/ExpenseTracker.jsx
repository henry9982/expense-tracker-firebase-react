import React, { useState } from 'react'
import useAddTransaction from '../../hooks/useAddTransaction'
import useGetTransactions from '../../hooks/useGetTransactions'
import useGetUserInfo from '../../hooks/useGetUserInfo'
import { signOut } from 'firebase/auth'
import { auth } from '../../config/firebase-config'
import { Navigate, useNavigate } from 'react-router-dom'
import { GoSignOut } from "react-icons/go";
import useDeleteTransaction from '../../hooks/useDeleteTransaction'


const ExpenseTracker = () => {
    const navigate = useNavigate()
    const {addTransaction} = useAddTransaction()
    const {isAuth}=useGetUserInfo()

    
    const {transactions,transactionsTotals} = useGetTransactions()
    console.log(transactions);
    const {balance,totalExpenses,totalIncome} = transactionsTotals

    const {name,profilePhoto} = useGetUserInfo()

    const {deleteTransaction} = useDeleteTransaction()
    const deleteBtn =(id)=>{
        deleteTransaction(id)
    }

    const [description,setDescription] = useState("")
    const [transactionAmount,setTansactionsAmount] = useState('')
    const [transactionType,setTransactionType] = useState("expense")

    const onSubmit = async(e)=>{
        e.preventDefault()
        addTransaction({description,transactionAmount,transactionType})
        setDescription('')
        setTansactionsAmount('')
    }
    const signUserOut = async()=>{
        try {
            await signOut(auth)
            localStorage.clear()
            navigate('/')
        } catch (error) {
            console.error(error);
        }
    }

    if (isAuth) {
        return (
            <>
                {transactions?
                <div className=''>
                    <div className='flex flex-wrap-reverse max-[445px]:px-5 max-[355px]:px-1 px-16 items-center mx-auto w-fit my-5'>
                        <div className='flex flex-col gap-3 mx-auto w-fit'>
                            <h1 className='sm:text-3xl text-2xl max-[445px]:text-xl font-semibold'>{name}'s Expense Tracker</h1>
                            <div className='balance flex flex-col gap-1 sm:text-xl text-lg'>
                                <h3>Your Balance</h3>
                                {balance>=0?<h2><span className={balance>=0?'text-green-500':"text-red-500"}>$</span>{balance.toFixed(2)}</h2>:<h2>-<span className={balance>=0?'text-green-500':"text-red-500"}>$</span>{balance.toFixed(2) * -1}</h2>}
                            </div>
                            <div className='summary flex flex-col gap-2'>
                                <div className='income flex flex-col gap-1 sm:text-xl text-lg'>
                                    <h4 className='text-green-500'>Income</h4>
                                    <p>${totalIncome.toFixed(2)}</p>
                                </div>
                                <div className='expenses flex flex-col gap-1 sm:text-xl text-lg'>
                                    <h4 className='text-red-500'>Expenses</h4>
                                    <p>${totalExpenses.toFixed(2)}</p>
                                </div>
                            </div>
                            <form className='flex flex-wrap gap-3 'style={{justifyContent:"end"}} onSubmit={onSubmit}>
                                <div className=' border px-2 max-[600px]: py-1 flex gap-2 items-center'>
                                    <input type="text" className='outline-none border-r-2 w-full' placeholder='Description' value={description} required onChange={(e)=>setDescription(e.target.value)}/>
                                    <input type="number" className='outline-none w-full' placeholder='Amount' value={transactionAmount} required onChange={(e)=>setTansactionsAmount(e.target.value)}/>
                                </div>
            
                                <div className='flex items-center gap-3 flex-1'>
                                        <div className='w-fit'>
                                            <input type="radio" className='cursor-pointer' id="expense" value='expense' checked={transactionType==="expense"}  onChange={(e)=>setTransactionType(e.target.value)}/>
                                            <label className='cursor-pointer' htmlFor="expense">Expense</label>
                                        </div>
                                        <div>
                                            <input type="radio" className='cursor-pointer' id="income" value='income' checked={transactionType==="income"} onChange={(e)=>setTransactionType(e.target.value)}/>
                                            <label className='cursor-pointer' htmlFor="income">Income</label>
                                        </div>

                                </div>
                                <button type='submit' className='border w-fit px-2 py-1 scale-105 hover:scale-100 transition duration-200 rounded text-white bg-green-500 self-end'>Add Transaction</button>

            
                            </form>
                        </div>
                    {profilePhoto && (
                        <div className='mx-auto w-fit flex flex-col items-center justify-center gap-2 max-[950px]:mb-5'>
                            <img src={profilePhoto} className='border rounded-md hover:scale-105 transition duration-300'/>
                            <button onClick={signUserOut} className='border px-2 py-1 rounded flex gap-2 items-center bg-blue-400 text-white hover:scale-105 transition duration-300 hover:shadow-lg hover:shadow-blue-300/50'>Sign Out <GoSignOut className=''/></button>
                        </div>
                        
                    )}
                    </div>   
                    <div className={`relative lg:w-3/5 my-5 md:w-4/5 w-11/12 ${transactions.length>6?'h-[350px]':'h-fit'} mx-auto overflow-x-auto shadow-md sm:rounded-lg`}>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Description
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className='sr-only'>Delete</span>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(transaction=>{
                                const {description,transactionAmount,transactionType,createdAt,id} = transaction
                                return(
                                    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' key={id}>
                                        <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>{description}</th>
                                        <td className='px-6 py-4' style={{color:transactionType==="expense"?"red":"green"}}>{transactionType}</td>
                                        <td className='px-6 py-4'>${transactionAmount} </td>
                                        <td className="px-6 py-4 text-right">
                                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline " onClick={()=>deleteBtn(id)}>Remove</a>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>

                </div>:<div>Loading...</div>}
            </>
          )
    }
    return <Navigate to={'/'}/>
  
}

export default ExpenseTracker