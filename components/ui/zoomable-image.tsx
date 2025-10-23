"use client";

import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

interface ZoomableImageProps {
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt = "",
  className = "",
  onClick,
}) => {
  return (
    <Zoom>
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer hover:opacity-90 transition-opacity ${className}`}
        onClick={onClick}
      />
    </Zoom>
  );
};

export default ZoomableImage;
