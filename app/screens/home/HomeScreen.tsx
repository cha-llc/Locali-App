import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';

const CATEGORIES = [
  { id: 'cleaning', label: 'Cleaning', icon: '🧹' },
  { id: 'laundry', label: 'Laundry', icon: '👕' },
  { id: 'repair', label: 'Repair', icon: '🔧' },
  { id: 'tutoring', label: 'Tutoring', icon: '📚' },
  { id: 'errands', label: 'Errands', icon: '🛍️' },
  { id: 'other', label: 'More', icon: '➕' },
];

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();

  const firstName = (user as any)?.user_metadata?.first_name || 'there';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
          <Text style={styles.subtitle}>What do you need help with?</Text>
        </View>
      </View>

      {/* Quick book banner */}
      <TouchableOpacity
        style={styles.banner}
        onPress={() => navigation?.getParent()?.navigate('NewBooking')}
        activeOpacity={0.85}
      >
        <View>
          <Text style={styles.bannerTitle}>Book a Service</Text>
          <Text style={styles.bannerSubtitle}>
            Find trusted neighbors ready to help
          </Text>
        </View>
        <Text style={styles.bannerArrow}>→</Text>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse Services</Text>
        <View style={styles.grid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.card}
              onPress={() => navigation?.getParent()?.navigate('NewBooking')}
              activeOpacity={0.75}
            >
              <Text style={styles.cardIcon}>{cat.icon}</Text>
              <Text style={styles.cardLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* How it works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How Locali Works</Text>
        <View style={styles.steps}>
          <View style={styles.step}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Choose a Service</Text>
              <Text style={styles.stepDesc}>
                Browse services offered by verified neighbors
              </Text>
            </View>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Pick a Time</Text>
              <Text style={styles.stepDesc}>
                Select a date and time that works for you
              </Text>
            </View>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Get It Done</Text>
              <Text style={styles.stepDesc}>
                Your neighbor shows up and takes care of it
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#124734',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
  },
  banner: {
    margin: 16,
    backgroundColor: '#38A169',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  bannerArrow: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
  section: {
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#124734',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#F2EDE8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  steps: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#38A169',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  stepNumText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  stepDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});
