import { ArrowUpDown } from 'lucide-react'
import { sortOptions } from '../utils/options'

function SortDropdown({ value, onChange }) {
  return (
    <label className="select-control">
      <ArrowUpDown size={17} aria-hidden="true" />
      <span className="sr-only">Sort recipes</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default SortDropdown

