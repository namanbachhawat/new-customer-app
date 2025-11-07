import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import api from '../services/api';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await api.getUserProfile();
      if (response.success) {
        setUser(response.user);
        setNotifications(response.user.preferences.notifications);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const updateNotificationPreference = async (value) => {
    setNotifications(value);
    try {
      const response = await api.updateUserProfile({
        preferences: { ...user.preferences, notifications: value }
      });
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      setNotifications(!value); // Revert on error
      Alert.alert('Error', 'Failed to update notification preferences');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.navigate('Auth')
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'orders',
      title: 'My Orders',
      icon: '📦',
      onPress: () => navigation.navigate('Orders'),
    },
    {
      id: 'addresses',
      title: 'Saved Addresses',
      icon: '📍',
      onPress: () => navigation.navigate('Addresses'),
    },
    {
      id: 'wallet',
      title: 'Wallet & Payments',
      icon: '💰',
      onPress: () => Alert.alert('Coming Soon', 'Wallet feature is coming soon!'),
    },
    {
      id: 'favorites',
      title: 'Favorite Restaurants',
      icon: '❤️',
      onPress: () => Alert.alert('Coming Soon', 'Favorites feature is coming soon!'),
    },
    {
      id: 'reviews',
      title: 'My Reviews',
      icon: '⭐',
      onPress: () => navigation.navigate('Reviews'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      icon: '🆘',
      onPress: () => navigation.navigate('Support'),
    },
    {
      id: 'about',
      title: 'About Nashtto',
      icon: 'ℹ️',
      onPress: () => Alert.alert('About', 'Nashtto - Pure vegetarian food delivery'),
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemContent}>
        <Text style={styles.menuIcon}>{item.icon}</Text>
        <Text style={styles.menuTitle}>{item.title}</Text>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'Loading...'}</Text>
              <Text style={styles.userPhone}>{user?.phone || ''}</Text>
              <Text style={styles.userEmail}>{user?.email || ''}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹2,450</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingTitle}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={updateNotificationPreference}
              trackColor={{ false: '#cbd5e1', true: '#dcfce7' }}
              thumbColor={notifications ? '#22c55e' : '#f1f5f9'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>🌍</Text>
              <Text style={styles.settingTitle}>Language</Text>
            </View>
            <Text style={styles.settingValue}>English</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingIcon}>💱</Text>
              <Text style={styles.settingTitle}>Currency</Text>
            </View>
            <Text style={styles.settingValue}>INR</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#64748b',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileSection: {
    marginTop: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
  },
  statsSection: {
    marginTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  settingsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1e293b',
  },
  settingValue: {
    fontSize: 14,
    color: '#64748b',
  },
  menuSection: {
    marginTop: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: '#1e293b',
  },
  menuArrow: {
    fontSize: 18,
    color: '#64748b',
  },
  logoutSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  logoutButton: {
    borderColor: '#ef4444',
  },
  bottomPadding: {
    height: 20,
  },
});

export default ProfileScreen;