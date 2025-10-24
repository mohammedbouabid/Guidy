// Validation functions for pack forms
export const validatePackForm = (form, selectedPlaces = [], imageFile = null, isUpdate = false) => {
  const errors = {};
  
  // Title validation
  if (!form.title || form.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }
  
  // Description validation
  if (!form.description || form.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }
  
  // Price validation
  if (!form.price || Number(form.price) <= 0) {
    errors.price = 'Price must be a positive number';
  } else if (Number(form.price) > 10000) {
    errors.price = 'Price must be less than $10,000';
  }
  
  // Date validations
  if (!form.startDate) {
    errors.startDate = 'Start date is required';
  } else {
    const start = new Date(form.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) {
      errors.startDate = 'Start date cannot be in the past';
    } else {
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 15);
      if (start < minDate) {
        errors.startDate = 'Start date must be at least 15 days in the future';
      }
    }
  }
  
  if (!form.endDate) {
    errors.endDate = 'End date is required';
  } else if (form.startDate) {
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    if (end <= start) {
      errors.endDate = 'End date must be after the start date';
    }
  }
  
  // Location validations
  if (!form.startLocation || form.startLocation.trim().length < 2) {
    errors.startLocation = 'Start location is required and must be at least 2 characters';
  }
  
  if (!form.endLocation || form.endLocation.trim().length < 2) {
    errors.endLocation = 'End location is required and must be at least 2 characters';
  }
  
  // Max clients validation
  if (!form.maxClients || Number(form.maxClients) <= 0) {
    errors.maxClients = 'Max clients must be a positive number';
  } else if (Number(form.maxClients) > 100) {
    errors.maxClients = 'Max clients cannot exceed 100';
  }
  
  // Guide places validation
  if (!selectedPlaces.length) {
    errors.guidesPlacesId = 'Select at least one place';
  }
  
  // Image validation (only required for new packs)
  if (!isUpdate && !imageFile) {
    errors.profileImg = 'An image is required';
  }
  
  return errors;
};

// Helper function to clear specific field errors
export const clearFieldError = (errors, fieldName) => {
  if (errors[fieldName]) {
    const newErrors = { ...errors };
    delete newErrors[fieldName];
    return newErrors;
  }
  return errors;
};
