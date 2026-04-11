import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { createBooking } from '@/lib/database';
import type { Service, ProviderProfile } from '@/lib/database';

export default function BookingConfirmationScreen({ navigation, route }: any) {
  const { user } = useAuth();
  const { service, provider, selectedDate, selectedTime } = route.params as {
    service: Service;
    provider: ProviderProfile;
    selectedDate: Date;
    selectedTime: string;
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleConfirmBooking = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create booking in Supabase
      const booking = await createBooking(user.id, {
        user_id: user.id,
        provider_id: provider.id,
        service_id: service.id,
        booking_date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
        booking_time: selectedTime,
        duration_minutes: 60,
        status: 'confirmed',
        price: service.base_price,
        location_address: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (!booking) {
        throw new Error('Failed to create booking');
      }

      // Navigate to booking confirmation/receipt
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Tabs',
          },
        ],
      });

      // Show success message
      Alert.alert(
        'Booking Confirmed!',
        `Your service is booked for ${formatDate(selectedDate)} at ${selectedTime}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Already navigated
            },
          },
        ]
      );
    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking');
      Alert.alert('Booking Failed', 'Please try again or contact support');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Confirm Your Booking</Text>
        <Text style={styles.subtitle}>Review your booking details below</Text>
      </View>

      {/* Booking Details Summary */}
      <View style={styles.detailsBox}>
        {/* Service */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Service</Text>
          <Text style={styles.detailValue}>{service.name}</Text>
        </View>

        {/* Provider */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Provider</Text>
          <Text style={styles.detailValue}>Verified Provider</Text>
        </View>

        {/* Date */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{formatDate(selectedDate)}</Text>
        </View>

        {/* Time */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time</Text>
          <Text style={styles.detailValue}>{selectedTime}</Text>
        </View>

        {/* Duration */}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>60 minutes</Text>
        </View>
      </View>

      {/* Price Breakdown */}
      <View style={styles.priceSection}>
        <Text style={styles.priceSectionTitle}>Price Breakdown</Text>

        <View style={styles.priceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>
              ${service.base_price.toLocaleString()}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Platform Fee</Text>
            <Text style={styles.priceValue}>Free</Text>
          </View>

          <View style={styles.priceDivider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              ${service.base_price.toLocaleString()}
            </Text>
          </View>
        </View>

        <Text style={styles.priceNote}>
          Payment will be processed after the service is completed
        </Text>
      </View>

      {/* Terms & Cancellation */}
      <View style={styles.termsBox}>
        <Text style={styles.termsTitle}>Cancellation Policy</Text>
        <Text style={styles.termsText}>
          Free cancellation up to 24 hours before the scheduled time.
        </Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.buttonDisabled]}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  detailsBox: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F2EDE8',
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  priceSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  priceSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  priceBreakdown: {
    backgroundColor: '#F9FDFB',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#38A169',
  },
  priceNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  termsBox: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59C1B',
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#996600',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  errorBox: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 6,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#38A169',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
