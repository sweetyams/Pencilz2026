import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../utils/imageUrl'
import { API_URL } from '../config'

const Button = ({ 
  children, 
  href, 
  to,
  onClick, 
  variant = 'default', // 'default' (white) or 'primary' (uses settings color)
  icon,
  subtext,
  className = '',
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [settings, setSettings] = useState({})

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  const primaryColor = settings.primaryButtonColor || '#E7FE89'

  const defaultIcon = (
    <svg width="39" height="19" viewBox="0 0 39 19" fill="none">
      <path d="M29.5 2L37 9.5L29.5 17" stroke="black" strokeWidth="2"/>
      <path d="M2 9.5H37" stroke="black" strokeWidth="2"/>
    </svg>
  )

  // Base styles
  const baseStyles = `
    border border-black flex items-center relative rounded-[70px] transition-all duration-300 ease-in-out
  `

  // Background and border based on hover and variant
  const stateStyles = variant === 'primary'
    ? 'border-dashed' // No background class for primary - use inline style
    : isHovered 
      ? 'bg-[#89FED7] border-dashed' 
      : 'bg-white border-solid'

  // Fixed padding - no change on hover
  const paddingStyles = 'px-6 py-4 lg:px-6 lg:py-3'

  // Layout - mobile always justify-between, desktop only on hover
  const layoutStyles = 'justify-between lg:justify-start'
  const layoutHoverStyles = isHovered ? 'lg:justify-between' : ''

  const combinedClassName = `${baseStyles} ${stateStyles} ${paddingStyles} ${layoutStyles} ${layoutHoverStyles} ${className}`
  
  // For primary variant: always use inline style for background
  // White by default, CMS color on hover
  const combinedStyle = variant === 'primary'
    ? { backgroundColor: isHovered ? primaryColor : '#ffffff' }
    : {}

  // Use the icon prop passed to the button (from individual button data)
  const displayIcon = icon

  const content = subtext ? (
    <>
      {/* Mobile/Tablet: stacked text */}
      <div className="lg:hidden flex flex-col gap-1 leading-[1.155] text-black items-start">
        <p className="font-['IBM_Plex_Sans',sans-serif] font-normal text-[20px] text-left">
          {children}
        </p>
        <p className="font-['IBM_Plex_Sans',sans-serif] font-normal text-[16px] text-left">
          {subtext}
        </p>
      </div>
      
      {/* Desktop: stacked text, left-aligned */}
      <div className="hidden lg:flex flex-col gap-1 leading-[1.155] text-black items-start">
        <p className="font-['IBM_Plex_Sans',sans-serif] font-normal text-[20px] text-left">
          {children}
        </p>
        <p className="font-['IBM_Plex_Sans',sans-serif] font-normal text-[16px] text-left">
          {subtext}
        </p>
      </div>
      
      {/* Icon - only visible on hover for desktop */}
      {isHovered && (
        <>
          {displayIcon ? (
            <img 
              src={getImageUrl(displayIcon)}
              alt="" 
              className="hidden lg:block w-[39px] h-[19px] flex-shrink-0"
            />
          ) : (
            <div className="hidden lg:block flex-shrink-0">
              {defaultIcon}
            </div>
          )}
        </>
      )}
    </>
  ) : (
    <>
      <span className="font-['IBM_Plex_Sans',sans-serif] font-normal text-[20px] leading-[1.155] text-black text-left">
        {children}
      </span>
      
      {/* Icon - only visible on hover for desktop */}
      {isHovered && (
        <>
          {displayIcon ? (
            <img 
              src={getImageUrl(displayIcon)}
              alt="" 
              className="hidden lg:block w-[39px] h-[19px] flex-shrink-0"
            />
          ) : (
            <div className="hidden lg:block flex-shrink-0">
              {defaultIcon}
            </div>
          )}
        </>
      )}
    </>
  )

  const commonProps = {
    className: combinedClassName,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    ...props,
    // Style must come after ...props to ensure it's not overridden
    style: { ...props.style, ...combinedStyle }
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
