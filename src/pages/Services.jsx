import { useState, useEffect } from 'react'
import { API_URL } from '../config'

const Services = () => {
  const [pageData, setPageData] = useState({
    heroTitle: 'Our Services',
    heroSubtitle: 'Enterprise-Level Expertise, Tailored for Growing Brands',
    heroDescription: 'Shopify Development, Marketing, Design, and Start-up Support',
    serviceCards: []
  })

  useEffect(() => {
    fetch(`${API_URL}/api/pages/services`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setPageData(data)
        }
      })
      .catch(err => console.error('Error loading services:', err))
  }, [])

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col gap-8 py-24 items-center justify-center px-4">
        <div className="flex flex-col gap-3 items-center max-w-[176px]">
          <p className="font-light text-2xl text-black text-center uppercase">
            {pageData.heroTitle}
          </p>
        </div>
        <div className="flex flex-col gap-3 items-center text-center max-w-4xl">
          <p className="text-4xl md:text-5xl text-black font-normal">
            {pageData.heroSubtitle}
          </p>
          <p className="text-xl font-light text-black">
            {pageData.heroDescription}
          </p>
        </div>
      </div>

      {/* Service Cards */}
      <div className="flex flex-col gap-5 items-center px-4 pb-12 max-w-[1402px] mx-auto">
        {pageData.serviceCards?.map((card, index) => (
          <div 
            key={card.id} 
            id={card.anchor}
            className="w-full rounded-[20px] overflow-hidden relative"
            style={{ backgroundColor: card.backgroundColor }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Left Content */}
              <div className="flex-1 p-8 md:p-16 flex flex-col gap-11 order-2 md:order-1">
                {/* Count and Card Title at Top */}
                <div className="flex justify-between items-start">
                  <p 
                    className="text-base font-light"
                    style={{ color: card.invertText ? '#ffffff' : '#282828' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <p 
                    className="text-base font-light text-right"
                    style={{ color: card.invertText ? '#ffffff' : '#282828' }}
                  >
                    {card.title}
                  </p>
                </div>

                {/* Title */}
                <div className="flex gap-2.5 items-end">
                  <p 
                    className="text-4xl md:text-5xl font-medium"
                    style={{ color: card.invertText ? '#ffffff' : '#282828' }}
                  >
                    {card.title}
                  </p>
                  <p 
                    className="text-base font-light"
                    style={{ color: card.invertText ? '#ffffff' : '#282828' }}
                  >
                    / {card.subtitle}
                  </p>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-6">
                  <p 
                    className="text-lg font-light"
                    style={{ color: card.invertText ? '#ffffff' : '#282828' }}
                  >
                    {card.description}
                  </p>
                  {card.detailedDescription && (
                    <p 
                      className="text-base font-light"
                      style={{ color: card.invertText ? '#ffffff' : '#282828' }}
                    >
                      {card.detailedDescription}
                    </p>
                  )}
                </div>

                {/* Sub Services */}
                {card.subServices && card.subServices.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <p 
                      className="text-lg font-medium"
                      style={{ color: card.invertText ? '#ffffff' : '#000000' }}
                    >
                      {card.subServicesTitle || 'Services'}
                    </p>
                    <div 
                      className="h-px w-full"
                      style={{ backgroundColor: card.invertText ? '#ffffff' : '#000000' }}
                    />
                    {card.subServices.map((service, idx) => (
                      <div key={idx}>
                        <div 
                          className={`flex gap-4 items-center px-2.5 py-4 rounded-md ${
                            service.highlighted 
                              ? card.invertText 
                                ? 'bg-[#e7fe89]' 
                                : 'bg-black'
                              : ''
                          }`}
                        >
                          <p 
                            className={`flex-1 text-base ${
                              service.highlighted 
                                ? card.invertText
                                  ? 'text-[#131010] font-normal'
                                  : 'text-white font-normal'
                                : card.invertText
                                  ? 'text-[#828282] font-light'
                                  : 'text-black font-light'
                            }`}
                          >
                            {service.name}
                          </p>
                          {/* Arrow Icon */}
                          {pageData.serviceArrowIcon ? (
                            <img 
                              src={pageData.serviceArrowIcon} 
                              alt="arrow"
                              className="w-5 h-5"
                              style={{
                                filter: service.highlighted 
                                  ? card.invertText 
                                    ? 'none' 
                                    : 'invert(1)'
                                  : card.invertText
                                    ? 'brightness(0.5)'
                                    : 'none'
                              }}
                            />
                          ) : (
                            <div className="w-5 h-0.5">
                              <svg viewBox="0 0 20 2" fill="none">
                                <path 
                                  d="M0 1h20" 
                                  stroke={
                                    service.highlighted 
                                      ? card.invertText 
                                        ? '#131010' 
                                        : '#ffffff'
                                      : card.invertText
                                        ? '#828282'
                                        : '#000000'
                                  } 
                                  strokeWidth="1"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div 
                      className="h-px w-full"
                      style={{ backgroundColor: card.invertText ? '#ffffff' : '#000000' }}
                    />
                  </div>
                )}
              </div>

              {/* Right Image - 50% width with 80px padding, square aspect ratio */}
              <div className="flex-1 p-8 md:p-20 order-1 md:order-2">
                {card.image && (
                  <div className="w-full aspect-square">
                    <img 
                      src={card.image} 
                      alt={card.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Services
