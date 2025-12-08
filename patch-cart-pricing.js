// Patch script to add auto-fetch pricing in CartScreen
const fs = require('fs');
const path = require('path');

const screenPath = path.join(__dirname, 'src', 'screens', 'CartScreen.jsx');
let content = fs.readFileSync(screenPath, 'utf8');

console.log('Original file size:', content.length);

// 1. Add fetchCheckoutPrices function after loadCart
const fetchCheckoutPricesFunc = `

  // Fetch real-time pricing from backend when cart opens
  const fetchCheckoutPrices = async (cartItems = cart.items) => {
    if (!cartItems || cartItems.length === 0) {
      setCheckoutData(null);
      return;
    }

    try {
      const restaurantGroup = cartItems[0];
      const checkoutRequest = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        vendorBranchId: restaurantGroup.items[0]?.branchId || parseInt(restaurantGroup.restaurantId) || 5,
        deliveryAddress: {
          addressLine1: '123 Main Street',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
        },
        deliveryLocation: { latitude: 12.9716, longitude: 77.5946 },
        items: restaurantGroup.items.map(item => ({
          menuItemId: parseInt(item.menuItemId) || parseInt(item.id) || 1,
          quantity: item.quantity,
        })),
        paymentMethod: 'GPAY',
      };

      console.log('[CartScreen] Auto-fetching checkout prices...');
      const response = await checkoutService.calculateCheckout(checkoutRequest);
      console.log('[CartScreen] Prices fetched:', JSON.stringify(response.pricing, null, 2));
      setCheckoutData(response);
    } catch (error) {
      console.error('[CartScreen] Failed to fetch prices:', error);
      setCheckoutData(null);
    }
  };`;

// Find position after loadCart function ends (after setRefreshing(false); }; )
const loadCartEndPattern = /setRefreshing\(false\);\s*\}\s*\};/;
const match = content.match(loadCartEndPattern);
if (match) {
    const insertPos = content.indexOf(match[0]) + match[0].length;

    // Check if fetchCheckoutPrices already exists
    if (!content.includes('fetchCheckoutPrices')) {
        content = content.slice(0, insertPos) + fetchCheckoutPricesFunc + content.slice(insertPos);
        console.log('✅ Added fetchCheckoutPrices function');
    } else {
        console.log('⚠️ fetchCheckoutPrices already exists');
    }
}

// 2. Modify loadCart to call fetchCheckoutPrices after setting cart
// Find: setSelectedRestaurants(allRestaurants);
// Add after: if (response.cart.items.length > 0) { fetchCheckoutPrices(response.cart.items); }
const setSelectedPattern = /setSelectedRestaurants\(allRestaurants\);/;
if (content.match(setSelectedPattern) && !content.includes('fetchCheckoutPrices(response.cart.items)')) {
    content = content.replace(
        setSelectedPattern,
        `setSelectedRestaurants(allRestaurants);
        
        // Auto-fetch prices from backend
        if (response.cart.items.length > 0) {
          setTimeout(() => fetchCheckoutPrices(response.cart.items), 100);
        }`
    );
    console.log('✅ Modified loadCart to auto-fetch prices');
}

// 3. Update getSelectedRestaurantsTotal to use checkoutData
const oldGetSelectedTotal = /const getSelectedRestaurantsTotal = \(\) => \{[\s\S]*?return total[\s\S]*?0\);[\s\r\n]*\};/;
const newGetSelectedTotal = `const getSelectedRestaurantsTotal = () => {
    // Use backend pricing if available
    if (checkoutData?.pricing?.totalAmount) {
      return checkoutData.pricing.totalAmount;
    }
    // Fallback to client-side calculation
    const selectedItems = cart.items.filter(group => selectedRestaurants.has(group.restaurantId));
    return selectedItems.reduce((total, group) => {
      const subtotal = group.items.reduce((sum, item) => sum + ((item.price || item.unitPrice || 0) * item.quantity), 0);
      return total + subtotal + (group.deliveryFee || 0) + (subtotal * 0.05);
    }, 0);
  };`;

if (content.match(oldGetSelectedTotal)) {
    content = content.replace(oldGetSelectedTotal, newGetSelectedTotal);
    console.log('✅ Updated getSelectedRestaurantsTotal to use backend pricing');
}

// 4. Update updateQuantity and removeItem to refetch prices
// After setCart in updateQuantity, add: setCheckoutData(null); fetchCheckoutPrices(response.cart.items);
const updateQuantitySetCart = /if \(response\.success && response\.cart\) \{\s*\/\/ Update cart state with the new cart data\s*setCart\(response\.cart\);/g;
let updated = false;
content = content.replace(updateQuantitySetCart, (match) => {
    if (!updated) {
        updated = true;
        return match + `
        
        // Invalidate and refetch prices
        setCheckoutData(null);
        setTimeout(() => fetchCheckoutPrices(response.cart.items), 100);`;
    }
    return match;
});
if (updated) {
    console.log('✅ Added price refetch after quantity update');
}

fs.writeFileSync(screenPath, content, 'utf8');
console.log('✅ CartScreen patched for auto-pricing!');
console.log('New file size:', content.length);
