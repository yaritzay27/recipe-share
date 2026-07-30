import { Search } from 'lucide-react'

function SearchBar({ value, onChange }) {
  return (
    <label className="search-bar">
      <Search size={18} aria-hidden="true" />
      <span className="sr-only">Search recipes by title</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search recipes by title"
      />
    </label>
  )
}

export default SearchBar

