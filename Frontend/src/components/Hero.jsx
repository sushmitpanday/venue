import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaSlidersH } from 'react-icons/fa';

// Images - Path check kar lena apne folder ke hisaab se
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
      <section className="main-slider-one">
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
              <div className="main-slider-one__item">
                {/* Background Image Layer */}
                <div 
                  className="main-slider-one__bg" 
                  style={{ backgroundImage: `url(${slide.img})` }}
                />
                
                {/* Overlay Layer */}
                <div className="main-slider-one__overlay"></div>

                <div className="container">
                  <div className="row">
                    <div className="col-md-12 text-center">
                      <div className="main-slider-one__content">
                        <h5 className="main-slider-one__sub-title animate-text">{slide.sub}</h5>
                        <div className="main-slider-one__box">
                          <h2 className="main-slider-one__title animate-text-delay">
                            {slide.title} <br /> <span>{slide.span}</span>
                          </h2>
                        </div>
                        <div className="main-slider-one__btn animate-text-delay-2 mt-4">
                           <a href="#" className="thm-btn inline-block bg-white text-[#031930] px-8 py-3 rounded-full font-bold">
                              Book Now
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

      {/* Booking Bar - Now 100% Width & Below Image */}
      <div className="booking-container">
        <div className="booking-wrapper">
          {/* Check In */}
          <div className="booking-item">
            <div className="booking-content">
              <span className="label">CHECKIN</span>
              <p className="value">22/07/2023</p>
            </div>
            <FaCalendarAlt className="icon" />
          </div>

          {/* Check Out */}
          <div className="booking-item border-left">
            <div className="booking-content">
              <span className="label">CHECKOUT</span>
              <p className="value">22/07/2023</p>
            </div>
            <FaCalendarAlt className="icon" />
          </div>

          {/* Guests */}
          <div className="booking-item border-left">
            <div className="booking-content">
              <span className="label">GUESTS</span>
              <div className="guest-control">
                 <p className="value">1</p>
                 <div className="plus-minus">
                    <span>-</span>
                    <span>+</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="booking-item border-left flex-grow">
            <div className="booking-content">
              <span className="label">LOCATION</span>
              <p className="value">Where To Next?</p>
            </div>
            <FaMapMarkerAlt className="icon" />
          </div>

          {/* Actions */}
          <div className="booking-actions">
             <FaSlidersH className="filter-icon" />
             <button className="search-btn">
                <FaSearch />
             </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;