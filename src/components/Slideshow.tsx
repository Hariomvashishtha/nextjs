'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './Slideshow.module.css';

const TOTAL_SLIDES = 4;

const Slideshow = () => {
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // Set initial positions
    slidesRef.current.forEach((slide, i) => {
      if (i === 0) {
        gsap.set(slide, { 
          x: 0,
          zIndex: 2, 
          scale: 1,
          opacity: 1
        }); // Current slide
      } else if (i === 1) {
        gsap.set(slide, { 
          x: '100%',
          zIndex: 1, 
          scale: 0.8,
          opacity: 0.6
        }); // Right slide
      } else if (i === TOTAL_SLIDES - 1) {
        gsap.set(slide, { 
          x: '-100%',
          zIndex: 1, 
          scale: 0.8,
          opacity: 0.6
        }); // Left slide
      } else {
        gsap.set(slide, { 
          x: '100%',
          zIndex: 0, 
          scale: 0.8,
          opacity: 0
        });
      }
    });
    
    const duration = 1;
    const stayDuration = 2;
    const totalDuration = duration + stayDuration;
    
    timelineRef.current = gsap.timeline({ repeat: -1, paused: true });
    
    slidesRef.current.forEach((slide, index) => {
      const isLast = index === TOTAL_SLIDES - 1;
      const nextIndex = isLast ? 0 : index + 1;
      const prevIndex = index === 0 ? TOTAL_SLIDES - 1 : index - 1;
      
      timelineRef.current!.add(() => {
        setCurrentSlide(index);
        
        slidesRef.current.forEach((s, i) => {
          if (i === index) {
            gsap.to(s, { 
              x: 0,
              zIndex: 2, 
              scale: 1,
              opacity: 1,
              duration: 0.5
            });
          } else if (i === nextIndex) {
            gsap.to(s, { 
              x: '100%',
              zIndex: 1, 
              scale: 0.8,
              opacity: 0.6,
              duration: 0.5
            });
          } else if (i === prevIndex) {
            gsap.to(s, { 
              x: '-100%',
              zIndex: 1, 
              scale: 0.8,
              opacity: 0.6,
              duration: 0.5
            });
          } else {
            gsap.to(s, { 
              x: '100%',
              zIndex: 0, 
              scale: 0.8,
              opacity: 0,
              duration: 0.5
            });
          }
        });
      }, index * totalDuration);

      timelineRef.current!.to({}, { duration: stayDuration });

      if (isLast) {
        timelineRef.current!.set(slidesRef.current[0], { x: '100%' });
      }
    });

    // Start the animation
    timelineRef.current.play();

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (timelineRef.current) {
      if (isPlaying) {
        timelineRef.current.pause();
      } else {
        timelineRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !slidesRef.current.includes(el)) {
      slidesRef.current.push(el);
    }
  };

  return (
    <div className={styles.slideshowWrapper}>
      <div className={styles.slideshowContainer}>
        <div ref={addToRefs} className={styles.slide} style={{ backgroundColor: '#FF6B6B' }}>
          <h2>1</h2>
        </div>
        <div ref={addToRefs} className={styles.slide} style={{ backgroundColor: '#4ECDC4' }}>
          <h2>2</h2>
        </div>
        <div ref={addToRefs} className={styles.slide} style={{ backgroundColor: '#45B7D1' }}>
          <h2>3</h2>
        </div>
        <div ref={addToRefs} className={styles.slide} style={{ backgroundColor: '#96CEB4' }}>
          <h2>4</h2>
        </div>
      </div>
      
      <div className={styles.controls}>
        <button 
          className={styles.playPauseButton} 
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className={styles.indicators}>
          {[...Array(TOTAL_SLIDES)].map((_, index) => (
            <div 
              key={index} 
              className={`${styles.indicator} ${currentSlide === index ? styles.active : ''}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slideshow; 