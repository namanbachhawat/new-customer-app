// Firebase Authentication Service for Phone OTP
// Using compat API for better Expo compatibility
import { auth } from './firebaseConfig';

// Store verification ID for OTP confirmation
let confirmationResult = null;

/**
 * Send OTP to phone number
 * @param {string} phoneNumber - Phone number with country code (e.g., +919876543210)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendOTP(phoneNumber) {
    try {
        console.log('[AuthService] Sending OTP to:', phoneNumber);

        // Format phone number if needed
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

        // For Expo Go, we use a simplified development flow
        // Real Firebase phone auth requires a native build with reCAPTCHA
        console.log('[AuthService] Development mode - simulating OTP send');

        // Store a mock confirmation for development
        confirmationResult = {
            verificationId: 'dev-verification-' + Date.now(),
            phoneNumber: formattedPhone,
            confirm: async (code) => {
                // In development, accept any 6-digit code
                if (code.length === 6 && /^\d+$/.test(code)) {
                    return {
                        user: {
                            uid: 'dev-user-' + Date.now(),
                            phoneNumber: formattedPhone,
                        }
                    };
                }
                throw new Error('Invalid OTP code');
            }
        };

        console.log('[AuthService] OTP sent successfully (dev mode)');
        return { success: true, isDevelopment: true };

    } catch (error) {
        console.error('[AuthService] Error sending OTP:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Verify OTP code
 * @param {string} otpCode - 6-digit OTP code
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function verifyOTP(otpCode) {
    try {
        console.log('[AuthService] Verifying OTP...');

        if (!confirmationResult) {
            return { success: false, error: 'No verification in progress. Please request OTP first.' };
        }

        const result = await confirmationResult.confirm(otpCode);
        console.log('[AuthService] OTP verified successfully, user:', result.user?.uid);

        // Store user info for the session
        return { success: true, user: result.user };

    } catch (error) {
        console.error('[AuthService] Error verifying OTP:', error);

        if (error.message === 'Invalid OTP code') {
            return { success: false, error: 'Invalid OTP. Please enter a valid 6-digit code.' };
        }

        return { success: false, error: error.message };
    }
}

/**
 * Sign out user
 */
export async function signOut() {
    try {
        await auth.signOut();
        confirmationResult = null;
        console.log('[AuthService] User signed out');
        return { success: true };
    } catch (error) {
        console.error('[AuthService] Error signing out:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get current user
 */
export function getCurrentUser() {
    return auth.currentUser;
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback) {
    return auth.onAuthStateChanged(callback);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
    return !!auth.currentUser;
}

export default {
    sendOTP,
    verifyOTP,
    signOut,
    getCurrentUser,
    onAuthChange,
    isAuthenticated,
};
