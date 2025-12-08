// Patch script to fix PaymentScreen display issues
const fs = require('fs');
const path = require('path');

const screenPath = path.join(__dirname, 'src', 'screens', 'PaymentScreen.js');
let content = fs.readFileSync(screenPath, 'utf8');

console.log('Original file size:', content.length);

// Fix 1: Replace getTotalPrice function to use checkoutResponse first
const oldGetTotalPrice = /const getTotalPrice = \(\) => \{[\s\S]*?if \(cartItems\.length > 0 && cartItems\[0\]\.restaurantId\) \{[\s\S]*?\} else \{[\s\S]*?\}[\s\r\n]*\};/;
const newGetTotalPrice = `const getTotalPrice = () => {
    // Use backend itemTotal if available
    if (checkoutResponse?.pricing?.itemTotal != null) {
      return checkoutResponse.pricing.itemTotal;
    }
    // Fallback with safe defaults
    if (cartItems.length > 0 && cartItems[0].restaurantId) {
      return cartItems.reduce((total, restaurant) => {
        return total + restaurant.items.reduce((restaurantTotal, item) => {
          return restaurantTotal + ((item.price || item.unitPrice || 0) * (item.quantity || 1));
        }, 0);
      }, 0);
    }
    return cartItems.reduce((total, item) => total + ((item.price || item.unitPrice || 0) * (item.quantity || 1)), 0);
  };`;

if (oldGetTotalPrice.test(content)) {
    content = content.replace(oldGetTotalPrice, newGetTotalPrice);
    console.log('✅ Fixed getTotalPrice function');
} else {
    console.log('⚠️ Could not find getTotalPrice function with expected pattern');
}

// Fix 2: Replace item.price * item.quantity with safe version in order display
content = content.replace(
    /₹\{item\.price \* item\.quantity\}/g,
    '₹{(item.price || item.unitPrice || item.subtotal || 0) * (item.quantity || 1)}'
);
console.log('✅ Fixed item price calculations');

// Fix 3: Add platform fee display if not exists
if (!content.includes('getPlatformFee')) {
    const insertPoint = content.indexOf('const getGrandTotal');
    if (insertPoint > -1) {
        content = content.slice(0, insertPoint) +
            `const getPlatformFee = () => checkoutResponse?.pricing?.platformFee ?? 0;\n  ` +
            content.slice(insertPoint);
        console.log('✅ Added getPlatformFee function');
    }
}

// Fix 4: Add getDiscount function if not exists
if (!content.includes('getDiscount')) {
    const insertPoint = content.indexOf('const getGrandTotal');
    if (insertPoint > -1) {
        content = content.slice(0, insertPoint) +
            `const getDiscount = () => checkoutResponse?.pricing?.discount ?? 0;\n  ` +
            content.slice(insertPoint);
        console.log('✅ Added getDiscount function');
    }
}

fs.writeFileSync(screenPath, content, 'utf8');
console.log('✅ PaymentScreen patched successfully!');
console.log('New file size:', content.length);
