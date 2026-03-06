import { getImageUrl } from '../utils/imageUrl'

const ExperienceSection = ({ data }) => {
  const { text, icon, tags } = data || {}

  return (
    <>
      {/* Desktop/Tablet Version */}
      <div className="hidden md:block px-5 md:px-[20px] py-5 relative pb-0">
        <div className="flex items-start justify-between gap-8 relative">
          <div className="max-w-[602px] relative">
            <p className="text-[16px] leading-[1.105] text-black">
              {text || "We start every project with a foundation of experience. We don't only help brands and companies but we build them as well. Our current project is a Test Kitchen that services over 200 people daily with a 5 Star rating."}
            </p>
            
            {/* Icon - Positioned below text on left */}
            {icon && (
              <div className="absolute left-0 mt-2">
                <img 
                  src={getImageUrl(icon)} 
                  alt="Experience icon" 
                  className="w-[50px] h-[58px] object-contain"
                />
              </div>
            )}
          </div>
          
          <div className="flex gap-3 items-center flex-wrap">
            {tags && tags.length > 0 ? (
              tags.map((tag, index) => (
                <div 
                  key={index}
                  className="bg-[#efefef] px-5 py-2.5 rounded-md"
                >
                  <p className="text-[16px] leading-[1.155] text-[#0d0d0d] whitespace-nowrap">
                    {tag}
                  </p>
                </div>
              ))
            ) : (
              <>
                <div className="bg-[#efefef] px-5 py-2.5 rounded-md">
                  <p className="text-[16px] leading-[1.155] text-[#0d0d0d] whitespace-nowrap">
                    100+ Brands
                  </p>
                </div>
                <div className="bg-[#efefef] px-5 py-2.5 rounded-md">
                  <p className="text-[16px] leading-[1.155] text-[#0d0d0d] whitespace-nowrap">
                    45+ Full Time Global Team
                  </p>
                </div>
                <div className="bg-[#efefef] px-5 py-2.5 rounded-md">
                  <p className="text-[16px] leading-[1.155] text-[#0d0d0d] whitespace-nowrap">
                    10+ Years in Business
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Version - No Icon */}
      <div className="md:hidden flex flex-col gap-[30px] px-5 py-[25px]">
        <p className="text-[14px] leading-[1.105] text-black">
          {text || "We start every project with a foundation of experience. We don't only help brands and companies but we build them as well. Our current project is a Test Kitchen that services over 200 people daily with a 5 Star rating."}
        </p>
        <div className="flex flex-col gap-2.5 items-start">
          {tags && tags.length > 0 ? (
            tags.map((tag, index) => (
              <div 
                key={index}
                className="bg-[#efefef] px-3 py-2.5 rounded-md inline-block"
              >
                <p className="text-[14px] leading-[1.155] text-[#0d0d0d] whitespace-nowrap">
                  {tag}
                </p>
              </div>
            ))
          ) : (
            <>
              <div className="bg-[#efefef] px-3 py-2.5 rounded-md inline-block">
                <p className="text-[14px] leading-[1.155] text-[#0d0d0d] whitespace-nowrap">
                  100+ Brands
                </p>
              </div>
              <div className="bg-[#efefef] px-3 py-2.5 rounded-md inline-block">
                <p className="text-[14px] leading-[1.155] text-[#0d0d0d] whitespace-nowrap">
                  10+ Years in Business
                </p>
              </div>
              <div className="bg-[#efefef] px-3 py-2.5 rounded-md inline-block">
                <p className="text-[14px] leading-[1.155] text-[#0d0d0d] whitespace-nowrap">
                  45+ Full Time Global Team
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ExperienceSection
