import React from 'react';

const Illustration = ({ src }) => {
  // Use images placed in public/assets/illustration
  const imageSrc = src || '/assets/illustration/6491945.jpg';
  return (
    <div className="auth-illustration " aria-hidden>
      <img src={imageSrc} alt="decoration" />
    </div>
  );
};

export default Illustration;
