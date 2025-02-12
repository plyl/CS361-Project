import { React, useState, useEffect } from "react";
import "./AddBudget.css"



const AddBudget = () => {
    // const [income, setIncome] = useState("")
    const [savings, setSavings] = useState("");
    const [deadline, setDeadline] = useState("");
    const [monthlyBudget, setMonthlyBudget] = useState("");
    const [income, setIncome] = useState("")
    const [showInfo, setShowInfo] = useState(false)
    const [budget, setBudget] = useState("")
    const userId = 1

    //Fetch transactions from the backend when the component mounts
    useEffect(() => {
        fetchBudget();
    }, []);


    const fetchBudget = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5002/budget/list?user_id=${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const result = await response.json();

            if (response.ok) {
                setBudget(result['budget']); // Set transactions from API response


            } else {
                console.error("Error fetching budget:", result.error);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    }


    const calculateBudget = () => {
        if (!savings || !deadline) {
            alert(" Please fill all fields to calculate");
            return;
        }

        const today_local = new Date();
        const today_string = new Intl.DateTimeFormat('sv-SE').format(today_local)

        const today_year = parseInt(today_string.split("-")[0], 10)
        const today_month = parseInt(today_string.split("-")[1], 10)
        // const today_day = parseInt(today_string.split("-")[2], 10)


        const deadline_year = parseInt(deadline.split("-")[0], 10)
        const deadline_month = parseInt(deadline.split("-")[1], 10)
        // const deadline_day = parseInt(deadline.split("-")[2], 10)

        const parsed_today = new Date(today_local)
        const parsed_deadline = new Date(deadline)

        // if (deadline_year <= today_year & deadline_month <= today_month & deadline_day < today_day) {
        //     alert(" Goal deadline cannot be in the past");
        //     return;
        // }

        if (parsed_deadline < parsed_today) {
            alert(" Goal deadline cannot be in the past");
            return;
        }

        // const yearDiff = goalDate.getFullYear() - today.getFullYear();

        // const monthDiff = goalDate.getMonth() - today.getMonth();
        // const totalMonths = Math.ceil(yearDiff * 12 + monthDiff);

        const yearDiff = deadline_year - today_year
        console.log("yeardiff", yearDiff)

        const monthDiff = deadline_month - today_month
        console.log("monthdiff", monthDiff, deadline_month, today_month)
        const totalMonths = Math.ceil(yearDiff * 12 + monthDiff + 1)
        console.log(totalMonths)

        // const budget = (parseFloat(savings) / totalMonths.toFixed(2));

        const budget = income - Math.ceil((parseFloat(savings) / totalMonths) * 10) / 10;
        console.log(budget);
        if (budget < 0) {
            alert("Your savings amount is too large. Please lower your saving amount and try again.")
            return;
        }
        setMonthlyBudget(budget);

    }

    const instruction = () => {
        setShowInfo(true)
    }

    const closeInstruction = () => {
        setShowInfo(false)
    }



    const updateBudget = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5002/budget/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user_id: userId, budget: monthlyBudget })
            });

            if (response.ok) {
                alert("Budget updated successfully!");
                fetchBudget();
            } else {
                console.error("Failed to update budget");
            }
        } catch (error) {
            console.error("Error updating budget:", error);
        }
    };



    return (
        <div className="add-budget-container">
            <div className="budget-calculator">
                <h2 className="budget-calculator-title">Budget Calculator</h2>
                <button onClick={instruction} className="info">
                    Need Help?</button>
                <div className="budget-calculator-group">
                    <label>Your Monthly Income</label>
                    <input type="number"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}></input>
                </div>

                <div className="budget-calculator-group">
                    <label>Target Savings Amount</label>
                    <input
                        type="number"
                        value={savings}
                        onChange={(e) => setSavings(e.target.value)}></input>
                </div>
                <div className="budget-calculator-group">
                    <label>Goal Deadline</label>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}></input>
                </div>
                <button onClick={calculateBudget} className="calculator-btn">Calculate</button>
            </div>
            <div className="current-budget">
                <p>Your Current Budget: {budget}</p>
            </div>
            <div className="set-monthly-budget">
                <label>Set Monthly Budget</label>
                <input
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}></input>
            </div>
            <button onClick={updateBudget} className="update-budget-btn">Update Budget</button>


            {showInfo && (
                <div className="help-instruction">
                    <b>You may enter your monthly budget or let us caluclate for you!</b>
                    <p>To use the calculator, please enter the following:</p>
                    <p> What is your monthly income?</p>
                    <p> How much would you like to save?</p>
                    <p> When would you like to achieve your goal?</p>
                    <button onClick={closeInstruction} className='help-instruction-btn'>
                        Close
                    </button>
                </div>

            )}

        </div>





    )




}

export default AddBudget
