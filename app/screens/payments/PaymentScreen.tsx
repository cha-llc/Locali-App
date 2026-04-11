import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import {
  createPaymentIntent,
  getPaymentProvider,
  markBookingAsPaid,
} from '@/lib/payments';
import type { Booking, Service, ProviderProfile } from '@/lib/database';

export default function PaymentScreen({ route, navigation }: any) {
  const { user } = useAuth();
  const { booking, service, provider } = route.params as {
    booking: Booking;
    service: Service;
    provider: ProviderProfile;
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const paymentProvider = getPaymentProvider();

  useEffect(() => {
    // Log payment provider being used
    console.log(
      `Payment provider for ${provider.id || 'default'}: ${paymentProvider}`
    );
  }, []);

  const handlePayment = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const paymentIntent = await createPaymentIntent(
        booking.id,
        user.id,
        provider.id,
        booking.price,
        undefined, // userCountry - could get from user profile
        booking.booking_date.includes('COP') ? 'COP' : 'usd'
      );

      if (!paymentIntent) {
        throw new Error('Failed to create payment intent');
      }

      // In production, redirect to Stripe/MercadoPago checkout
      // For MVP, simulate successful payment
      Alert.alert(
        'Test Mode',
        `Payment ready:\nProvider: ${paymentProvider}\nAmount: $${booking.price}`,
        [
          {
            text: 'Simulate Success',
            onPress: () => simulatePaymentSuccess(paymentIntent.id),
          },
          {
            text: 'Simulate Failure',
            onPress: () => simulatePaymentFailure(paymentIntent.id),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
      Alert.alert('Error', 'Could not process payment');
    } finally {
      setLoading(false);
    }
  };

  const simulatePaymentSuccess = async (paymentId: string) => {
    try {
      // Mark booking as paid
      await markBookingAsPaid(booking.id, paymentId, paymentProvider);

      Alert.alert(
        'Payment Successful!',
        'Your booking is confirmed and paid.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Tabs' }],
              });
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', 'Payment completed but booking update failed');
    }
  };

  const simulatePaymentFailure = async (paymentId: string) => {
    Alert.alert('Payment Failed', 'The payment could not be processed.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Complete Payment</Text>
      </View>

      {/* Booking Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Service</Text>
          <Text style={styles.value}>{service.name}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{booking.booking_date}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{booking.booking_time}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.priceLabel}>Amount</Text>
          <Text style={styles.priceValue}>
            ${booking.price.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Payment Provider Info */}
      <View style={styles.providerBox}>
        <Text style={styles.providerLabel}>Payment Provider</Text>
        <Text style={styles.providerName}>
          {paymentProvider === 'stripe' ? '💳 Stripe' : '💰 MercadoPago'}
        </Text>
        <Text style={styles.providerNote}>
          {paymentProvider === 'stripe'
            ? 'Secure credit card payment via Stripe'
            : 'Payment via MercadoPago'}
        </Text>
      </View>

      {/* Security Info */}
      <View style={styles.securityBox}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          Your payment information is encrypted and secure. Locali never stores your credit card details.
        </Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>
              Pay ${booking.price.toLocaleString()}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By paying, you confirm you agree to our terms and conditions. Your booking will be confirmed immediately after payment.
        </Text>
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
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38A169',
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#124734',
    flex: 1,
  },
  summaryBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F2EDE8',
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#38A169',
  },
  providerBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F9FDFB',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  providerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  providerNote: {
    fontSize: 13,
    color: '#666',
  },
  securityBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    alignItems: 'center',
  },
  securityIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  securityText: {
    fontSize: 13,
    color: '#2E7D32',
    textAlign: 'center',
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
  },
  payButton: {
    backgroundColor: '#38A169',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
    marginBottom: 16,
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
