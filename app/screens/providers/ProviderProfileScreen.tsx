import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  getProviderReviews,
  getProviderAverageRating,
  getProviderReviewCount,
  getProviderRatingDistribution,
} from '@/lib/reviews';
import type { ProviderProfile, Review } from '@/lib/database';

export default function ProviderProfileScreen({ route, navigation }: any) {
  const { provider } = route.params as { provider: ProviderProfile };

  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [distribution, setDistribution] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviderData();
  }, [provider.id]);

  const loadProviderData = async () => {
    try {
      setLoading(true);

      const [reviewsData, rating, count, dist] = await Promise.all([
        getProviderReviews(provider.id),
        getProviderAverageRating(provider.id),
        getProviderReviewCount(provider.id),
        getProviderRatingDistribution(provider.id),
      ]);

      setReviews(reviewsData);
      setAvgRating(rating);
      setReviewCount(count);
      setDistribution(dist);
    } catch (err) {
      console.error('Error loading provider data:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Text key={i} style={[styles.star, i < rating && styles.starFilled]}>
          ★
        </Text>
      ))
      .join('');
  };

  const renderRatingBar = (stars: number, count: number) => {
    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;

    return (
      <View key={stars} style={styles.ratingBar}>
        <Text style={styles.ratingStars}>{stars}★</Text>
        <View style={styles.barContainer}>
          <View
            style={[styles.barFill, { width: `${percentage}%` }]}
          />
        </View>
        <Text style={styles.barCount}>{count}</Text>
      </View>
    );
  };

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View>
          <Text style={styles.reviewRating}>{renderStars(item.rating)}</Text>
          <Text style={styles.reviewDate}>
            {new Date(item.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#38A169" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Provider Profile</Text>
      </View>

      {/* Provider Info */}
      <View style={styles.providerBox}>
        <Text style={styles.providerName}>Verified Provider</Text>
        <Text style={styles.verifiedBadge}>✓ Verified</Text>
      </View>

      {/* Rating Summary */}
      <View style={styles.ratingSection}>
        <View style={styles.ratingHeader}>
          <View style={styles.ratingScore}>
            <Text style={styles.score}>{avgRating.toFixed(1)}</Text>
            <Text style={styles.scoreLabel}>out of 5</Text>
          </View>
          <View style={styles.ratingStats}>
            <Text style={styles.statsLabel}>
              Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </Text>
            <View style={styles.starDisplay}>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Text key={i} style={[styles.displayStar, i < Math.round(avgRating) && styles.displayStarFilled]}>
                    ★
                  </Text>
                ))}
            </View>
          </View>
        </View>

        {/* Rating Distribution */}
        <View style={styles.distributionBox}>
          <Text style={styles.distributionTitle}>Rating Breakdown</Text>
          {[5, 4, 3, 2, 1].map((stars) =>
            renderRatingBar(stars, distribution[stars])
          )}
        </View>
      </View>

      {/* Reviews List */}
      {reviewCount > 0 ? (
        <View style={styles.reviewsSection}>
          <Text style={styles.reviewsTitle}>Customer Reviews ({reviewCount})</Text>

          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={renderReview}
            scrollEnabled={false}
            contentContainerStyle={styles.reviewsList}
          />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No reviews yet</Text>
          <Text style={styles.emptyStateText}>
            Be the first to review this provider
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  providerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  verifiedBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38A169',
  },
  ratingSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  ratingScore: {
    alignItems: 'center',
    marginRight: 24,
  },
  score: {
    fontSize: 48,
    fontWeight: '700',
    color: '#38A169',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  ratingStats: {
    flex: 1,
  },
  statsLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  starDisplay: {
    flexDirection: 'row',
    gap: 4,
  },
  displayStar: {
    fontSize: 20,
    color: '#E0E0E0',
  },
  displayStarFilled: {
    color: '#F59C1B',
  },
  distributionBox: {
    backgroundColor: '#F9FDFB',
    padding: 16,
    borderRadius: 8,
  },
  distributionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  ratingStars: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    width: 30,
  },
  barContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#F59C1B',
  },
  barCount: {
    fontSize: 12,
    color: '#999',
    width: 25,
    textAlign: 'right',
  },
  reviewsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: '#F9FDFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewRating: {
    fontSize: 16,
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewComment: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  emptyState: {
    marginHorizontal: 20,
    padding: 32,
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
  star: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  starFilled: {
    color: '#F59C1B',
  },
});
