import { ChefHat, Home, PlusCircle } from 'lucide-react'
import { NavLink } from 'react-router'

function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="brand" aria-label="RecipeShare home">
        <span className="brand__mark" aria-hidden="true">
          <ChefHat size={22} strokeWidth={2.3} />
        </span>
        <span className="brand__text">RecipeShare</span>
      </NavLink>

      <nav className="navbar__links" aria-label="Primary navigation">
        <NavLink to="/" className="nav-pill">
          <Home size={17} aria-hidden="true" />
          <span>Feed</span>
        </NavLink>
        <NavLink to="/create" className="nav-pill nav-pill--accent">
          <PlusCircle size={17} aria-hidden="true" />
          <span>Create</span>
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
