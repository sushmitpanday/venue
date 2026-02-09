import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaSlidersH } from 'react-icons/fa';

// Images
import Img1 from '../../public/slider-1-1.jpg';
import Img2 from '../../public/slider-1-1.jpg';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

const Hero = () => {
  const slides = [
    { 
      id: 1, 
      title: "Enjoy Luxury", 
      span: "Experience", 
      sub: "The best 5 star hotel", 
      img: Img1 
    },
    { 
      id: 2, 
      title: "Modern Stay", 
      span: "Comfort", 
      sub: "Redefining hospitality", 
      img: Img2 
    },
  ];

  return (
    <>
      <section className="main-slider-one bg-black">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={1500}
          allowTouchMove={false}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="main-slider-one__item relative overflow-hidden">
                {/* Background Image Layer with Dark Tint */}
                <div 
                  className="main-slider-one__bg opacity-60" 
                  style={{ 
                    backgroundImage: `url(${slide.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                
                {/* Dark Overlay Layer - Makes text pop on Black theme */}
                <div className="main-slider-one__overlay absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black"></div>

                <div className="container relative z-10">
                  <div className="row">
                    <div className="col-md-12 text-center">
                      <div className="main-slider-one__content py-20 md:py-40">
                        {/* Subtitle with Cyan touch */}
                        <h5 className="main-slider-one__sub-title animate-text text-cyan-400 uppercase tracking-[4px] font-bold mb-4">
                          {slide.sub}
                        </h5>
                        
                        <div className="main-slider-one__box">
                          <h2 className="main-slider-one__title animate-text-delay text-white text-5xl md:text-7xl font-black leading-tight">
                            {slide.title} <br /> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">
                              {slide.span}
                            </span>
                          </h2>
                        </div>

                        {/* Buttons converted to Black/Cyan Theme */}
                        <div className="main-slider-one__btn animate-text-delay-2 mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
                          <a 
                            href="#" 
                            className="thm-btn inline-block bg-white text-black hover:bg-cyan-500 hover:text-black px-10 py-4 rounded-full font-black uppercase text-[12px] tracking-widest transition-all shadow-xl"
                          >
                            Book Now
                          </a>
                          <a 
                            href="#" 
                            className="thm-btn inline-block bg-zinc-900 text-white border border-white/20 hover:border-cyan-500 hover:text-cyan-400 px-10 py-4 rounded-full font-black uppercase text-[12px] tracking-widest transition-all"
                          >
                            VIEW MORE
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
};

export default Hero;