import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { getServices, getVerifiedProviders } from '@/lib/database';
import type { Service, ProviderProfile } from '@/lib/database';

interface ServiceWithProvider extends Service {
  provider?: ProviderProfile;
}

export default function ServiceSelectionScreen({ navigation }: any) {
  const [category, setCategory] = useState<string>('all');
  const [services, setServices] = useState<ServiceWithProvider[]>([]);
  const [providers, setProviders] = useState<Map<string, ProviderProfile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const CATEGORIES = [
    { id: 'all', name: 'All Services' },
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'laundry', name: 'Laundry' },
    { id: 'repair', name: 'Repair' },
    { id: 'tutoring', name: 'Tutoring' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load all services and providers
      const [allServices, allProviders] = await Promise.all([
        getServices(),
        getVerifiedProviders(),
      ]);

      // Create provider map for quick lookup
      const providerMap = new Map(allProviders.map((p) => [p.id, p]));
      setProviders(providerMap);

      // Attach provider info to services
      const servicesWithProviders = allServices.map((service) => ({
        ...service,
        provider: providerMap.get(service.provider_id),
      }));

      setServices(servicesWithProviders);
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Failed to load services. Please try again.');
      Alert.alert('Error', 'Could not load available services');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(
    (service) => category === 'all' || service.category === category
  );

  const handleSelectService = (service: ServiceWithProvider) => {
    if (!service.provider) {
      Alert.alert('Error', 'Provider information unavailable');
      return;
    }

    navigation.navigate('AvailabilitySelection', {
      service,
      provider: service.provider,
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#38A169" style={styles.spinner} />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select a Service</Text>
        <Text style={styles.subtitle}>Choose what you need help with</Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Category Filter */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoriesContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              category === item.id && styles.categoryButtonActive,
            ]}
            onPress={() => setCategory(item.id)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                category === item.id && styles.categoryButtonTextActive,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Services List */}
      {filteredServices.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No services available</Text>
          <Text style={styles.emptyStateText}>
            Try selecting a different category
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.servicesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.serviceCard}
              onPress={() => handleSelectService(item)}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.providerName}>
                  {item.provider?.user_id ? 'Provider Available' : 'Loading...'}
                </Text>
                <View style={styles.serviceFooter}>
                  <Text style={styles.price}>
                    ${item.base_price.toLocaleString()}
                  </Text>
                  <View style={styles.rating}>
                    <Text style={styles.ratingText}>
                      ⭐ {item.provider?.rating_avg || 0}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#124734',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 12,
  },
  errorBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#D32F2F',
    padding: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryButtonActive: {
    backgroundColor: '#38A169',
    borderColor: '#38A169',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  servicesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#38A169',
  },
  rating: {
    backgroundColor: '#F2EDE8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  arrow: {
    fontSize: 28,
    color: '#ccc',
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
