import { usePreferences } from '@/contexts/PreferencesContext';
import { strings } from '@/i18n/strings';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { language, setLanguage, completeOnboarding } = usePreferences();

  const t = strings[language];

  const onStart = async () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Image source={require('@/assets/images/pyit-logo.png')} style={styles.logo} />
        <Text style={styles.title}>{t.appName}</Text>
        <Text style={styles.tagline}>{t.tagline}</Text>
        <View style={styles.langRow}>
          <TouchableOpacity
            style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langBtn, language === 'mm' && styles.langBtnActive]}
            onPress={() => setLanguage('mm')}
          >
            <Text style={[styles.langText, language === 'mm' && styles.langTextActive]}>MM</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onStart} style={styles.startBtn}>
          <Text style={styles.startText}>{t.start}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  logo: { width: 120, height: 120, marginBottom: 16,borderRadius: 100 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827' },
  tagline: { fontSize: 16, color: '#6b7280', marginTop: 8, textAlign: 'center' },
  langRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  langBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  langBtnActive: { backgroundColor: '#111827' },
  langText: { color: '#111827', fontWeight: '600' },
  langTextActive: { color: 'white' },
  startBtn: { marginTop: 28, backgroundColor: '#111827', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  startText: { color: 'white', fontSize: 16, fontWeight: '700' },
});


