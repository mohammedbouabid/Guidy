import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { scrollToTopSmooth } from '@/utils/scrollUtils';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Afficher le bouton quand l'utilisateur a scrollé de 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTopSmooth}
      className="fixed bottom-6 right-6 z-50 bg-[#EB662B] hover:bg-orange-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Retour en haut"
    >
      <ChevronUp size={24} />
    </button>
  );
};

export default ScrollToTopButton;
