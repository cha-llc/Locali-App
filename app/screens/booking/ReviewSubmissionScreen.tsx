import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import {
  canReviewBooking,
  submitReview,
  getReviewByBooking,
} from '@/lib/reviews';
import type { Review } from '@/lib/database';

export default function ReviewSubmissionScreen({ route, navigation }: any) {
  const { user } = useAuth();
  const { bookingId, serviceName, providerId } = route.params;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reason, setReason] = useState('');
  const [existingReview, setExistingReview] = useState<Review | null>(null);

  useEffect(() => {
    checkEligibility();
  }, [bookingId, user?.id]);

  const checkEligibility = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Check if review already exists
      const existing = await getReviewByBooking(bookingId);
      if (existing) {
        setExistingReview(existing);
        setCanReview(false);
        setReason('You have already reviewed this booking');
        return;
      }

      // Check eligibility
      const { canReview: can, reason: msg } = await canReviewBooking(
        user.id,
        bookingId
      );
      setCanReview(can);
      if (!can) {
        setReason(msg || 'Cannot review this booking');
      }
    } catch (err) {
      console.error('Error checking eligibility:', err);
      setReason('Error checking eligibility');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user?.id || !rating) {
      Alert.alert('Please select a rating', 'You must select a star rating');
      return;
    }

    setSubmitting(true);

    try {
      await submitReview(bookingId, user.id, providerId, rating, comment);

      Alert.alert('Review Submitted!', 'Thank you for your feedback', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (err) {
      console.error('Error submitting review:', err);
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to submit review'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#38A169" />
      </View>
    );
  }

  // Already reviewed
  if (existingReview) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Review</Text>
        </View>

        <View style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Text style={styles.serviceName}>{serviceName}</Text>
            <View style={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Text key={i} style={styles.starIcon}>
                  {i < existingReview.rating ? '⭐' : '☆'}
                </Text>
              ))}
            </View>
          </View>

          {existingReview.comment && (
            <Text style={styles.reviewComment}>{existingReview.comment}</Text>
          )}

          <Text style={styles.reviewDate}>
            Reviewed on{' '}
            {new Date(existingReview.created_at).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Cannot review
  if (!canReview) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Leave a Review</Text>
        </View>

        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Cannot Review</Text>
          <Text style={styles.errorText}>{reason}</Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Review form
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Leave a Review</Text>
        <Text style={styles.subtitle}>{serviceName}</Text>
      </View>

      {/* Rating Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How would you rate this service?</Text>
        <Text style={styles.sectionSubtitle}>Select a rating (1-5 stars)</Text>

        <View style={styles.starSelector}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              style={styles.starButton}
              onPress={() => setRating(star)}
            >
              <Text style={styles.starText}>
                {star <= rating ? '⭐' : '☆'}
              </Text>
              <Text style={styles.starLabel}>{star}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {rating > 0 && (
          <Text style={styles.ratingFeedback}>
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </Text>
        )}
      </View>

      {/* Comment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add a comment (optional)</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Share your experience with this provider..."
          placeholderTextColor="#ccc"
          multiline
          numberOfLines={5}
          value={comment}
          onChangeText={setComment}
          maxLength={500}
        />
        <Text style={styles.characterCount}>
          {comment.length}/500 characters
        </Text>
      </View>

      {/* Guidelines */}
      <View style={styles.guidelinesBox}>
        <Text style={styles.guidelinesTitle}>Review Guidelines</Text>
        <Text style={styles.guidelineItem}>• Be honest and fair</Text>
        <Text style={styles.guidelineItem}>• Focus on the service quality</Text>
        <Text style={styles.guidelineItem}>• Be respectful and constructive</Text>
      </View>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!rating || submitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmitReview}
          disabled={!rating || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Review</Text>
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
  },
  backLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38A169',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#124734',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  starSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  starButton: {
    alignItems: 'center',
    padding: 12,
  },
  starText: {
    fontSize: 36,
    marginBottom: 4,
  },
  starLabel: {
    fontSize: 12,
    color: '#666',
  },
  ratingFeedback: {
    fontSize: 16,
    fontWeight: '600',
    color: '#38A169',
    textAlign: 'center',
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
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
  guidelinesBox: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F2EDE8',
    borderRadius: 8,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginBottom: 8,
  },
  guidelineItem: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    lineHeight: 18,
  },
  reviewCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F9FDFB',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  reviewHeader: {
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  starIcon: {
    fontSize: 20,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  errorBox: {
    marginHorizontal: 20,
    marginBottom: 24,
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D32F2F',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  submitButton: {
    backgroundColor: '#38A169',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
