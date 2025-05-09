import { format } from 'date-fns';

// Function to format date
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'; // Return 'N/A' if dateString is null or undefined
  try {
    return format(new Date(dateString), 'dd/MM/yyyy'); // Format date to dd/MM/yyyy
  } catch (error) {
    console.error('Invalid date:', dateString);
    return 'Invalid Date';
  }
};
