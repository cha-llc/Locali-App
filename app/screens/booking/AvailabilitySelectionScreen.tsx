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
import DateTimePicker from '@react-native-community/datetimepicker';
import type { Service, ProviderProfile } from '@/lib/database';

const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
];

export default function AvailabilitySelectionScreen({ navigation, route }: any) {
  const { service, provider } = route.params as {
    service: Service;
    provider: ProviderProfile;
  };

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
    setShowDatePicker(false);
  };

  const handleContinue = async () => {
    if (!selectedTime) {
      Alert.alert('Please select a time slot', 'Choose a time for your booking');
      return;
    }

    // Navigate to booking confirmation
    navigation.navigate('BookingConfirmation', {
      service,
      provider,
      selectedDate,
      selectedTime,
    });
  };

  const isDatePast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isBtnDisabled = !selectedTime;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Date & Time</Text>
        <Text style={styles.subtitle}>
          {service.name} with verified provider
        </Text>
      </View>

      {/* Service Summary */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryLabel}>Service</Text>
        <Text style={styles.summaryValue}>{service.name}</Text>
        <Text style={styles.summaryLabel} style={{ marginTop: 12 }}>
          Provider
        </Text>
        <Text style={styles.summaryValue}>Available Provider</Text>
      </View>

      {/* Date Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {isDatePast(selectedDate) && (
          <Text style={styles.error}>Please select a future date</Text>
        )}
      </View>

      {/* Time Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time</Text>
        <Text style={styles.timeNote}>Available time slots (60 min duration)</Text>

        <View style={styles.timeSlotsGrid}>
          {TIME_SLOTS.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[
                styles.timeSlot,
                selectedTime === slot && styles.timeSlotSelected,
              ]}
              onPress={() => setSelectedTime(slot)}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  selectedTime === slot && styles.timeSlotTextSelected,
                ]}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Price Summary */}
      <View style={styles.priceBox}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Service Fee</Text>
          <Text style={styles.priceValue}>
            ${service.base_price.toLocaleString()}
          </Text>
        </View>
        <View style={styles.priceDivider} />
        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ${service.base_price.toLocaleString()}
          </Text>
        </View>
        <Text style={styles.priceNote}>Prices may vary based on location</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, isBtnDisabled && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={isBtnDisabled}
        >
          <Text style={styles.buttonText}>Continue to Confirmation</Text>
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
  summaryBox: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F2EDE8',
    borderRadius: 8,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  error: {
    color: '#D32F2F',
    fontSize: 13,
    marginTop: 8,
  },
  timeNote: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    width: '31%',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: '#38A169',
    borderColor: '#38A169',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeSlotTextSelected: {
    color: '#fff',
  },
  priceBox: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F9FDFB',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
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
    marginTop: 8,
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#38A169',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
