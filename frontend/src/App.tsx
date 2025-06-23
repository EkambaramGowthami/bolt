import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { NavBar } from './smallCom/NavBar'
import { Dashboard } from './components/DashBoard'
import { SearchElement } from './components/SearchElement'
import { Pricing } from './components/Pricing'

function App() {
  
  return (
     <BrowserRouter>
     <Routes>
    
      
          <Route path="/dashboard" element={<Dashboard />} />
        
         <Route path="/search/:prompt" element={<SearchElement />} /> 
         <Route path="/pricing/:username" element={<Pricing />} />
         

        
     </Routes>
    </BrowserRouter>
    
  )
}

export default App
