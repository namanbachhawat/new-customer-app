import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AppTheme from '../theme';

const TrackingScreen = () => {
  const [orderStatus, setOrderStatus] = useState('preparing');

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#22c55e';
      case 'preparing':
        return '#f59e0b';
      case 'ready':
        return '#3b82f6';
      case 'picked_up':
        return '#8b5cf6';
      case 'delivered':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return '✓';
      case 'preparing':
        return '👨‍🍳';
      case 'ready':
        return '🍽️';
      case 'picked_up':
        return '🚗';
      case 'delivered':
        return '🏠';
      default:
        return '○';
    }
  };

  const trackingSteps = [
    { id: 'confirmed', label: 'Order Confirmed', time: '2:30 PM' },
    { id: 'preparing', label: 'Preparing Food', time: '2:45 PM' },
    { id: 'ready', label: 'Ready for Pickup', time: '3:15 PM' },
    { id: 'picked_up', label: 'Out for Delivery', time: '3:30 PM' },
    { id: 'delivered', label: 'Delivered', time: '4:00 PM' }
  ];

  const currentStepIndex = trackingSteps.findIndex(step => step.id === orderStatus);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <Text style={styles.headerSubtitle}>Order #12345</Text>
      </View>

      {/* Restaurant Info */}
      <View style={styles.restaurantCard}>
        <View style={styles.restaurantInfo}>
          <View>
            <Text style={styles.restaurantName}>Green Garden Restaurant</Text>
            <Text style={styles.restaurantAddress}>123 Food Street, City Center</Text>
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Rajesh Kumar</Text>
            <Text style={styles.driverTitle}>Delivery Partner</Text>
          </View>
        </View>
      </View>

      {/* Delivery Address */}
      <View style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <Text style={styles.addressTitle}>Delivery Address</Text>
          <View style={styles.etaBadge}>
            <Text style={styles.etaText}>25 min</Text>
          </View>
        </View>
        <Text style={styles.addressText}>Apartment 4B, Sunrise Apartments, MG Road</Text>
      </View>

      {/* Tracking Steps */}
      <View style={styles.trackingCard}>
        <Text style={styles.trackingTitle}>Delivery Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stepsContainer}>
          {trackingSteps.map((step, index) => (
            <View key={step.id} style={styles.stepContainer}>
              <View style={[
                styles.stepIcon,
                { backgroundColor: getStatusColor(step.id) }
              ]}>
                <Text style={styles.stepIconText}>
                  {index <= currentStepIndex ? getStatusIcon(step.id) : '○'}
                </Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepLabel}>{step.label}</Text>
                <Text style={styles.stepTime}>{step.time}</Text>
              </View>
              {index < trackingSteps.length - 1 && (
                <View style={[
                  styles.stepConnector,
                  { backgroundColor: index <= currentStepIndex ? getStatusColor(step.id) : '#e5e7eb' }
                ]} />
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Current Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>Current Status</Text>
          <Text style={[styles.statusText, { color: getStatusColor(orderStatus) }]}>
            {trackingSteps[currentStepIndex]?.label}
          </Text>
        </View>
        <Text style={styles.statusDescription}>
          Your order is being prepared by the restaurant chef. Estimated delivery time is 25 minutes.
        </Text>
      </View>

      {/* Call Driver Button */}
      <TouchableOpacity style={styles.callButton}>
        <Text style={styles.callButtonText}>Call Driver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: AppTheme.Colors.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppTheme.Colors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: AppTheme.Colors.white + '80',
  },
  restaurantCard: {
    margin: 16,
    padding: 16,
    backgroundColor: AppTheme.Colors.white,
    borderRadius: 12,
    shadowColor: AppTheme.Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  restaurantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppTheme.Colors.text,
    marginBottom: 5,
  },
  restaurantAddress: {
    fontSize: 14,
    color: AppTheme.Colors.textLight,
  },
  driverInfo: {
    alignItems: 'flex-end',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.Colors.text,
    marginBottom: 2,
  },
  driverTitle: {
    fontSize: 12,
    color: AppTheme.Colors.textLight,
  },
  addressCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: AppTheme.Colors.white,
    borderRadius: 12,
    shadowColor: AppTheme.Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.Colors.text,
  },
  etaBadge: {
    backgroundColor: AppTheme.Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppTheme.Colors.white,
  },
  addressText: {
    fontSize: 14,
    color: AppTheme.Colors.textLight,
  },
  trackingCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: AppTheme.Colors.white,
    borderRadius: 12,
    shadowColor: AppTheme.Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trackingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.Colors.text,
    marginBottom: 16,
  },
  stepsContainer: {
    marginLeft: -16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepIconText: {
    fontSize: 18,
  },
  stepContent: {
    alignItems: 'center',
    marginLeft: 12,
    marginRight: 20,
    minWidth: 60,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: AppTheme.Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  stepTime: {
    fontSize: 10,
    color: AppTheme.Colors.textLight,
  },
  stepConnector: {
    width: 40,
    height: 2,
    marginLeft: 8,
  },
  statusCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: AppTheme.Colors.white,
    borderRadius: 12,
    shadowColor: AppTheme.Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.Colors.text,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusDescription: {
    fontSize: 14,
    color: AppTheme.Colors.textLight,
    lineHeight: 20,
  },
  callButton: {
    margin: 16,
    marginTop: 0,
    backgroundColor: AppTheme.Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.Colors.white,
  },
});

export default TrackingScreen;