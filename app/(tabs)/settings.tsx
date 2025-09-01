import { usePreferences } from '@/contexts/PreferencesContext';
import { strings } from '@/i18n/strings';
import { COLORS } from '@/styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { language, setLanguage, theme, setTheme } = usePreferences();
  const t = strings[language];

  const clearHistory = async () => {
    try { await AsyncStorage.removeItem('messages'); } catch {}
  };

  const ThemeOption: React.FC<{ label: string; value: 'system' | 'light' | 'dark' }> = ({ label, value }) => (
    <TouchableOpacity style={[styles.option, theme === value && styles.optionActive]} onPress={() => setTheme(value)}>
      <Text style={[styles.optionText, theme === value && styles.optionTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const LangOption: React.FC<{ label: string; value: 'en' | 'mm' }> = ({ label, value }) => (
    <TouchableOpacity style={[styles.option, language === value && styles.optionActive]} onPress={() => setLanguage(value)}>
      <Text style={[styles.optionText, language === value && styles.optionTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>{t.settings_title}</Text>
    </View>

    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Language Section Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t.language}</Text>
        <View style={styles.row}>
          <LangOption label={t.language_en} value="en" />
          <LangOption label={t.language_mm} value="mm" />
        </View>
      </View>

      {/* Theme Section Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t.theme}</Text>
        <View style={styles.row}>
          <ThemeOption label={t.theme_system} value="system" />
          <ThemeOption label={t.theme_light} value="light" />
          <ThemeOption label={t.theme_dark} value="dark" />
        </View>
      </View>

      {/* About Section Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t.about}</Text>
        <Text style={styles.about}>{t.about_text}</Text>
      </View>

      {/* Clear History Card */}
      <View style={styles.card}>
        <TouchableOpacity onPress={clearHistory} style={styles.dangerBtn}>
          <Text style={styles.dangerText}>{t.clear_history}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);
}

// Styles updated to use COLORS and a card-based layout
const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: COLORS.background },
header: { paddingHorizontal: 20, paddingVertical: 16 },
title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
 scrollContainer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100, gap: 16 },
card: {
  backgroundColor: COLORS.card,
  padding: 16,
  borderRadius: 16,
  shadowColor: COLORS.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 3,
},
sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 12 },
row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
option: {
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 20,
  backgroundColor: COLORS.background,
},
optionActive: { backgroundColor: COLORS.primary },
optionText: { color: COLORS.text, fontWeight: '600' },
optionTextActive: { color: COLORS.white },
dangerBtn: {
  backgroundColor: COLORS.dangerBackground,
  borderRadius: 12,
  padding: 12,
  alignItems: 'center',
},
dangerText: { color: COLORS.danger, fontWeight: '700' },
about: { color: COLORS.textSecondary, fontSize: 15, lineHeight: 22 },
});