// Checkout Service
// APIs for checkout calculation, session management, and order creation

import apiClient from './apiClient';
import { ENDPOINTS } from './config';
import {
    CheckoutRequest,
    CheckoutResponse,
    CommitCheckoutRequest,
    OrderDetailsResponse,
} from './types';

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
    async commitCheckout(request: CommitCheckoutRequest): Promise<OrderDetailsResponse> {
        return apiClient.post<OrderDetailsResponse>(ENDPOINTS.CHECKOUT_COMMIT, request);
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

