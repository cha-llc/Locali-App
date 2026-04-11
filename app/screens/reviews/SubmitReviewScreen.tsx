import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { submitReview } from '@/lib/reviews';
import type { Booking, ProviderProfile } from '@/lib/database';

const STAR_LABELS = {
  1: '😞 Poor',
  2: '😐 Fair',
  3: '😊 Good',
  4: '😄 Great',
  5: '🤩 Excellent',
};

export default function SubmitReviewScreen({ route, navigation }: any) {
  const { user } = useAuth();
  const { booking, provider } = route.params as {
    booking: Booking;
    provider: ProviderProfile;
  };

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Please select a rating', 'Choose a rating from 1 to 5 stars');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Please add a comment', 'Tell us about your experience');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!user?.id) throw new Error('User not authenticated');

      await submitReview(booking.id, user.id, provider.id, rating, comment);

      Alert.alert(
        'Review Submitted!',
        'Thank you for your feedback. It helps us improve our services.',
        [
          {
            text: 'Done',
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
      console.error('Error submitting review:', err);
      const message = err instanceof Error ? err.message : 'Failed to submit review';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Rate Your Experience</Text>
      </View>

      {/* Provider Info */}
      <View style={styles.providerBox}>
        <Text style={styles.providerLabel}>Service by</Text>
        <Text style={styles.providerName}>Verified Provider</Text>
        <Text style={styles.bookingDate}>{booking.booking_date}</Text>
      </View>

      {/* Star Rating */}
      <View style={styles.ratingSection}>
        <Text style={styles.sectionTitle}>How would you rate this service?</Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Text style={[styles.star, rating >= star && styles.starActive]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {rating > 0 && (
          <Text style={styles.ratingLabel}>
            {rating} out of 5 - {STAR_LABELS[rating as keyof typeof STAR_LABELS]}
          </Text>
        )}
      </View>

      {/* Comment */}
      <View style={styles.commentSection}>
        <Text style={styles.sectionTitle}>Share your feedback</Text>
        <Text style={styles.commentHint}>
          Help us improve by sharing what went well and what could be better
        </Text>

        <TextInput
          style={styles.commentInput}
          placeholder="Tell us about your experience..."
          placeholderTextColor="#ccc"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={5}
          editable={!loading}
        />

        <Text style={styles.charCount}>
          {comment.length} / 500 characters
        </Text>
      </View>

      {/* Benefits Info */}
      <View style={styles.benefitsBox}>
        <Text style={styles.benefitsTitle}>Why leave a review?</Text>
        <Text style={styles.benefitItem}>✓ Help other customers make informed decisions</Text>
        <Text style={styles.benefitItem}>✓ Help providers improve their services</Text>
        <Text style={styles.benefitItem}>✓ Build community trust</Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (rating === 0 || !comment.trim() || loading) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={rating === 0 || !comment.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Review</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.privacy}>
          Your review is public and will help the community. Your identity will be shown.
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
  providerBox: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F2EDE8',
    borderRadius: 8,
  },
  providerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 13,
    color: '#666',
  },
  ratingSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 40,
    color: '#E0E0E0',
  },
  starActive: {
    color: '#F59C1B',
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38A169',
    textAlign: 'center',
  },
  commentSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  commentHint: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  commentInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
  benefitsBox: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F9FDFB',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  benefitItem: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
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
  submitButton: {
    backgroundColor: '#38A169',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  privacy: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
