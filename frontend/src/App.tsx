import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import  Dashboard  from './components/DashBoard'
import  SearchElement  from './components/SearchElement'
import  Pricing  from './components/Pricing'
import  Signup from './smallCom/signup'
import  Signin  from './smallCom/Signin'

function App() {
  
  return (
     <BrowserRouter>
     <Routes>
    
      
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
         <Route path="/search/:prompt" element={<SearchElement />} /> 
         <Route path="/dashboard/pricing" element={<Pricing />} />
         

        
     </Routes>
    </BrowserRouter>
    
  )
}

export default App
