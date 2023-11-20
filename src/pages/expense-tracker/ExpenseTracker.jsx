import React, { useState } from 'react'
import useAddTransaction from '../../hooks/useAddTransaction'
import useGetTransactions from '../../hooks/useGetTransactions'
import useGetUserInfo from '../../hooks/useGetUserInfo'
import { signOut } from 'firebase/auth'
import { auth, db } from '../../config/firebase-config'
import { Navigate, useNavigate } from 'react-router-dom'
import { GoSignOut } from "react-icons/go";
import useDeleteTransaction from '../../hooks/useDeleteTransaction'
import { doc, getDoc } from 'firebase/firestore'
import { AiOutlineCloseCircle } from "react-icons/ai";
import { LuArrowBigDownDash, LuArrowBigUpDash } from "react-icons/lu";
import { MdOutlineAccountBalanceWallet } from "react-icons/md"
import useUpdateTransaction from '../../hooks/useUpdateTransaction'
import Loader from '../loader/Loader'


const ExpenseTracker = () => {
    const navigate = useNavigate()
    const {addTransaction} = useAddTransaction()
    const {isAuth}=useGetUserInfo()

    
    const {transactions,transactionsTotals} = useGetTransactions()
    const {balance,totalExpenses,totalIncome} = transactionsTotals

    const {name,profilePhoto} = useGetUserInfo()

    const {deleteTransaction} = useDeleteTransaction()
    const deleteBtn =(id)=>{
        deleteTransaction(id)
    }

    const [description,setDescription] = useState("")
    const [transactionAmount,setTansactionsAmount] = useState('')
    const [transactionType,setTransactionType] = useState("expense")


    const [newDescription,setNewDescription] = useState("")
    const [newTransactionAmount,setNewTansactionsAmount] = useState('')
    const [newTransactionType,setNewTransactionType] = useState("expense")

    const [docTransactionId,setDocTransactionId] = useState('')

    const [showEditSection,setShowEditSection] = useState(false)

    const {updateTransaction} =  useUpdateTransaction()
    const saveEdit = (docId)=>{
        updateTransaction({newDescription,newAmount:newTransactionAmount,newType:newTransactionType,docId})
        setShowEditSection(false)
    }


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
    const getOneDoc = async(id)=>{
        const transactionRef = doc(db,'transactions',id)
        const docSnapshot = await getDoc(transactionRef)
        const data = docSnapshot.data()
        setDocTransactionId(docSnapshot.id)
        setNewDescription(data.description)
        setNewTansactionsAmount(data.transactionAmount)
        setNewTransactionType(data.transactionType)
        setShowEditSection(true)
    }

    if (isAuth) {
        return (
            <>
                {transactions?
                <div className={`${showEditSection&&'overflow-hidden h-screen w-screen'}`}>
                    <div className={`flex flex-wrap-reverse max-[445px]:px-5 max-[355px]:px-1 px-16 items-center mx-auto  my-5 w-fit `}>
                        <div className='flex flex-col gap-3 mx-auto w-fit'>
                            <h1 className='sm:text-3xl text-2xl max-[445px]:text-xl font-semibold'>{name}'s Expense Tracker</h1>
                            <div className='balance flex flex-col gap-1 sm:text-xl text-lg'>
                                <h3 className='text-lg flex items-center gap-2'><MdOutlineAccountBalanceWallet className={`${balance>=0?"text-green-500":'text-red-500'} `}/><span>Your Balance</span> </h3>
                                {balance>=0?<h2><span className={balance>=0?'text-green-500':"text-red-500"}>$</span>{balance.toFixed(2)}</h2>:<h2>-<span className={balance>=0?'text-green-500':"text-red-500"}>$</span><span className='text-lg'>{balance.toFixed(2) * -1}</span></h2>}
                            </div>
                            <div className='summary flex flex-col gap-2'>
                                <div className='income flex flex-col gap-1 sm:text-xl text-lg'>
                                    <h4 className=' text-lg flex items-center gap-2'><LuArrowBigUpDash className='text-green-500 -mb-1'/><span>Income</span> </h4>
                                    <p className='text-lg '>$ {totalIncome.toFixed(2)}</p>
                                </div>
                                <div className='expenses flex flex-col gap-1 sm:text-xl text-lg'>
                                    <h4 className=' flex items-center gap-2 text-lg'><LuArrowBigDownDash className='text-red-500 -mb-1'/><span>Expenses</span> </h4>
                                    <p className='text-lg'>$ {totalExpenses.toFixed(2)}</p>
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
                                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={()=>getOneDoc(id)}>Edit</a>
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
                    {showEditSection&&
                        <div className='bg-black flex justify-center items-center bg-opacity-25 fixed top-0 bottom-0 right-0 left-0'>
                            <form onSubmit={()=>saveEdit(docTransactionId)} className='w-fit border px-5 py-5 bg-white flex flex-col gap-3 rounded'>
                                <div className='flex justify-between items-center'>
                                    <h1 className='text-xl'>Edit Section</h1>
                                    <AiOutlineCloseCircle className='text-xl cursor-pointer' onClick={()=>setShowEditSection(false)}/>
                                </div>
                                <div className='min-[440px]:border rounded min-[440px]:px-2 py-2 flex items-center max-[440px]:flex-col max-[440px]:gap-2'>
                                    <input type="text" className='outline-none min-[440px]:border-r-2  max-[440px]:border max-[440px]:w-full max-[440px]:px-1 max-[440px]:py-2 max-[440px]:rounded' placeholder='Description' value={newDescription} required onChange={(e)=>setNewDescription(e.target.value)}/>
                                    <input type="number" className='outline-none min-[440px]:ms-1 max-[440px]:border max-[440px]:w-full max-[440px]:px-1 max-[440px]:py-2 max-[440px]:rounded' placeholder='Amount' value={newTransactionAmount} required onChange={(e)=>setNewTansactionsAmount(e.target.value)}/>
                                </div>
                                <div className='flex items-center  justify-between flex-wrap gap-2 'style={{justifyContent:"end"}}>
                                    <div className='flex flex-1 items-center gap-3'>
                                        <div className='w-fit'>
                                            <input type="radio" className='cursor-pointer' id="newExpense" value='expense' checked={newTransactionType==="expense"}  onChange={(e)=>setNewTransactionType(e.target.value)}/>
                                            <label className='cursor-pointer' htmlFor="newExpense">Expense</label>
                                        </div>
                                        <div>
                                            <input type="radio" className='cursor-pointer' id="newIncome" value='income' checked={newTransactionType==="income"} onChange={(e)=>setNewTransactionType(e.target.value)}/>
                                            <label className='cursor-pointer' htmlFor="newIncome">Income</label>
                                        </div>
                                    </div>
                                    <button type='submit' className='border w-fit px-2 py-1 scale-105 hover:scale-100 transition duration-200 rounded text-white bg-orange-500'>save</button>

                                </div>
                            </form>
                        </div>}

                </div>:<Loader/>}
            </>
          )
    }
    return <Navigate to={'/'}/>
  
}

export default ExpenseTracker