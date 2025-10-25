import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onClick?: () => void;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = 'https://img.freepik.com/premium-vector/mystery-contest-cardboard-box-with-question-mystery-box-gift-question-icon_501224-104.jpg?semt=ais_hybrid&w=740&q=80',
  onClick
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setHasError(false);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      onClick={onClick}
    />
  );
};

export default ImageWithFallback;