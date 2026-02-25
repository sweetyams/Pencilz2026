import { useState } from 'react'
import { Link } from 'react-router-dom'

const Button = ({ 
  children, 
  href, 
  to,
  onClick, 
  variant = 'default', // 'default' (white) or 'primary' (yellow)
  icon,
  subtext,
  className = '',
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const defaultIcon = (
    <svg width="39" height="19" viewBox="0 0 39 19" fill="none">
      <path d="M29.5 2L37 9.5L29.5 17" stroke="black" strokeWidth="2"/>
      <path d="M2 9.5H37" stroke="black" strokeWidth="2"/>
    </svg>
  )

  const baseStyles = `
    flex items-center justify-between px-10 py-2.5 
    rounded-[70px] transition-all duration-300 ease-in-out
    border border-black
  `

  const variantStyles = {
    default: isHovered 
      ? 'bg-[#e7fe89] border-dashed' 
      : 'bg-white border-solid',
    primary: 'bg-[#e7fe89] border-dashed'
  }

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`

  const content = subtext ? (
    <>
      <div className="flex flex-col">
        <span className="text-2xl text-black">{children}</span>
        <span className="text-base text-black">{subtext}</span>
      </div>
      {icon ? (
        <img src={icon} alt="" className="w-[39px] h-[19px] flex-shrink-0" />
      ) : (
        <div className="flex-shrink-0">{defaultIcon}</div>
      )}
    </>
  ) : (
    <>
      <span className="text-2xl text-black">{children}</span>
      {icon ? (
        <img src={icon} alt="" className="w-[39px] h-[19px] flex-shrink-0" />
      ) : (
        <div className="flex-shrink-0">{defaultIcon}</div>
      )}
    </>
  )

  const commonProps = {
    className: combinedClassName,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    ...props
  }

  if (to) {
    return (
      <Link to={to} {...commonProps}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} {...commonProps}>
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick} {...commonProps}>
      {content}
    </button>
  )
}

export default Button
