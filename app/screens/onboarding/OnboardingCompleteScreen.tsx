import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function OnboardingCompleteScreen({ navigation, route }: any) {
  const { userId } = route.params;

  useEffect(() => {
    // Navigate to App stack after 2 seconds via the root navigator
    const timer = setTimeout(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.reset({ index: 0, routes: [{ name: 'App' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'App' }] });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleGoHome = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.reset({ index: 0, routes: [{ name: 'App' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'App' }] });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✓</Text>
        </View>

        <Text style={styles.title}>You're All Set!</Text>

        <Text style={styles.subtitle}>
          Thank you for completing your profile and verifying your neighborhood.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What Happens Next?</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoItem}>
              • Your verification is pending review by our admin team
            </Text>
            <Text style={styles.infoItem}>
              • You'll receive a notification once your account is approved
            </Text>
            <Text style={styles.infoItem}>
              • Most verifications are completed within 24 hours
            </Text>
          </View>
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>⏳ Pending Verification</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGoHome}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Redirecting in a few seconds...
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
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 60,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    fontSize: 48,
    color: '#38A169',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#124734',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#F2EDE8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#124734',
    marginBottom: 12,
  },
  infoContent: {
    gap: 8,
  },
  infoItem: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  statusBox: {
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 30,
    width: '100%',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#996600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statusBadge: {
    backgroundColor: '#FFE8B6',
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#996600',
  },
  button: {
    backgroundColor: '#38A169',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
});
