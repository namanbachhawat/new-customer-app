import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Order Delivered!', message: 'Your order from Green Tea House has been delivered.', time: '2 min ago', read: false },
    { id: 2, title: 'New Offer', message: 'Get 30% off on your next order.', time: '1 hour ago', read: false },
  ]);

  const addresses = [
    { id: 0, name: 'Home', address: '123 Main Street, Mumbai', icon: '🏠' },
    { id: 1, name: 'Work', address: '456 Business Plaza, BKC, Mumbai', icon: '🏢' },
    { id: 2, name: "Friend's Place", address: '789 Park Avenue, Andheri, Mumbai', icon: '👥' },
  ];

  const categories = [
    { id: 1, name: 'Tea', image: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47', items: 45 },
    { id: 2, name: 'Coffee', image: 'https://images.unsplash.com/photo-1644433233384-a28e2a225bfc', items: 32 },
    { id: 3, name: 'Snacks', image: 'https://images.unsplash.com/photo-1616813769023-d0557572ddbe', items: 67 },
    { id: 4, name: 'Combos', image: 'https://images.unsplash.com/photo-1586981114766-708f09a71e20', items: 15 },
    { id: 5, name: 'Desserts', image: 'https://images.unsplash.com/photo-1617013451942-441bbba35a5e', items: 28 },
  ];

  const vendors = [
    { 
      id: 1, 
      name: 'Green Tea House', 
      rating: 4.5, 
      time: '15-20 min', 
      image: 'https://images.unsplash.com/photo-1648192312898-838f9b322f47', 
      offers: 'Free delivery',
      price: '₹100 for two',
      distance: '0.8 km',
      promoted: true
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
      promoted: false
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
      promoted: false
    },
  ];

  const handleSearch = () => {
    navigation.navigate('Search', { searchQuery: searchText });
  };

  const handleVendorPress = (vendor) => {
    navigation.navigate('Vendor', { vendor });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('Search', { category: category.name });
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryItems}>{item.items} items</Text>
    </TouchableOpacity>
  );

  const renderVendor = ({ item }) => (
    <Card 
      style={styles.vendorCard}
      onPress={() => handleVendorPress(item)}
    >
      <View style={styles.vendorContent}>
        <Image source={{ uri: item.image }} style={styles.vendorImage} />
        {item.promoted && (
          <View style={styles.promotedBadge}>
            <Text style={styles.promotedText}>Promoted</Text>
          </View>
        )}
        <CardContent style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{item.name}</Text>
          <View style={styles.vendorMeta}>
            <Text style={styles.vendorRating}>⭐ {item.rating}</Text>
            <Text style={styles.vendorTime}>⏰ {item.time}</Text>
            <Text style={styles.vendorDistance}>• {item.distance}</Text>
          </View>
          <View style={styles.vendorOffer}>
            <Text style={styles.offerText}>{item.offers}</Text>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>
        </CardContent>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.addressContainer}>
          <View style={styles.locationIcon}>
            <Text style={styles.locationIconText}>📍</Text>
          </View>
          <View>
            <Text style={styles.deliverToText}>Deliver to</Text>
            <View style={styles.addressRow}>
              <Text style={styles.addressName}>{addresses[selectedAddress].name}</Text>
              <Text style={styles.addressText}>• {addresses[selectedAddress].address}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>👤</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Support')}
          >
            <Text style={styles.actionIcon}>🔔</Text>
            {unreadNotificationsCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>{unreadNotificationsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.actionIcon}>💰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <TouchableOpacity style={styles.searchContainer} onPress={handleSearch}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for food, drinks, vendors..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <Text style={styles.micIcon}>🎤</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Offer */}
        <View style={styles.offerCard}>
          <View style={styles.offerContent}>
            <View style={styles.offerTextContainer}>
              <Text style={styles.offerTitle}>Welcome Offer!</Text>
              <Text style={styles.offerSubtitle}>
                Get 40% off on your first 3 orders with code NASHTO40
              </Text>
            </View>
            <Button title="Claim" size="small" style={styles.claimButton} />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by category</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Order Again */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order again</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Masala Chai', 'Samosa', 'Filter Coffee', 'Dhokla'].map((item, index) => (
              <View key={index} style={styles.orderAgainItem}>
                <View style={styles.orderAgainImage} />
                <Text style={styles.orderAgainName}>{item}</Text>
                <Text style={styles.orderAgainVendor}>Green Tea House</Text>
                <Text style={styles.orderAgainPrice}>₹25</Text>
                <Button title="Add" size="small" style={styles.addButton} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Popular Stores */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular stores near you</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all ›</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={vendors}
            renderItem={renderVendor}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
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
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationIconText: {
    fontSize: 16,
  },
  deliverToText: {
    fontSize: 12,
    color: '#64748b',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  addressText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  actionIcon: {
    fontSize: 18,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  micIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  offerCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  offerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerTextContainer: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  offerSubtitle: {
    fontSize: 14,
    color: '#f0fdf4',
    marginTop: 4,
  },
  claimButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  seeAllText: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
  },
  categoriesList: {
    paddingVertical: 8,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  categoryItems: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  orderAgainItem: {
    width: 120,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  orderAgainImage: {
    width: 80,
    height: 80,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginBottom: 8,
  },
  orderAgainName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  orderAgainVendor: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  orderAgainPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginVertical: 4,
  },
  addButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  vendorCard: {
    marginBottom: 12,
    padding: 0,
  },
  vendorContent: {
    flexDirection: 'row',
  },
  vendorImage: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  promotedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#22c55e',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  promotedText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  vendorInfo: {
    flex: 1,
    padding: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vendorRating: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 12,
  },
  vendorTime: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 12,
  },
  vendorDistance: {
    fontSize: 12,
    color: '#64748b',
  },
  vendorOffer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerText: {
    fontSize: 10,
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 10,
    color: '#64748b',
  },
  bottomPadding: {
    height: 20,
  },
});

export default HomeScreen;