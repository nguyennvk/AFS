// Configuration file for API settings
// Ensures consistent access to environment variables throughout the app

// Get environment variables with fallbacks
export const AFS_API_URL = process.env.BASE_API_URL || 'https://advanced-flights-system.replit.app';
export const AFS_API_KEY = process.env.API_KEY || '54d3070aa9328a1dd7b7b4455e86a330038c289dafc7fda985777b8030079b01';

// Log configuration when loaded (helpful for debugging)
console.log('API Configuration loaded:');
console.log('- AFS_API_URL:', AFS_API_URL);
console.log('- AFS_API_KEY:', AFS_API_KEY ? (AFS_API_KEY.substring(0, 5) + '...' + AFS_API_KEY.substring(AFS_API_KEY.length - 4)) : 'Not set'); 