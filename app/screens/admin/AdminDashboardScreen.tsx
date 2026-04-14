import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import {
  isUserAdmin,
  getPendingProviders,
  approveProvider,
  rejectProvider,
  logAdminAction,
} from '@/lib/admin';
import type { ProviderProfile } from '@/lib/database';

export default function AdminDashboardScreen({ navigation }: any) {
  const { user } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderProfile | null>(
    null
  );

  useEffect(() => {
    checkAdminAndLoadData();
  }, [user?.id]);

  const checkAdminAndLoadData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Check admin status
      const admin = await isUserAdmin(user.id);
      if (!admin) {
        Alert.alert('Access Denied', 'You do not have admin privileges');
        navigation.goBack();
        return;
      }

      setIsAdmin(true);

      // Load pending providers
      const data = await getPendingProviders();
      setProviders(data);
    } catch (err) {
      console.error('Error loading admin data:', err);
      Alert.alert('Error', 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await checkAdminAndLoadData();
    setRefreshing(false);
  };

  const handleApprove = async (provider: ProviderProfile) => {
    if (!user?.id) return;

    Alert.alert(
      'Approve Provider?',
      `Approve ${provider.user_id}?`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              await approveProvider(provider.id, provider.user_id);
              await logAdminAction(user.id, 'approve_provider', provider.id, {
                user_id: provider.user_id,
              });

              // Refresh list
              await handleRefresh();
              setSelectedProvider(null);
              Alert.alert('Success', 'Provider approved');
            } catch (err) {
              Alert.alert('Error', 'Failed to approve provider');
            }
          },
          style: 'default',
        },
      ]
    );
  };

  const handleReject = async (provider: ProviderProfile) => {
    if (!user?.id) return;

    Alert.prompt(
      'Reject Provider',
      'Enter rejection reason (optional):',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Reject',
          onPress: async (reason = '') => {
            try {
              await rejectProvider(provider.id, provider.user_id, reason);
              await logAdminAction(user.id, 'reject_provider', provider.id, {
                user_id: provider.user_id,
                reason,
              });

              await handleRefresh();
              setSelectedProvider(null);
              Alert.alert('Success', 'Provider rejected');
            } catch (err) {
              Alert.alert('Error', 'Failed to reject provider');
            }
          },
          style: 'destructive',
        },
      ],
      'plain-text'
    );
  };

  const renderProvider = ({ item }: { item: ProviderProfile }) => (
    <TouchableOpacity
      style={styles.providerCard}
      onPress={() => setSelectedProvider(item)}
    >
      <View style={styles.providerHeader}>
        <Text style={styles.providerName}>{item.user_id}</Text>
        <View
          style={[
            styles.statusBadge,
            item.verification_status === 'pending' && styles.statusPending,
          ]}
        >
          <Text style={styles.statusText}>
            {item.verification_status?.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.submittedDate}>
        Submitted:{' '}
        {new Date(item.created_at).toLocaleDateString()}
      </Text>

      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => setSelectedProvider(item)}
      >
        <Text style={styles.viewButtonText}>Review Details →</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#38A169" />
      </View>
    );
  }

  if (selectedProvider) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setSelectedProvider(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailTitle}>Provider Review</Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>User ID</Text>
          <Text style={styles.detailValue}>{selectedProvider.user_id}</Text>

          <Text style={styles.detailLabel}>Verification Status</Text>
          <Text style={styles.detailValue}>
            {selectedProvider.verification_status}
          </Text>

          <Text style={styles.detailLabel}>Submitted</Text>
          <Text style={styles.detailValue}>
            {new Date(selectedProvider.created_at).toLocaleString()}
          </Text>

          {(selectedProvider as any).verification_document_path && (
            <>
              <Text style={styles.detailLabel}>Document</Text>
              <Text style={styles.documentPath}>
                {(selectedProvider as any).verification_document_path}
              </Text>
            </>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => handleReject(selectedProvider)}
          >
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => handleApprove(selectedProvider)}
          >
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>
          {providers.length} pending provider{providers.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {providers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Pending Providers</Text>
          <Text style={styles.emptyStateText}>All providers verified</Text>
        </View>
      ) : (
        <FlatList
          data={providers}
          keyExtractor={(item) => item.id}
          renderItem={renderProvider}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
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
    backgroundColor: '#F9FDFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#124734',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  list: {
    padding: 20,
    gap: 12,
  },
  providerCard: {
    backgroundColor: '#F9FDFB',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFF9E6',
    borderRadius: 4,
  },
  statusPending: {
    backgroundColor: '#FFF9E6',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#996600',
  },
  submittedDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  viewButton: {
    paddingVertical: 8,
  },
  viewButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#38A169',
  },
  detailHeader: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38A169',
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#124734',
  },
  detailCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F9FDFB',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
    marginTop: 12,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  documentPath: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#38A169',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
  },
});
