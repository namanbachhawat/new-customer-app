// Helper script to patch PaymentScreen.js with real orderService API
const fs = require('fs');
const path = require('path');

const screenPath = path.join(__dirname, 'src', 'screens', 'PaymentScreen.js');

let content = fs.readFileSync(screenPath, 'utf8');
console.log('File size:', content.length);

// Find the handlePayment function using regex
const handlePaymentRegex = /const handlePayment = async \(\) => \{[\s\S]*?finally \{[\s\S]*?setLoading\(false\);[\s\S]*?\}[\s\r\n]*\};/;

const newHandlePayment = `const handlePayment = async () => {
    // Check if we have a valid checkout session
    if (!checkoutResponse?.checkoutSessionId) {
      Alert.alert('Error', 'No valid checkout session. Please go back and try again.');
      return;
    }

    setLoading(true);

    try {
      console.log('[PaymentScreen] Creating order with checkoutSessionId:', checkoutResponse.checkoutSessionId);
      
      // Call the real API to create order from checkout session
      const orderRequest = {
        checkoutSessionId: checkoutResponse.checkoutSessionId,
        paymentToken: 'tok_gpay_1234', // Google Pay token
      };
      
      console.log('[PaymentScreen] Order request:', JSON.stringify(orderRequest, null, 2));
      const orderResponse = await orderService.createOrder(orderRequest);
      console.log('[PaymentScreen] Order response:', JSON.stringify(orderResponse, null, 2));

      if (orderResponse?.orderId) {
        Alert.alert(
          'Payment Successful!',
          \`Your order has been placed successfully.\\nOrder ID: \${orderResponse.orderId}\\nOrder Number: \${orderResponse.orderNumber || 'N/A'}\`,
          [
            {
              text: 'View Orders',
              onPress: () => navigation.navigate('Orders'),
            },
            {
              text: 'Back to Home',
              onPress: () => navigation.navigate('Home'),
              style: 'cancel',
            },
          ]
        );
      } else {
        Alert.alert('Order Created', orderResponse?.message || 'Your order is being processed.');
        navigation.navigate('Orders');
      }
    } catch (error) {
      console.error('[PaymentScreen] Order creation failed:', error);
      Alert.alert('Error', error?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };`;

const match = content.match(handlePaymentRegex);
if (match) {
    console.log('Found handlePayment function, length:', match[0].length);
    content = content.replace(handlePaymentRegex, newHandlePayment);
    fs.writeFileSync(screenPath, content, 'utf8');
    console.log('✅ Successfully patched handlePayment function');
} else {
    console.log('❌ Could not find handlePayment function with regex');

    // Try line-by-line approach
    const lines = content.split(/\r?\n/);
    let startLine = -1;
    let endLine = -1;
    let braceCount = 0;
    let insideFunction = false;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('const handlePayment = async')) {
            startLine = i;
            insideFunction = true;
            braceCount = 0;
        }
        if (insideFunction) {
            braceCount += (lines[i].match(/\{/g) || []).length;
            braceCount -= (lines[i].match(/\}/g) || []).length;
            if (braceCount === 0 && lines[i].trim().endsWith('};')) {
                endLine = i;
                break;
            }
        }
    }

    console.log('Function found at lines:', startLine + 1, '-', endLine + 1);

    if (startLine >= 0 && endLine >= 0) {
        const newFunctionLines = newHandlePayment.split('\n');
        lines.splice(startLine, endLine - startLine + 1, ...newFunctionLines);
        fs.writeFileSync(screenPath, lines.join('\n'), 'utf8');
        console.log('✅ Successfully patched using line replacement');
    }
}
