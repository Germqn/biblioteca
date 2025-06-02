import React, { useRef, useEffect, useMemo } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LibroCard from './LibroCard';
import './LibrosCarrusel.css';

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-arrow custom-slick-arrow right-[-15px] md:right-[-25px] before:text-blue-500 dark:before:text-red-700 hover:before:opacity-100 before:text-3xl before:opacity-80`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-arrow custom-slick-arrow left-[-15px] md:left-[-25px] before:text-blue-500 dark:before:text-red-700 hover:before:opacity-100 before:text-3xl before:opacity-80`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    />
  );
};

const LibrosCarrusel = ({ libros, onEdit, onDelete, maxRandomBooksToShow = 8 }) => {
  const sliderRef = useRef(null);

  const librosParaMostrar = useMemo(() => {
    if (!libros || libros.length === 0) {
      return [];
    }
    const shuffled = shuffleArray(libros);
    return shuffled.slice(0, Math.min(maxRandomBooksToShow, shuffled.length));
  }, [libros, maxRandomBooksToShow]);

  // Reiniciar el carrusel cuando cambian los libros a mostrar
  useEffect(() => {
    if (sliderRef.current && librosParaMostrar.length > 0) {
      sliderRef.current.slickGoTo(0);
    }
  }, [librosParaMostrar]);

  if (librosParaMostrar.length === 0) {
    return (
      <div className="my-12 p-6 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-700 dark:to-neutral-800 rounded-xl shadow-lg">
        <h2 className="text-center text-2xl sm:text-3xl text-slate-700 dark:text-gray-100 mb-4 font-semibold">
          Libros Destacados
        </h2>
        <div className="w-20 h-1 bg-blue-500 dark:bg-red-700 mx-auto mb-8 rounded"></div>
        <p className="text-gray-500 dark:text-gray-400 text-center">No hay libros para mostrar</p>
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: librosParaMostrar.length > Math.min(4, librosParaMostrar.length), // Make infinite true only if there are enough books to scroll beyond initial view
    speed: 500,
    slidesToShow: Math.min(4, librosParaMostrar.length),
    slidesToScroll: 1,
    ref: sliderRef,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: Math.min(3, librosParaMostrar.length) }
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: Math.min(2, librosParaMostrar.length) }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          arrows: librosParaMostrar.length > 1 // Ocultar flechas si solo hay un libro
        }
      }
    ],
  };

  return (
    <div className="my-12 p-6 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-neutral-700 dark:to-neutral-800 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.08)] dark:shadow-[0_6px_18px_rgba(0,0,0,0.2)]">
      <h2 className="text-center text-2xl sm:text-3xl text-slate-700 dark:text-gray-100 mb-4 font-semibold">
        Libros Destacados
      </h2>
      <div className="w-20 h-1 bg-blue-500 dark:bg-red-700 mx-auto mb-8 rounded"></div>

      <div className="libros-carrusel-container"> {/* Added for dot styling scope */}
        <Slider {...settings}>
          {librosParaMostrar.map(libro => (
            <div key={libro.id_libro || libro.id} className="px-2 sm:px-4 h-full"> {/* Ensure padding for slides and h-full for card height */}
              <LibroCard
                libro={libro}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default LibrosCarrusel;
