import React, { useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LibroCard from './LibroCard';
import './LibrosCarrusel.css';

const LibrosCarrusel = ({ libros, onEdit, onDelete }) => {
  const sliderRef = useRef(null);

  // Reiniciar el carrusel cuando cambian los libros
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
  }, [libros]);

  const settings = {
    dots: true,
    infinite: false, // Cambiado a false para evitar problemas
    speed: 500,
    slidesToShow: Math.min(4, libros.length),
    slidesToScroll: 1,
    ref: sliderRef,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: Math.min(3, libros.length) }
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: Math.min(2, libros.length) }
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <div className="libros-carrusel-container">
      <h2 className="libros-carrusel-title">Libros Destacados</h2>
      {libros.length > 0 ? (
        <Slider {...settings}>
          {libros.map(libro => (
            <div key={libro.id_libro} className="libro-slide">
              <LibroCard 
                libro={libro}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-muted text-center">No hay libros para mostrar</p>
      )}
    </div>
  );
};

export default LibrosCarrusel;