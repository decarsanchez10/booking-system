import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const revealSelectors = [
  '.section',
  '.section-header',
  '.card',
  '.feature-card',
  '.step-card',
  '.specialty-card',
  '.why-summary',
  '.why-stat',
  '.testimonial-carousel',
  '.trusted-panel',
  '.booking-panel',
  '.service-card',
  '.kb-card',
  '.booking-item',
  '.slot-card',
  '.dash-card',
  '.book-card',
  '.apt-card',
  '.profile-section',
  '.settings-content',
  '.agent-card',
  '.table-row',
  '.sched-row',
  '.forgot-card',
  '.login-card',
  '.signup-card',
  '.not-found-content',
];

const ScrollAnimations = () => {
  const location = useLocation();

  useEffect(() => {
    let ctx;

    const setup = gsap.delayedCall(0.08, () => {
      ctx = gsap.context(() => {
      const elements = gsap.utils.toArray(revealSelectors.join(','));

      elements.forEach((element) => {
        if (element.dataset.scrollReveal === 'off') return;

        gsap.fromTo(
          element,
          {
            autoAlpha: 0,
            y: 34,
            scale: 0.985,
            filter: 'blur(6px)',
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      gsap.utils.toArray('.section-container').forEach((section, index) => {
        gsap.fromTo(
          section,
          { x: index % 2 === 0 ? -18 : 18 },
          {
            x: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
            },
          }
        );
      });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      setup.kill();
      ctx?.revert();
    };
  }, [location.pathname]);

  return null;
};

export default ScrollAnimations;
