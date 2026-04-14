import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { getUserProfile } from '@/lib/database';
import type { UserProfile } from '@/lib/database';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    getUserProfile(user.id)
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#38A169';
      case 'pending': return '#F59C1B';
      case 'rejected': return '#D32F2F';
      default: return '#999';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38A169" />
      </View>
    );
  }

  const displayName =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : 'Locali User';

  const verificationStatus = profile?.verification_status || 'unverified';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.phone}>{user?.phone || ''}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Account Status</Text>
          <Text
            style={[
              styles.rowValue,
              { color: getStatusColor(verificationStatus) },
            ]}
          >
            {verificationStatus.charAt(0).toUpperCase() +
              verificationStatus.slice(1)}
          </Text>
        </View>

        {profile?.neighborhood_id ? (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Neighborhood</Text>
            <Text style={styles.rowValue}>{profile.neighborhood_id}</Text>
          </View>
        ) : null}

        <View style={[styles.row, styles.rowLast]}>
          <Text style={styles.rowLabel}>Member Since</Text>
          <Text style={styles.rowValue}>
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })
              : '-'}
          </Text>
        </View>
      </View>

      {verificationStatus === 'pending' && (
        <View style={styles.pendingBox}>
          <Text style={styles.pendingTitle}>Verification Pending</Text>
          <Text style={styles.pendingText}>
            Your document is under review. Most verifications complete within
            24 hours.
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#38A169',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#124734',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 14,
    color: '#666',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  pendingBox: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE8B6',
  },
  pendingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#996600',
    marginBottom: 6,
  },
  pendingText: {
    fontSize: 13,
    color: '#7A5200',
    lineHeight: 20,
  },
  logoutButton: {
    margin: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D32F2F',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: '600',
  },
});
