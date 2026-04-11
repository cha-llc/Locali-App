import { supabase } from './supabase';
import type { Review } from './database';

// ============================================================================
// REVIEW OPERATIONS
// ============================================================================

/**
 * Submit a review for a completed booking
 */
export async function submitReview(
  bookingId: string,
  userId: string,
  providerId: string,
  rating: number,
  comment: string
): Promise<Review | null> {
  try {
    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    if (!comment.trim()) {
      throw new Error('Comment cannot be empty');
    }

    // Check if booking exists and is completed
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('status')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    if (booking.status !== 'completed') {
      throw new Error('Can only review completed bookings');
    }

    // Check if review already exists for this booking
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', bookingId)
      .single();

    if (existingReview) {
      throw new Error('Review already submitted for this booking');
    }

    // Create review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert([
        {
          booking_id: bookingId,
          user_id: userId,
          provider_id: providerId,
          rating,
          comment: comment.trim(),
          is_flagged: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Update provider rating
    await updateProviderRating(providerId);

    console.log('Review submitted:', review.id);
    return review;
  } catch (err) {
    console.error('Error submitting review:', err);
    throw err;
  }
}

/**
 * Get reviews for a provider
 */
export async function getProviderReviews(providerId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('provider_id', providerId)
      .eq('is_flagged', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return [];
  }
}

/**
 * Get reviews by a user
 */
export async function getUserReviews(userId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (err) {
    console.error('Error fetching user reviews:', err);
    return [];
  }
}

/**
 * Get average rating for a provider
 */
export async function getProviderAverageRating(providerId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('provider_id', providerId)
      .eq('is_flagged', false);

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    const sum = data.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / data.length) * 10) / 10; // Round to 1 decimal
  } catch (err) {
    console.error('Error calculating average rating:', err);
    return 0;
  }
}

/**
 * Get review count for a provider
 */
export async function getProviderReviewCount(providerId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('provider_id', providerId)
      .eq('is_flagged', false);

    if (error) throw error;

    return data?.length || 0;
  } catch (err) {
    console.error('Error counting reviews:', err);
    return 0;
  }
}

/**
 * Update provider rating in providers table
 */
export async function updateProviderRating(providerId: string): Promise<void> {
  try {
    const avgRating = await getProviderAverageRating(providerId);
    const reviewCount = await getProviderReviewCount(providerId);

    const { error } = await supabase
      .from('providers')
      .update({
        rating_avg: avgRating,
        total_reviews: reviewCount,
      })
      .eq('id', providerId);

    if (error) throw error;

    console.log(`Updated provider ${providerId}: rating=${avgRating}, count=${reviewCount}`);
  } catch (err) {
    console.error('Error updating provider rating:', err);
    throw err;
  }
}

/**
 * Flag a review for moderation
 */
export async function flagReview(reviewId: string, reason: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({
        is_flagged: true,
        flag_reason: reason,
      })
      .eq('id', reviewId);

    if (error) throw error;

    console.log('Review flagged:', reviewId);
  } catch (err) {
    console.error('Error flagging review:', err);
    throw err;
  }
}

/**
 * Delete a review (admin only)
 */
export async function deleteReview(reviewId: string, providerId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;

    // Update provider rating after deletion
    await updateProviderRating(providerId);

    console.log('Review deleted:', reviewId);
  } catch (err) {
    console.error('Error deleting review:', err);
    throw err;
  }
}

/**
 * Get rating distribution for a provider (1-5 stars)
 */
export async function getProviderRatingDistribution(
  providerId: string
): Promise<Record<number, number>> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('provider_id', providerId)
      .eq('is_flagged', false);

    if (error) throw error;

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (!data) return distribution;

    data.forEach((review) => {
      distribution[review.rating]++;
    });

    return distribution;
  } catch (err) {
    console.error('Error getting rating distribution:', err);
    return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }
}

/**
 * Subscribe to provider reviews in real-time
 */
export function subscribeToProviderReviews(
  providerId: string,
  onNewReview: (review: Review) => void
) {
  try {
    const subscription = supabase
      .from(`reviews:provider_id=eq.${providerId}`)
      .on('*', (payload) => {
        if (payload.eventType === 'INSERT') {
          const newReview = payload.new as Review;
          if (!newReview.is_flagged) {
            onNewReview(newReview);
          }
        }
      })
      .subscribe((status) => {
        console.log(`Review subscription status for ${providerId}:`, status);
      });

    return subscription;
  } catch (err) {
    console.error('Error subscribing to reviews:', err);
    throw err;
  }
}
