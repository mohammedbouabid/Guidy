// Utilitaires pour gérer le scroll

/**
 * Force le scroll vers le haut de façon immédiate
 */
export const scrollToTopImmediate = () => {
  // Plusieurs méthodes pour assurer la compatibilité
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  
  // Pour les éléments avec overflow
  const scrollableElements = document.querySelectorAll('[style*="overflow"]');
  scrollableElements.forEach(element => {
    element.scrollTop = 0;
  });
};

/**
 * Force le scroll vers le haut avec animation fluide
 */
export const scrollToTopSmooth = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

/**
 * Empêche le scroll de restauration du navigateur
 */
export const preventScrollRestoration = () => {
  if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
};

/**
 * Remet le scroll de restauration par défaut
 */
export const enableScrollRestoration = () => {
  if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'auto';
  }
};

/**
 * Vérifie si un élément est en focus et peut causer un scroll automatique
 */
export const checkFocusedElements = () => {
  const focusedElement = document.activeElement;
  if (focusedElement && focusedElement !== document.body) {
    console.log('Element en focus:', focusedElement);
    focusedElement.blur(); // Retire le focus
  }
};

/**
 * Correction complète du scroll au chargement
 */
export const fixScrollOnLoad = () => {
  // Empêche la restauration automatique
  preventScrollRestoration();
  
  // Retire le focus des éléments
  checkFocusedElements();
  
  // Force le scroll vers le haut
  scrollToTopImmediate();
  
  // Attendre que le DOM soit complètement rendu
  setTimeout(() => {
    scrollToTopImmediate();
  }, 0);
  
  // Double vérification après 100ms
  setTimeout(() => {
    scrollToTopImmediate();
  }, 100);
};
