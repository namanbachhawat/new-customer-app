// Checkout Service
// APIs for checkout calculation, session management, and order creation

import apiClient from './apiClient';
import { ENDPOINTS } from './config';
import {
    CheckoutRequest,
    CheckoutResponse,
    CommitCheckoutRequest,
    Order,
} from './types';

// Order type from commit checkout
interface Order {
    orderId: string;
    orderType: 'SINGLE' | 'MULTI_RESTAURANT';
    customerId: string;
    vendorId: number;
    vendorBranchId: number;
    checkoutSessionId: string;
    state: string;
    itemTotal: number;
    deliveryCharges: number;
    platformFee: number;
    gst: number;
    discount: number;
    totalAmount: number;
    paymentStatus: string;
    createdAt: string;
}

class CheckoutService {
    /**
     * Calculate checkout - validates cart and calculates pricing
     * This is step 1 of the two-step checkout process
     * Creates an idempotent checkout session
     */
    async calculateCheckout(request: CheckoutRequest): Promise<CheckoutResponse> {
        const headers: Record<string, string> = {};
        if (request.userId) {
            headers['X-User-Id'] = request.userId;
        }

        return apiClient.post<CheckoutResponse>(
            ENDPOINTS.CHECKOUT_CALCULATE,
            request,
            undefined
        );
    }

    /**
     * Commit checkout - converts session to an order
     * This is step 2 of the two-step checkout process
     */
    async commitCheckout(request: CommitCheckoutRequest): Promise<Order> {
        return apiClient.post<Order>(ENDPOINTS.CHECKOUT_COMMIT, request);
    }

    /**
     * Get existing checkout session by ID
     */
    async getCheckoutSession(sessionId: string): Promise<CheckoutResponse> {
        return apiClient.get<CheckoutResponse>(ENDPOINTS.CHECKOUT_SESSION(sessionId));
    }

    /**
     * Health check for checkout service
     */
    async healthCheck(): Promise<string> {
        return apiClient.get<string>(ENDPOINTS.CHECKOUT_HEALTH);
    }
}

export const checkoutService = new CheckoutService();
export default checkoutService;
