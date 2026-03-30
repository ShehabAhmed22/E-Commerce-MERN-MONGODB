import React, { useState, useEffect, useRef } from "react";
import "./Slider.css";

const defaultSlides = [
  {
    id: 1,
    title: "New Season Collection",
    subtitle: "Up to 40% off on selected items",
    cta: "Shop Now",
    bg: "#1a1a2e",
    accent: "#f59e0b",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
  },
  {
    id: 2,
    title: "Exclusive Deals Today",
    subtitle: "Limited time offers on top brands",
    cta: "Explore",
    bg: "#0f3460",
    accent: "#22c55e",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  },
  {
    id: 3,
    title: "Premium Quality",
    subtitle: "Crafted for those who value the best",
    cta: "Discover",
    bg: "#2d1b69",
    accent: "#ec4899",
    image:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80",
  },
];

const Slider = ({
  slides = defaultSlides,
  autoPlay = true,
  interval = 5000,
}) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("next");
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = (index, dir = "next") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 420);
  };

  const next = () => goTo((current + 1) % slides.length, "next");
  const prev = () =>
    goTo((current - 1 + slides.length) % slides.length, "prev");

  useEffect(() => {
    if (!autoPlay) return;
    timerRef.current = setInterval(next, interval);
    return () => clearInterval(timerRef.current);
  }, [current, autoPlay, interval]);

  const slide = slides[current];

  return (
    <div
      className={`slider ${animating ? `slider--${direction}` : ""}`}
      style={{ "--slide-bg": slide.bg, "--slide-accent": slide.accent }}
      onMouseEnter={() => clearInterval(timerRef.current)}
      onMouseLeave={() => {
        if (autoPlay) timerRef.current = setInterval(next, interval);
      }}
    >
      <div className="slider__bg" style={{ background: slide.bg }} />

      <div className="slider__image-wrap">
        <img src={slide.image} alt={slide.title} className="slider__image" />
        <div className="slider__image-overlay" />
      </div>

      <div className="slider__content">
        <p className="slider__subtitle">{slide.subtitle}</p>
        <h2 className="slider__title">{slide.title}</h2>
        <button className="slider__cta" style={{ background: slide.accent }}>
          {slide.cta} →
        </button>
      </div>

      {/* Arrows */}
      <button
        className="slider__arrow slider__arrow--prev"
        onClick={prev}
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        className="slider__arrow slider__arrow--next"
        onClick={next}
        aria-label="Next"
      >
        ›
      </button>

      {/* Dots */}
      <div className="slider__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`slider__dot ${i === current ? "active" : ""}`}
            style={i === current ? { background: slide.accent } : {}}
            onClick={() => goTo(i, i > current ? "next" : "prev")}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      {autoPlay && (
        <div className="slider__progress">
          <div
            key={current}
            className="slider__progress-bar"
            style={{
              "--duration": `${interval}ms`,
              background: slide.accent,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Slider;
