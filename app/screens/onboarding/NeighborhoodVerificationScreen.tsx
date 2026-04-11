import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '@/lib/supabase';

export default function NeighborhoodVerificationScreen({ navigation, route }: any) {
  const { userId } = route.params;
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    type: string;
    size: number;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase();
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const extension = getFileExtension(file.name);

      // Validate file type
      if (!ALLOWED_EXTENSIONS.includes(extension || '')) {
        setError('Only PDF, JPG, and PNG files are allowed');
        return;
      }

      // Validate file size
      if (file.size && file.size > MAX_FILE_SIZE) {
        setError('File size must be less than 5MB');
        return;
      }

      setUploadedFile({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size || 0,
      });
      setError('');
    } catch (err) {
      console.error('Error picking document:', err);
      setError('Failed to select file');
    }
  };

  const handleUploadAndComplete = async () => {
    if (!uploadedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Get the file
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
      });

      if (result.canceled) {
        setUploading(false);
        return;
      }

      const file = result.assets[0];
      const fileUri = file.uri;
      const fileName = `${userId}_${Date.now()}_${file.name}`;

      // Read file as base64
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('verifications')
        .upload(`${userId}/${fileName}`, blob, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Update user record with verification pending status
      const { error: updateError } = await supabase
        .from('users')
        .update({
          verification_status: 'pending',
          verification_document_path: data.path,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Navigate to completion screen
      navigation.navigate('OnboardingComplete', { userId });
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      Alert.alert('Upload Failed', 'Please try again or contact support');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.step}>Step 2 of 2</Text>
          <Text style={styles.title}>Verify Your Neighborhood</Text>
          <Text style={styles.subtitle}>
            Upload one of the following documents to confirm you live in your neighborhood
          </Text>
        </View>

        <View style={styles.documentsSection}>
          <Text style={styles.documentTitle}>Accepted Documents</Text>
          <View style={styles.documentList}>
            <Text style={styles.documentItem}>✓ Utility bill (electric, water, gas)</Text>
            <Text style={styles.documentItem}>✓ Lease or rental agreement</Text>
            <Text style={styles.documentItem}>✓ Official government letter</Text>
          </View>
          <Text style={styles.documentNote}>
            PDF, JPG, or PNG • Max 5MB
          </Text>
        </View>

        <View style={styles.uploadSection}>
          {uploadedFile ? (
            <View style={styles.fileBox}>
              <Text style={styles.fileName}>{uploadedFile.name}</Text>
              <Text style={styles.fileSize}>
                {(uploadedFile.size / 1024).toFixed(2)} KB
              </Text>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={handlePickDocument}
                disabled={uploading}
              >
                <Text style={styles.changeButtonText}>Change File</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handlePickDocument}
              disabled={uploading}
            >
              <Text style={styles.uploadButtonText}>📁 Select Document</Text>
            </TouchableOpacity>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.submitButton,
              !uploadedFile || uploading ? styles.buttonDisabled : null,
            ]}
            onPress={handleUploadAndComplete}
            disabled={!uploadedFile || uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Upload & Complete</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.privacySection}>
          <Text style={styles.privacyTitle}>Your Privacy Matters</Text>
          <Text style={styles.privacyText}>
            Your document is encrypted and used only for neighborhood verification. It will not be shared with other users.
          </Text>
        </View>
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
    paddingTop: 40,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 40,
  },
  step: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38A169',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#124734',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  documentsSection: {
    backgroundColor: '#F2EDE8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 30,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#124734',
    marginBottom: 12,
  },
  documentList: {
    marginBottom: 12,
  },
  documentItem: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 6,
  },
  documentNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  uploadSection: {
    marginBottom: 30,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#38A169',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FDFB',
    marginBottom: 20,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#38A169',
    textAlign: 'center',
  },
  fileBox: {
    backgroundColor: '#F9FDFB',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  changeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  changeButtonText: {
    fontSize: 14,
    color: '#38A169',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#38A169',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 10,
  },
  privacySection: {
    backgroundColor: '#F2EDE8',
    borderRadius: 8,
    padding: 16,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#124734',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});
