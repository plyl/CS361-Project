
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
// import Home from "./pages/Home/Home"
import AddExpense from "./pages/AddExpense/AddExpense"
import AddIncome from "./pages/AddIncome/AddIncome"
import AddBudget from "./pages/AddBudget/AddBudget"

function App() {

  return (
    <>
      <div className='app'>
        <Navbar />
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/add-income" element={<AddIncome />} />
          <Route path="/add-budget" element={<AddBudget />} />
        </Routes>
      </div>
    </>
  )
}

export default App


