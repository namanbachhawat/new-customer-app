// Services Index
// Export all API services for easy importing

export { ApiError, apiClient } from './apiClient';
export { checkoutService } from './checkoutService';
export { API_CONFIG, ENDPOINTS, getDefaultHeaders } from './config';
export { orderService } from './orderService';
export { searchService } from './searchService';
export { trackingService } from './trackingService';
export { vendorService } from './vendorService';

// Re-export types
export * from './types';

// Default export for convenience
export default {
    apiClient: require('./apiClient').apiClient,
    searchService: require('./searchService').searchService,
    vendorService: require('./vendorService').vendorService,
    checkoutService: require('./checkoutService').checkoutService,
    orderService: require('./orderService').orderService,
    trackingService: require('./trackingService').trackingService,
};
