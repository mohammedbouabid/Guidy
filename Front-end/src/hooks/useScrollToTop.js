import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fixScrollOnLoad, scrollToTopSmooth } from '@/utils/scrollUtils';

export const useScrollToTop = (dependencies = []) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Utilise la fonction de correction complète
    fixScrollOnLoad();
  }, [pathname, ...dependencies]);

  // Fonction utilitaire pour scroller vers le haut manuellement
  const scrollToTop = (smooth = true) => {
    if (smooth) {
      scrollToTopSmooth();
    } else {
      fixScrollOnLoad();
    }
  };

  return { scrollToTop };
};
