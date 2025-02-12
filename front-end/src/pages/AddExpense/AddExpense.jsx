import React, { useState, useEffect } from "react";
import "./AddExpense.css"


const AddExpenseForm = () => {
    const [amount, setAmount] = useState("");
    const [merchant, setMerchant] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");
    const [transactions, setTransactions] = useState([])
    const [showConfirm, setShowConfirm] = useState(false); // Control modal visibility
    const [transactionToDelete, setTransactionToDelete] = useState(null); // Track selected transaction
    const userId = 1;

    // Fake Transaction DATa
    // const [transactions, setTransactions] = useState([
    //     { id: 1, date: "Jan-22-25", amount: "$18.64", merchant: "UberEats", category: "Food" },
    //     { id: 2, date: "Jan-2-25", amount: "$85.23", merchant: "Saks Fifth Off", category: "Shopping" },
    //     { id: 3, date: "Dec-25-24", amount: "$2.90", merchant: "Bus", category: "Commute" },
    // ]);

    //Fetch transactions from the backend when the component mounts
    useEffect(() => {
        fetchTransactions();
    }, []);

    console.log(transactions)

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5002/expense/list?user_id=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const result = await response.json();

            if (response.ok) {
                setTransactions(result); // Set transactions from API response

            } else {
                console.error("Error fetching transactions:", result.error);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct the expense data object
        const expenseData = {
            user_id: 1, // Replace with dynamic user_id if needed
            Amount: parseFloat(amount), // Ensure amount is a number
            Merchant: merchant,
            Category: category,
            Date: date
        };

        try {
            const response = await fetch("http://127.0.0.1:5002/expense/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(expenseData)
            });

            const result = await response.json();

            if (response.ok) {
                // Create a new transaction object using the returned expense_id
                const newTransaction = {
                    id: result.expense_id,
                    date,
                    amount: `$${amount}`,
                    merchant,
                    category
                };

                // Update transactions state with the new transaction
                // setTransactions([...transactions, newTransaction]);
                fetchTransactions()

                // Reset form fields
                setAmount("");
                setMerchant("");
                setDate("");
                setCategory("");
            } else {
                console.error("Error adding expense:", result.error);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    // Handle Delete Click - Open Confirmation Modal
    const HandleDeleteClick = (transaction) => {
        setTransactionToDelete(transaction);
        setShowConfirm(true)
    }

    // const ConfirmDelete = (transaction) => {
    //     if (transactionToDelete) {
    //         setTransactions(transactions.filter(t => t.id !== transactionToDelete.id));
    //         setTransactionToDelete(null);
    //         setShowConfirm(false);
    //     }
    // }

    const ConfirmDelete = async () => {
        try {
            console.log(transactionToDelete.expense_id)
            const response = await fetch("http://127.0.0.1:5002/expense/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ expense_id: transactionToDelete.expense_id })
            });

            if (response.ok) {
                setTransactions(transactions.filter(transaction => transaction.expense_id !== transactionToDelete.expense_id));
                setTransactionToDelete(null);
                setShowConfirm(false);
            } else {
                console.error("Failed to delete expense");
            }
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };



    return (
        <div className="expense-container">
            <div className="expense-form-container">
                <h2 className="form-title">Add Expense</h2>
                <form className="expense-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="amount">Amount $ </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="merchant">Merchant </label>
                        <input
                            type="text"
                            id='merchant'
                            value={merchant}
                            onChange={(e) => setMerchant(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category </label>
                        <select
                            id="{category}"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Food">Food</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Travel">Travel</option>
                            <option value="Commute">Commute</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button type="submit" className="add-expense-btn">Add Expense</button>
                </form>
            </div>

            <div className='transaction-table-container'>
                <h2 className="table-title">Past Transaction</h2>
                <table className="transaction-table">
                    <thead className="transaction-table-head">
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Merchant</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.expense_id}>
                                <td>{new Date(transaction.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.merchant}</td>
                                <td>{transaction.category}</td>
                                <td>
                                    {/* <button className="expense-edit-btn">Edit</button> */}
                                    <button className="expense-delete-btn" onClick={() => HandleDeleteClick(transaction)}>X </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-contet">
                        <h3>Are you sure you would like to remove this transaction?</h3>
                        <p>* Removing this transaction is permanent. It will no longer be tracked.*
                        </p>
                        <div className="modal-button">
                            <button onClick={ConfirmDelete} className="confirm-btn">Yes</button>
                            <button onClick={() => setShowConfirm(false)} className="cancel-btn">Cancel</button>

                        </div>


                    </div>


                </div>
            )}

        </div>


    )

}





export default AddExpenseForm