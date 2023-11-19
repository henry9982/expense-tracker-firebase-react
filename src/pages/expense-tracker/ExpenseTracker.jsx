import React, { useState } from 'react'
import useAddTransaction from '../../hooks/useAddTransaction'
import useGetTransactions from '../../hooks/useGetTransactions'
import useGetUserInfo from '../../hooks/useGetUserInfo'
import { signOut } from 'firebase/auth'
import { auth } from '../../config/firebase-config'
import { useNavigate } from 'react-router-dom'

const ExpenseTracker = () => {
    const navigate = useNavigate()
    const {addTransaction} = useAddTransaction()
    
    const {transactions,transactionsTotals} = useGetTransactions()
    const {balance,totalExpenses,totalIncome} = transactionsTotals

    const {name,profilePhoto} = useGetUserInfo()


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
  return (
    <>
        <div className='expense-tracker'>
            <div className='container'>
                <h1>{name}'s Expense Tracker</h1>
                <div className='balance'>
                    <h3>Your Balance</h3>
                    {balance>=0?<h2>${balance}</h2>:<h2>-${balance * -1}</h2>}
                </div>
                <div className='summary'>
                    <div className='income'>
                        <h4>Income</h4>
                        <p>${totalIncome}</p>
                    </div>
                    <div className='expenses'>
                        <h4>Expenses</h4>
                        <p>${totalExpenses}</p>
                    </div>
                </div>
                <form className='add-transaction 'onSubmit={onSubmit}>
                    <input type="text" placeholder='Description' value={description} required onChange={(e)=>setDescription(e.target.value)}/>
                    <input type="number" placeholder='Amount' value={transactionAmount} required onChange={(e)=>setTansactionsAmount(e.target.value)}/>

                    <input type="radio" id="expense" value='expense' checked={transactionType==="expense"}  onChange={(e)=>setTransactionType(e.target.value)}/>
                    <label htmlFor="expense">Expense</label>
                    <input type="radio" id="income" value='income' checked={transactionType==="income"} onChange={(e)=>setTransactionType(e.target.value)}/>
                    <label htmlFor="income">Income</label>

                    <button type='submit'>Add Transaction</button>
                </form>
            </div>
        </div>
        {profilePhoto && (
            <div style={{display:"inline"}}>
                <img src={profilePhoto} />
                <button onClick={signUserOut}>Sign Out</button>
            </div>
            
        )}
        <div className='transactions'>
            <h3>Transactions</h3>
            <ul>
                {transactions.map(transaction=>{
                    const {description,transactionAmount,transactionType,createdAt,id} = transaction
                    return(
                        <li key={id}>
                            <h4>{description}</h4>
                            <p>${transactionAmount} &#x2022; <label style={{color:transactionType==="expense"?"red":"green"}}>{transactionType}</label></p>
                        </li>
                    )
                })}
            </ul>
        </div>
    </>
  )
}

export default ExpenseTracker