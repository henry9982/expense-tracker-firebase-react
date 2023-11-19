import {BrowserRouter as Router , Routes ,Route} from 'react-router-dom'
import Auth from './pages/auth/auth'
import ExpenseTracker from './pages/expense-tracker/ExpenseTracker'

const App = () => {
  return (
    <div>
        <Router>
          <Routes>
              <Route path='/' exact element={<Auth/>}/>
              <Route path='/expense-tracker' element={<ExpenseTracker/>}/>
          </Routes>
        </Router>
    </div>
  )
}

export default App