// Helper script to patch CartScreen.jsx with real checkout API call
const fs = require('fs');
const path = require('path');

const cartScreenPath = path.join(__dirname, 'src', 'screens', 'CartScreen.jsx');

let content = fs.readFileSync(cartScreenPath, 'utf8');
console.log('File size:', content.length);

// Find the handleCheckout function using regex
const handleCheckoutRegex = /const handleCheckout = \(\) => \{[\s\S]*?navigation\.navigate\('Payment', \{[\s\S]*?globalCoupon: cart\.globalCoupon[\s\S]*?\}\);[\s\r\n]*\};/;

const match = content.match(handleCheckoutRegex);
if (match) {
    console.log('Found handleCheckout function, length:', match[0].length);

    const newFunction = `const handleCheckout = async () => {
    console.log('[CartScreen] handleCheckout triggered');
    if (cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout');
      return;
    }

    if (selectedRestaurants.size === 0) {
      Alert.alert('No Restaurants Selected', 'Please select at least one restaurant to checkout');
      return;
    }

    const selectedItems = cart.items.filter(group => selectedRestaurants.has(group.restaurantId));
    
    if (selectedItems.length > 1) {
      Alert.alert('Multiple Restaurants', 'Please select one restaurant at a time.');
      return;
    }

    const restaurantGroup = selectedItems[0];
    setLoading(true);

    try {
      const checkoutRequest = {
        userId: 'customer-' + Date.now(),
        vendorBranchId: parseInt(restaurantGroup.restaurantId) || 1,
        deliveryAddress: cart.deliveryAddress || {
          addressLine1: '123 Main Street',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
        },
        deliveryLocation: { latitude: 12.9716, longitude: 77.5946 },
        items: restaurantGroup.items.map(item => ({
          menuItemId: parseInt(item.id) || 1,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || '',
        })),
        paymentMethod: 'CASH_ON_DELIVERY',
        couponCode: cart.globalCoupon?.code || couponCode || undefined,
      };

      console.log('[CartScreen] Checkout request:', JSON.stringify(checkoutRequest, null, 2));
      const response = await checkoutService.calculateCheckout(checkoutRequest);
      console.log('[CartScreen] Checkout response:', JSON.stringify(response, null, 2));
      
      setCheckoutData(response);
      navigation.navigate('Payment', {
        cart: selectedItems,
        checkoutResponse: response,
        deliveryAddress: cart.deliveryAddress,
        globalCoupon: cart.globalCoupon,
      });
    } catch (error) {
      console.error('[CartScreen] Checkout error:', error);
      Alert.alert('Checkout Error', error.message || 'Failed to calculate checkout.');
    } finally {
      setLoading(false);
    }
  };`;

    content = content.replace(handleCheckoutRegex, newFunction);
    fs.writeFileSync(cartScreenPath, content, 'utf8');
    console.log('Successfully patched handleCheckout function');
} else {
    console.log('Could not find handleCheckout function with regex');
    console.log('Looking for simpler patterns...');

    // Check if the function exists at all
    if (content.includes('const handleCheckout')) {
        console.log('Function signature found');

        // Try a line-by-line approach
        const lines = content.split(/\r?\n/);
        let startLine = -1;
        let endLine = -1;
        let braceCount = 0;
        let insideFunction = false;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('const handleCheckout = () =>')) {
                startLine = i;
                insideFunction = true;
                braceCount = 0;
            }
            if (insideFunction) {
                braceCount += (lines[i].match(/\{/g) || []).length;
                braceCount -= (lines[i].match(/\}/g) || []).length;
                if (braceCount === 0 && lines[i].includes('};')) {
                    endLine = i;
                    break;
                }
            }
        }

        console.log('Function found at lines:', startLine, '-', endLine);

        if (startLine >= 0 && endLine >= 0) {
            const newFunctionLines = `  const handleCheckout = async () => {
    console.log('[CartScreen] handleCheckout triggered');
    if (cart.items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout');
      return;
    }

    if (selectedRestaurants.size === 0) {
      Alert.alert('No Restaurants Selected', 'Please select at least one restaurant to checkout');
      return;
    }

    const selectedItems = cart.items.filter(group => selectedRestaurants.has(group.restaurantId));
    
    if (selectedItems.length > 1) {
      Alert.alert('Multiple Restaurants', 'Please select one restaurant at a time.');
      return;
    }

    const restaurantGroup = selectedItems[0];
    setLoading(true);

    try {
      const checkoutRequest = {
        userId: 'customer-' + Date.now(),
        vendorBranchId: parseInt(restaurantGroup.restaurantId) || 1,
        deliveryAddress: cart.deliveryAddress || {
          addressLine1: '123 Main Street',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
        },
        deliveryLocation: { latitude: 12.9716, longitude: 77.5946 },
        items: restaurantGroup.items.map(item => ({
          menuItemId: parseInt(item.id) || 1,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || '',
        })),
        paymentMethod: 'CASH_ON_DELIVERY',
        couponCode: cart.globalCoupon?.code || couponCode || undefined,
      };

      console.log('[CartScreen] Checkout request:', JSON.stringify(checkoutRequest, null, 2));
      const response = await checkoutService.calculateCheckout(checkoutRequest);
      console.log('[CartScreen] Checkout response:', JSON.stringify(response, null, 2));
      
      setCheckoutData(response);
      navigation.navigate('Payment', {
        cart: selectedItems,
        checkoutResponse: response,
        deliveryAddress: cart.deliveryAddress,
        globalCoupon: cart.globalCoupon,
      });
    } catch (error) {
      console.error('[CartScreen] Checkout error:', error);
      Alert.alert('Checkout Error', error.message || 'Failed to calculate checkout.');
    } finally {
      setLoading(false);
    }
  };`.split('\n');

            // Replace lines
            lines.splice(startLine, endLine - startLine + 1, ...newFunctionLines);
            fs.writeFileSync(cartScreenPath, lines.join('\n'), 'utf8');
            console.log('Successfully patched using line replacement');
        }
    } else {
        console.log('Function signature not found at all');
    }
}
