import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { updateUserProfile } from '@/lib/auth';
import { useAuth } from '@/providers/AuthProvider';

export default function BasicProfileScreen({ navigation }: any) {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!firstName.trim() || !lastName.trim() || !neighborhood.trim()) {
      setError('All fields are required');
      return;
    }

    if (!user) {
      setError('User not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await updateUserProfile(user.id, {
        neighborhood_id: neighborhood.trim(),
      });

      if (!result) {
        throw new Error('Failed to update profile');
      }

      // Proceed to verification
      navigation.navigate('VerificationUpload', { userId: user.id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = firstName.trim() && lastName.trim() && neighborhood.trim();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Help us get to know you</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John"
            value={firstName}
            onChangeText={setFirstName}
            editable={!loading}
            maxLength={50}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Doe"
            value={lastName}
            onChangeText={setLastName}
            editable={!loading}
            maxLength={50}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Neighborhood</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Downtown, Westside, North District"
            value={neighborhood}
            onChangeText={setNeighborhood}
            editable={!loading}
            maxLength={100}
          />
          <Text style={styles.hint}>Enter the neighborhood where you live</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, !isFormValid || loading ? styles.buttonDisabled : null]}
          onPress={handleContinue}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue to Verification</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          Next, we'll verify your neighborhood with an official document.
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#124734',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  button: {
    backgroundColor: '#38A169',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
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
  error: {
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 10,
  },
  note: {
    fontSize: 13,
    color: '#999',
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
});
