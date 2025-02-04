import { Link } from 'react-router-dom'
import './Button.css'

export function Button(props) {
  const { title, href, onClick, isActive} = props

  return (
    <Link to={href}>
      <button
        className={`header-button ${isActive ? 'active-button' : ''}`}
        onClick={onClick}>
        {title}
      </button>
    </Link>
  )
}
