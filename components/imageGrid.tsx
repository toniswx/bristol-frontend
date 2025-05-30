import React from "react";
import "../styles/pinterestGrid.css"; // Create this CSS file
import Image from "next/image";

const ImageGrid = ({ images, onSelectCover }) => {
  return (
    <div className="pinterest-grid">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`grid-item ${index === 0 ? "cover-photo" : ""}`}
          onClick={() => onSelectCover(index)}
        >
          <Image
            src={image.url}
            alt={`Property view ${index + 1}`}
            loading="lazy"
          />
          {index === 0 && <div className="cover-badge">Capa</div>}
          <div className="image-actions">
            <button
              className="make-cover-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelectCover(index);
              }}
            >
              Tornar capa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
