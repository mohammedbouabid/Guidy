import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fixScrollOnLoad } from '@/utils/scrollUtils';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Correction complète du scroll à chaque changement de route
    fixScrollOnLoad();
  }, [pathname]);

  return null;
};

export default ScrollToTop;
