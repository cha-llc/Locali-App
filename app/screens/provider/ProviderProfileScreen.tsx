import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { getProviderReviews, getProviderRating } from '@/lib/reviews';
import type { Review } from '@/lib/database';

export default function ProviderProfileScreen({ route, navigation }: any) {
  const { providerId, providerName } = route.params;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<{ rating: number; count: number } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviderData();
  }, [providerId]);

  const loadProviderData = async () => {
    try {
      setLoading(true);

      const [reviewsData, ratingData] = await Promise.all([
        getProviderReviews(providerId),
        getProviderRating(providerId),
      ]);

      setReviews(reviewsData);
      setRating(ratingData);
    } catch (err) {
      console.error('Error loading provider data:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderRatingSection = () => {
    if (!rating) return null;

    return (
      <View style={styles.ratingSection}>
        <Text style={styles.ratingTitle}>Provider Rating</Text>

        <View style={styles.ratingDisplay}>
          <Text style={styles.ratingNumber}>
            {rating.rating > 0 ? rating.rating.toFixed(1) : 'No ratings'}
          </Text>
          <View style={styles.starsContainer}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Text key={i} style={styles.starIcon}>
                {i < Math.floor(rating.rating) ? '⭐' : '☆'}
              </Text>
            ))}
          </View>
          <Text style={styles.reviewCount}>
            Based on {rating.count} {rating.count === 1 ? 'review' : 'reviews'}
          </Text>
        </View>
      </View>
    );
  };

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.stars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Text key={i} style={styles.starIcon}>
              {i < item.rating ? '⭐' : '☆'}
            </Text>
          ))}
        </View>
        <Text style={styles.reviewDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>

      {item.comment && <Text style={styles.reviewComment}>{item.comment}</Text>}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#38A169" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{providerName}</Text>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderRatingSection()}

        {/* Reviews Section */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>
            Reviews ({reviews.length})
          </Text>

          {reviews.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No reviews yet</Text>
              <Text style={styles.emptyStateText}>
                Be the first to review this provider
              </Text>
            </View>
          ) : (
            <FlatList
              data={reviews}
              keyExtractor={(item) => item.id}
              renderItem={renderReview}
              scrollEnabled={false}
              contentContainerStyle={styles.reviewsList}
            />
          )}
        </View>
      </ScrollView>
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38A169',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#124734',
  },
  ratingSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  ratingDisplay: {
    backgroundColor: '#F9FDFB',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#38A169',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 12,
  },
  starIcon: {
    fontSize: 24,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  reviewsSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: '#F9FDFB',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
  },
});
