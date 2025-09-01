import { usePreferences } from '@/contexts/PreferencesContext';
import { strings } from '@/i18n/strings';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// This is just sample data to show how the list would look.
// In a real app, you would fetch this from storage.
const DUMMY_CHATS = [
  { id: '1', title: 'Photosynthesis Explained', lastMessage: 'Great, that makes sense!', timestamp: '10:45 AM' },
  { id: '2', title: 'History of Myanmar', lastMessage: 'Can you tell me more about...', timestamp: 'Yesterday' },
  { id: '3', title: 'Pythagorean Theorem', lastMessage: 'a² + b² = c²', timestamp: 'Sep 01' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { language } = usePreferences();
  const t = strings[language];

  // State to toggle between empty and populated list for demonstration
  const [recentChats, setRecentChats] = useState(DUMMY_CHATS);

  const ShortcutCard = ({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Feather name={icon} size={24} color={COLORS.primary} />
      <Text style={styles.cardText}>{label}</Text>
    </TouchableOpacity>
  );

  const RecentChatItem = ({ title, lastMessage, timestamp }: { title: string; lastMessage: string; timestamp: string }) => (
    <TouchableOpacity style={styles.recentItem}>
      <View style={styles.recentItemIcon}>
        <Feather name="message-square" size={20} color={COLORS.primary} />
      </View>
      <View style={styles.recentItemTextContainer}>
        <Text style={styles.recentItemTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.recentItemSubtitle} numberOfLines={1}>{lastMessage}</Text>
      </View>
      <Text style={styles.recentItemTimestamp}>{timestamp}</Text>
    </TouchableOpacity>
  );

  const RecentEmptyState = () => (
    <View style={styles.recentEmptyContainer}>
      <Image source={require('@/assets/images/pyit-logo.png')} style={styles.emptyStateIcon} />
      <Text style={styles.recentEmptyTitle}>{t.recent_empty_title || 'No Recent Chats'}</Text>
      <Text style={styles.recentEmptySubtitle}>{t.recent_empty_subtitle || 'Start a new conversation to see it here.'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header remains the same */}
      <View style={styles.header}>
        <Image source={require('@/assets/images/pyit-logo.png')} style={styles.logo} />
        <View>
          <Text style={styles.greet}>{t.home_greeting}</Text>
          <Text style={styles.subtitle}>{t.appName}</Text>
        </View>
      </View>

             <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Quick Actions section is back, replacing the FAB */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickRow}>
            <ShortcutCard icon="plus-circle" label={"New Chat"} onPress={() => router.push('/(tabs)/chat')} />
            <ShortcutCard icon="clock" label={"History"} onPress={() => router.push('/history')} />
            <ShortcutCard icon="settings" label={"Settings"} onPress={() => router.push('/(tabs)/settings')} />
          </View>
        </View>

        {/* Recent Chats section now shows a list or the empty state */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Chats</Text>
          {recentChats.length === 0 ? (
            <RecentEmptyState />
          ) : (
            <View style={styles.recentList}>
              {recentChats.map(chat => (
                <RecentChatItem key={chat.id} {...chat} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Using a consistent color theme
const COLORS = {
  primary: '#007AFF',
  background: '#F0F2F5',
  card: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#8A8A8E',
  shadow: '#000000',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 16 },
  logo: { width: 48, height: 48, borderRadius: 12 },
  greet: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  subtitle: { color: COLORS.textSecondary, fontSize: 16 },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  quickRow: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardText: { fontWeight: '600', color: COLORS.text, fontSize: 14 },

  // Styles for the populated recent chats list
  recentList: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  recentItemIcon: {
    backgroundColor: `${COLORS.primary}1A`, // Primary color with ~10% opacity
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentItemTextContainer: { flex: 1 },
  recentItemTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  recentItemSubtitle: { fontSize: 14, color: COLORS.textSecondary, paddingTop: 2 },
  recentItemTimestamp: { fontSize: 12, color: COLORS.textSecondary },

  // Styles for the empty state
  recentEmptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyStateIcon: { width: 80, height: 80, opacity: 0.8, marginBottom: 16 },
  recentEmptyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  recentEmptySubtitle: { color: COLORS.textSecondary, textAlign: 'center', maxWidth: '80%' },
});