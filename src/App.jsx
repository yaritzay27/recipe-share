import { BrowserRouter, Route, Routes } from 'react-router'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import CreateRecipe from './pages/CreateRecipe'
import EditRecipe from './pages/EditRecipe'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import RecipeDetails from './pages/RecipeDetails'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="page-shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateRecipe />} />
            <Route path="/post/:id" element={<RecipeDetails />} />
            <Route path="/edit/:id" element={<EditRecipe />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
