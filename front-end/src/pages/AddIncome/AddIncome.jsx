import React, { useState } from "react";
import "./AddIncome.css"



const AddIncomeForm = () => {
    const [amount, setAmount] = useState("");
    const [source, setSource] = useState("");
    const [date, setDate] = useState("");
    const [showConfirm, setShowConfirm] = useState(false); // Control modal visibility
    const [incomeToDelete, setIncomeToDelete] = useState(null); // Track selected income


    // Fake Income Data
    const [incomes, setIncomes] = useState([
        { id: 1, date: "Jan-2-25", amount: "2302.7", source: "Weekly Paycheck" },
        { id: 2, date: "Jan-9-25", amount: "2304.7", source: "Weekly Paycheck" },
        { id: 3, date: "Jan-16-24", amount: "2302.7", source: "Weekly Paycheck" },
    ]);


    const handleSubmit = (e) => {
        e.preventDefault();
        // create a new income object
        const newIncome = {
            id: incomes.length + 1,
            date,
            amount: `$${amount}`,
            source
        }
        //Add a new income to state
        setIncomes([...incomes, newIncome])

        //Reset from fields
        setAmount("");
        setSource("");
        setDate("");

    };
    // Handle Delete Click - Open Confirmation Modal
    const HandleDeleteClick = (income) => {
        setIncomeToDelete(income);
        setShowConfirm(true)
    }

    const ConfirmDelete = (income) => {
        if (incomeToDelete) {
            console.log(incomeToDelete.id)
            setIncomes(incomes.filter(t => t.id !== incomeToDelete.id));
            setIncomeToDelete(null);
            setShowConfirm(false);
        }
    }



    return (
        <div className="income-container">
            <div className="income-form-container">
                <h2 className="income-form-title">Add Income</h2>
                <form className="income-form" onSubmit={handleSubmit}>
                    <div className="income-form-group">
                        <label htmlFor="amount">Amount $ </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <div className="income-form-group">
                        <label htmlFor="source">Source </label>
                        <input
                            type="text"
                            id='source'
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            required
                        />
                    </div>

                    <div className="income-form-group">
                        <label htmlFor="date">Date </label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="Add-income-btn">Add Income</button>
                </form>

            </div>
            <div className='income-table-container'>
                <h2 className='income-table-title'>Past Transaction</h2>
                <table className="income-table">
                    <thead className="income-table-head">
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Source</th>

                        </tr>
                    </thead>
                    <tbody>
                        {incomes.map((income) => (
                            <tr key={income.id}>
                                <td>{income.date}</td>
                                <td>{income.amount}</td>
                                <td>{income.source}</td>
                                <td>
                                    {/* <button className="income-edit-btn">Edit</button> */}
                                    <button className="income-delete-btn" onClick={() => HandleDeleteClick(income)}>X</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>



            </div>

            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Are you sure you would like to remove this transaction?</h3>
                        <p>* Removing this transaction is permanent. It will no longer be tracked.*
                        </p>
                        <div className="modal-button">
                            <button onClick={ConfirmDelete} className="confirm-btn">Yes</button>
                            <button onClick={() => setShowConfirm(false)} className="cancel-btn">Cancel</button>

                        </div>

                    </div>

                </div>
            )

            }
        </div>
    )

}


export default AddIncomeForm