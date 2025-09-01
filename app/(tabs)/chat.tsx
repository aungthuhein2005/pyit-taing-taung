import { usePreferences } from '@/contexts/PreferencesContext';
import { strings } from '@/i18n/strings';
import { COLORS } from '@/styles/theme';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type ChatMessage = { id: string; text: string; sender: 'user' | 'bot' };

const useOfflineLLM = () => {
  const [isReady, setIsReady] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => { setIsReady(true); setLoading(false); }, 1200);
    return () => clearTimeout(timer);
  }, []);
  const generate = async (prompt: string) => {
    if (!isReady) return 'Model is not ready yet. Please wait.';
    await new Promise(r => setTimeout(r, 400));
    const p = prompt.toLowerCase();
    if (p.includes('photosynthesis')) return 'Photosynthesis converts light energy into chemical energy in plants.';
    if (p.includes('pythagorean')) return 'a² + b² = c² for right triangles—Pythagorean theorem.';
    if (p.includes('hello') || p.includes('hi')) return 'Hello! Ask me about science, history, or math.';
    return "I'm not sure. Try a specific topic like 'photosynthesis' or 'World War II'.";
  };
  return { loading, isReady, generate };
};

export default function ChatScreen() {
  const { language } = usePreferences();
  const t = strings[language];
  const { loading, isReady, generate } = useOfflineLLM();

  const [text, setText] = React.useState('');
  const [isResponding, setIsResponding] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const svRef = React.useRef<ScrollView | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('messages');
        if (saved) setMessages(JSON.parse(saved));
        else setMessages([{ id: '1', text: 'Hi! Your offline assistant is ready.', sender: 'bot' }]);
      } catch {}
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      try { await AsyncStorage.setItem('messages', JSON.stringify(messages)); } catch {}
    })();
  }, [messages]);

  const onSend = async () => {
    if (!text.trim() || !isReady) return;
    const user: ChatMessage = { id: Date.now().toString(), text, sender: 'user' };
    setMessages(prev => [...prev, user]);
    setText('');
    setIsResponding(true);
    const botText = await generate(user.text);
    const bot: ChatMessage = { id: (Date.now()+1).toString(), text: botText, sender: 'bot' };
    setMessages(prev => [...prev, bot]);
    setIsResponding(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header updated to match home screen style */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.chat_title}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: isReady ? COLORS.success : COLORS.error }]} />
          <Text style={styles.statusText}>{loading ? t.status_loading : isReady ? t.status_ready : t.status_error}</Text>
        </View>
      </View>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView
            ref={svRef}
            style={styles.list}
            contentContainerStyle={{ paddingVertical: 12 }}
            onContentSizeChange={() => svRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map(m => (
              <View key={m.id} style={[styles.bubble, m.sender === 'user' ? styles.user : styles.bot]}>
                <Text style={[styles.msg, { color: m.sender === 'user' ? COLORS.white : COLORS.text }]}>{m.text}</Text>
              </View>
            ))}
            {isResponding && (
              <View style={[styles.bubble, styles.bot, { padding: 10 }]}>
                <ActivityIndicator size="small" color={COLORS.textSecondary} />
              </View>
            )}
          </ScrollView>
          <View style={styles.inputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={t.input_placeholder}
              placeholderTextColor={COLORS.textSecondary}
              style={styles.input}
            />
            <TouchableOpacity onPress={onSend} disabled={!isReady || isResponding} style={styles.send}>
              <Feather name="arrow-up" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

// Styles updated to use the COLORS object
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingBottom: 90 },
  header: { paddingHorizontal: 20, paddingVertical: 16,shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 ,borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: COLORS.textSecondary, fontSize: 14 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { flex: 1, paddingHorizontal: 16 },
  bubble: { padding: 14, borderRadius: 20, marginVertical: 6, maxWidth: '80%' },
  user: { backgroundColor: COLORS.primary, alignSelf: 'flex-end', borderBottomRightRadius: 6 },
  bot: { backgroundColor: COLORS.card, alignSelf: 'flex-start', borderBottomLeftRadius: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  msg: { fontSize: 16 },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingHorizontal: 18,
    color: COLORS.text,
    fontSize: 16,
  },
  send: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});