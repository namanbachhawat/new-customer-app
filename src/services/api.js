// Mock API service for Nashtto customer app
// All API calls are simulated with setTimeout for realistic behavior

class ApiService {
  constructor() {
    this.baseDelay = 1000; // Base delay for API calls
    this.mockData = {
      // User data
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 9876543210',
        addresses: [
          { id: 1, name: 'Home', address: '123 Main Street, Mumbai', isDefault: true },
          { id: 2, name: 'Work', address: '456 Business Plaza, BKC, Mumbai', isDefault: false },
          { id: 3, name: "Friend's Place", address: '789 Park Avenue, Andheri, Mumbai', isDefault: false },
        ],
        preferences: {
          notifications: true,
          language: 'en',
          currency: 'INR'
        }
      },

      // Categories
      categories: [
        { id: 1, name: 'Tea', image: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47', items: 45 },
        { id: 2, name: 'Coffee', image: 'https://images.unsplash.com/photo-1644433233384-a28e2a225bfc', items: 32 },
        { id: 3, name: 'Snacks', image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe', items: 67 },
        { id: 4, name: 'Combos', image: 'https://images.unsplash.com/photo-1586981114766-708f09a71e20', items: 15 },
        { id: 5, name: 'Desserts', image: 'https://images.unsplash.com/photo-1617013451942-441bbba35a5e', items: 28 },
      ],

      // Vendors
      vendors: [
        {
          id: 1,
          name: 'Green Tea House',
          rating: 4.5,
          time: '15-20 min',
          image: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47',
          offers: 'Free delivery',
          price: '₹100 for two',
          distance: '0.8 km',
          promoted: true,
          description: 'Pure vegetarian tea house with authentic flavors',
          menu: [
            { id: 1, name: 'Masala Chai', price: 25, image: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47', category: 'Tea' },
            { id: 2, name: 'Filter Coffee', price: 30, image: 'https://images.unsplash.com/photo-1644433233384-a28e2a225bfc', category: 'Coffee' },
            { id: 3, name: 'Samosa', price: 20, image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe', category: 'Snacks' },
          ]
        },
        {
          id: 2,
          name: 'Herbal Garden Cafe',
          rating: 4.8,
          time: '20-25 min',
          image: 'https://images.unsplash.com/photo-1644433233384-a28e2a225bfc',
          offers: '20% off',
          price: '₹150 for two',
          distance: '1.2 km',
          promoted: false,
          description: 'Organic and healthy vegetarian options',
          menu: [
            { id: 4, name: 'Green Tea', price: 35, image: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47', category: 'Tea' },
            { id: 5, name: 'Cold Coffee', price: 45, image: 'https://images.unsplash.com/photo-1644433233384-a28e2a225bfc', category: 'Coffee' },
            { id: 6, name: 'Dhokla', price: 40, image: 'https://images.unsplash.com/photo-1680359939304-7e27ee183e7a', category: 'Snacks' },
          ]
        },
        {
          id: 3,
          name: 'Pure Veg Corner',
          rating: 4.3,
          time: '10-15 min',
          image: 'https://images.unsplash.com/photo-1680359939304-7e27ee183e7a',
          offers: 'Buy 1 Get 1',
          price: '₹80 for two',
          distance: '0.5 km',
          promoted: false,
          description: 'Traditional Gujarati vegetarian cuisine',
          menu: [
            { id: 7, name: 'Dhokla', price: 40, image: 'https://images.unsplash.com/photo-1680359939304-7e27ee183e7a', category: 'Snacks' },
            { id: 8, name: 'Khakra', price: 25, image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe', category: 'Snacks' },
            { id: 9, name: 'Gulab Jamun', price: 50, image: 'https://images.unsplash.com/photo-1617013451942-441bbba35a5e', category: 'Desserts' },
          ]
        },
      ],

      // Cart
      cart: [
        { id: 1, name: 'Masala Chai', price: 25, quantity: 2, vendorId: 1 },
        { id: 2, name: 'Samosa', price: 20, quantity: 1, vendorId: 1 },
      ],

      // Orders
      orders: [
        {
          id: 1,
          vendorName: 'Green Tea House',
          status: 'Delivered',
          total: 70,
          date: '2024-11-07',
          items: [
            { name: 'Masala Chai', quantity: 2, price: 25 },
            { name: 'Samosa', quantity: 1, price: 20 },
          ]
        }
      ]
    };
  }

  // Utility method to simulate API delay
  delay(delay = this.baseDelay) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Authentication
  async login(phoneNumber) {
    await this.delay();
    const otp = Math.floor(100000 + Math.random() * 900000);
    return { success: true, otp, message: 'OTP sent successfully' };
  }

  async verifyOtp(phoneNumber, otp) {
    await this.delay();
    if (otp === '123456') { // Mock OTP
      return { success: true, user: this.mockData.user, token: 'mock-jwt-token' };
    }
    return { success: false, error: 'Invalid OTP' };
  }

  async register(userData) {
    await this.delay();
    const newUser = {
      ...this.mockData.user,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
    };
    return { success: true, user: newUser, token: 'mock-jwt-token' };
  }

  async socialLogin(provider) {
    await this.delay();
    return { success: true, user: this.mockData.user, token: 'mock-jwt-token' };
  }

  // User Profile
  async getUserProfile() {
    await this.delay();
    return { success: true, user: this.mockData.user };
  }

  async updateUserProfile(userData) {
    await this.delay();
    this.mockData.user = { ...this.mockData.user, ...userData };
    return { success: true, user: this.mockData.user };
  }

  // Categories
  async getCategories() {
    await this.delay(500);
    return { success: true, categories: this.mockData.categories };
  }

  // Vendors
  async getVendors(params = {}) {
    await this.delay(800);
    let vendors = [...this.mockData.vendors];

    if (params.category) {
      vendors = vendors.filter(vendor =>
        vendor.menu.some(item => item.category.toLowerCase() === params.category.toLowerCase())
      );
    }

    if (params.searchQuery) {
      vendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(params.searchQuery.toLowerCase()) ||
        vendor.menu.some(item => item.name.toLowerCase().includes(params.searchQuery.toLowerCase()))
      );
    }

    return { success: true, vendors };
  }

  async getVendorDetails(vendorId) {
    await this.delay(600);
    const vendor = this.mockData.vendors.find(v => v.id === vendorId);
    if (vendor) {
      return { success: true, vendor };
    }
    return { success: false, error: 'Vendor not found' };
  }

  // Menu
  async getVendorMenu(vendorId) {
    await this.delay(500);
    const vendor = this.mockData.vendors.find(v => v.id === vendorId);
    if (vendor) {
      return { success: true, menu: vendor.menu };
    }
    return { success: false, error: 'Vendor not found' };
  }

  // Cart
  async getCart() {
    await this.delay(400);
    return { success: true, cart: this.mockData.cart };
  }

  async addToCart(item) {
    await this.delay(300);
    const existingItem = this.mockData.cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
    } else {
      this.mockData.cart.push({ ...item, quantity: item.quantity || 1 });
    }
    return { success: true, cart: this.mockData.cart };
  }

  async updateCartItem(itemId, quantity) {
    await this.delay(300);
    const item = this.mockData.cart.find(cartItem => cartItem.id === itemId);
    if (item) {
      if (quantity > 0) {
        item.quantity = quantity;
      } else {
        this.mockData.cart = this.mockData.cart.filter(cartItem => cartItem.id !== itemId);
      }
      return { success: true, cart: this.mockData.cart };
    }
    return { success: false, error: 'Item not found in cart' };
  }

  async removeFromCart(itemId) {
    await this.delay(300);
    this.mockData.cart = this.mockData.cart.filter(item => item.id !== itemId);
    return { success: true, cart: this.mockData.cart };
  }

  async clearCart() {
    await this.delay(300);
    this.mockData.cart = [];
    return { success: true };
  }

  // Orders
  async getOrders() {
    await this.delay(600);
    return { success: true, orders: this.mockData.orders };
  }

  async placeOrder(orderData) {
    await this.delay(1500);
    const newOrder = {
      id: Date.now(),
      vendorName: orderData.vendorName,
      status: 'Confirmed',
      total: orderData.total,
      date: new Date().toISOString().split('T')[0],
      items: orderData.items,
      orderId: `ORDER${Date.now()}`,
    };
    this.mockData.orders.unshift(newOrder);
    // Clear cart after successful order
    this.mockData.cart = [];
    return { success: true, order: newOrder };
  }

  async getOrderDetails(orderId) {
    await this.delay(500);
    const order = this.mockData.orders.find(o => o.id === orderId);
    if (order) {
      return { success: true, order };
    }
    return { success: false, error: 'Order not found' };
  }

  // Payments
  async processPayment(paymentData) {
    await this.delay(2000);
    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate
    if (success) {
      return {
        success: true,
        transactionId: `TXN${Date.now()}`,
        message: 'Payment processed successfully'
      };
    } else {
      return {
        success: false,
        error: 'Payment failed. Please try again.'
      };
    }
  }

  // Addresses
  async getAddresses() {
    await this.delay(400);
    return { success: true, addresses: this.mockData.user.addresses };
  }

  async addAddress(address) {
    await this.delay(500);
    const newAddress = {
      id: Date.now(),
      ...address,
      isDefault: this.mockData.user.addresses.length === 0,
    };
    this.mockData.user.addresses.push(newAddress);
    return { success: true, addresses: this.mockData.user.addresses };
  }

  async updateAddress(addressId, addressData) {
    await this.delay(500);
    const index = this.mockData.user.addresses.findIndex(addr => addr.id === addressId);
    if (index !== -1) {
      this.mockData.user.addresses[index] = { ...this.mockData.user.addresses[index], ...addressData };
      return { success: true, addresses: this.mockData.user.addresses };
    }
    return { success: false, error: 'Address not found' };
  }

  async deleteAddress(addressId) {
    await this.delay(400);
    this.mockData.user.addresses = this.mockData.user.addresses.filter(addr => addr.id !== addressId);
    return { success: true, addresses: this.mockData.user.addresses };
  }

  // Notifications
  async getNotifications() {
    await this.delay(400);
    return {
      success: true,
      notifications: [
        { id: 1, title: 'Order Delivered!', message: 'Your order from Green Tea House has been delivered.', time: '2 min ago', read: false },
        { id: 2, title: 'New Offer', message: 'Get 30% off on your next order.', time: '1 hour ago', read: false },
        { id: 3, title: 'Welcome to Nashtto', message: 'Thank you for joining us! Enjoy your first order.', time: '1 day ago', read: true },
      ]
    };
  }

  async markNotificationAsRead(notificationId) {
    await this.delay(300);
    return { success: true };
  }

  // Support
  async submitSupportTicket(ticketData) {
    await this.delay(800);
    return {
      success: true,
      ticketId: `TICKET${Date.now()}`,
      message: 'Your support ticket has been submitted. We will respond within 24 hours.'
    };
  }

  // Reviews
  async submitReview(reviewData) {
    await this.delay(600);
    return {
      success: true,
      review: {
        id: Date.now(),
        ...reviewData,
        date: new Date().toISOString().split('T')[0],
      }
    };
  }

  async getVendorReviews(vendorId) {
    await this.delay(500);
    return {
      success: true,
      reviews: [
        { id: 1, userName: 'Rahul S.', rating: 5, comment: 'Amazing food and service!', date: '2024-11-05' },
        { id: 2, userName: 'Priya M.', rating: 4, comment: 'Good quality vegetarian food.', date: '2024-11-03' },
        { id: 3, userName: 'Amit K.', rating: 5, comment: 'Best tea in town!', date: '2024-11-01' },
      ]
    };
  }

  // Search
  async search(params) {
    await this.delay(700);
    const { query, category, location } = params;
    let results = [];

    // Search in vendors
    const vendorResults = this.mockData.vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(query?.toLowerCase() || '') ||
      vendor.menu.some(item => item.name.toLowerCase().includes(query?.toLowerCase() || ''))
    );

    // Search in menu items
    const menuResults = [];
    this.mockData.vendors.forEach(vendor => {
      vendor.menu.forEach(item => {
        if (item.name.toLowerCase().includes(query?.toLowerCase() || '')) {
          menuResults.push({ ...item, vendorName: vendor.name, vendorId: vendor.id });
        }
      });
    });

    return {
      success: true,
      results: {
        vendors: vendorResults,
        items: menuResults,
        total: vendorResults.length + menuResults.length
      }
    };
  }
}

// Export a singleton instance
export default new ApiService();