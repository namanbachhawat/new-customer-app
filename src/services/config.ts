// API Configuration for Nashtto Customer App
// Base URL and common configuration for all API calls

export const API_CONFIG = {
    BASE_URL: 'http://54.87.117.181:8080',
    TIMEOUT: 30000, // 30 seconds
    VERSION: 'v1',
};

// API Endpoints organized by feature
export const ENDPOINTS = {
    // Search & Discovery
    SEARCH: '/api/v1/search',
    DISCOVERY_FEED: '/api/v1/search/feed',
    RECOMMENDATIONS: '/api/v1/search/recommendations',
    VENDOR_MENU: (branchId: number) => `/api/v1/search/vendors/${branchId}/menu`,

    // Vendor & Branch
    VENDOR: (vendorId: number) => `/api/v1/vendors/${vendorId}`,
    BRANCH: (branchId: number) => `/api/v1/branches/${branchId}`,
    BRANCH_MENU: (branchId: number) => `/api/v1/menu-items/branches/${branchId}`,
    MENU_ITEM: (menuItemId: number) => `/api/v1/menu-items/${menuItemId}`,

    // Checkout
    CHECKOUT_CALCULATE: '/api/v1/checkout/calculate',
    CHECKOUT_COMMIT: '/api/v1/checkout/commit',
    CHECKOUT_SESSION: (sessionId: string) => `/api/v1/checkout/session/${sessionId}`,
    CHECKOUT_HEALTH: '/api/v1/checkout/health',

    // Orders
    ORDERS: '/api/v1/orders',
    ORDER: (orderId: string) => `/api/v1/orders/${orderId}`,
    ORDER_CANCEL: (orderId: string) => `/api/v1/orders/${orderId}/cancel`,

    // Customer Order Tracking
    ORDER_STATUS: (customerId: string, orderId: string) =>
        `/api/v1/customers/${customerId}/orders/${orderId}/status`,

    // Delivery Tracking
    ORDER_DELIVERY: (orderId: string) => `/api/v1/orders/${orderId}/delivery`,
    DELIVERY: (deliveryId: string) => `/api/v1/deliveries/${deliveryId}`,
    DELIVERY_LOCATION: (deliveryId: string) => `/api/v1/deliveries/${deliveryId}/location`,
};

// Default headers for API requests
export const getDefaultHeaders = (customerId?: string) => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(customerId && { 'X-Customer-Id': customerId }),
});

export default API_CONFIG;
