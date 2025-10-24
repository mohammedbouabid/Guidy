import React from 'react';
import ErrorBoundary from './ErrorBoundary';

// Wrapper component that provides error boundary for the entire app
const AppWithErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

export default AppWithErrorBoundary;
