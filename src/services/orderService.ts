// Order Service
// APIs for order management - create, list, get, cancel

import apiClient from './apiClient';
import { ENDPOINTS } from './config';
import {
    CancelOrderRequest,
    CreateOrderFromCheckoutRequest,
    ListOrdersParams,
    OrderResponse,
    OrderState,
} from './types';

class OrderService {
    /**
     * Create order from checkout session
     * Executes payment and creates the order
     */
    async createOrder(request: CreateOrderFromCheckoutRequest): Promise<OrderResponse> {
        return apiClient.post<OrderResponse>(ENDPOINTS.ORDERS, request);
    }

    /**
     * List orders for the authenticated customer
     * Optionally filter by order state
     */
    async listOrders(params?: ListOrdersParams): Promise<OrderResponse[]> {
        return apiClient.get<OrderResponse[]>(ENDPOINTS.ORDERS, {
            state: params?.state,
        });
    }

    /**
     * Get order details by order ID
     */
    async getOrder(orderId: string): Promise<OrderResponse> {
        return apiClient.get<OrderResponse>(ENDPOINTS.ORDER(orderId));
    }

    /**
     * Cancel an order if it's in a cancellable state
     */
    async cancelOrder(orderId: string, request: CancelOrderRequest): Promise<OrderResponse> {
        return apiClient.post<OrderResponse>(ENDPOINTS.ORDER_CANCEL(orderId), request);
    }

    /**
     * Get orders by state - convenience methods
     */
    async getActiveOrders(): Promise<OrderResponse[]> {
        // Active orders are those not in terminal states
        const allOrders = await this.listOrders();
        const terminalStates: OrderState[] = ['DELIVERED', 'CLOSED', 'CANCELLED', 'REJECTED'];
        return allOrders.filter(order => !terminalStates.includes(order.state));
    }

    async getPastOrders(): Promise<OrderResponse[]> {
        // Past orders are in terminal states
        const allOrders = await this.listOrders();
        const terminalStates: OrderState[] = ['DELIVERED', 'CLOSED', 'CANCELLED', 'REJECTED'];
        return allOrders.filter(order => terminalStates.includes(order.state));
    }
}

export const orderService = new OrderService();
export default orderService;
