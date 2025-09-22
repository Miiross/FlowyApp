import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useEntries } from '@/src/contexts/diary/EntriesContext';



export default function NewPage() {
  const { addEntry } = useEntries();
  const router = useRouter();

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [text, setText] = useState('');

  const handleSave = () => {
    if (text.trim().length === 0) return;
    addEntry({ date, text: text.trim() });
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.form}>
        <Text style={styles.label}>Data</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />

        <Text style={styles.label}>Texto</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={text}
          onChangeText={setText}
          placeholder="Escreva sua entrada..."
          multiline
        />

        <Button title="Salvar entrada" onPress={handleSave} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  form: { flex: 1 },
  label: { marginBottom: 6, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  textarea: { height: 140, textAlignVertical: 'top' },
});