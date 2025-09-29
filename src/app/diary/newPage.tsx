// app/diary/newPage.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useEntries } from '@/src/contexts/diary/EntriesContext';
import { todayLocalISO } from '@/src/utils/date';

export default function NewPage() {
  const { addEntry } = useEntries();
  const router = useRouter();

  // mantemos data local apenas para exibição/edição opcional
  const today = todayLocalISO();
  const [date] = useState(today); // não exibido por padrão, mas disponível se quiser mostrar
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      Alert.alert('Erro', 'O texto não pode ficar vazio.');
      return;
    }

    try {
      setSaving(true);
      // não é obrigatório enviar date: EntriesContext vai gerar todayLocalISO() se não enviado
      await addEntry({ text: trimmed, createdAt: date });
      router.back(); // volta pra página anterior
    } catch (err) {
      console.warn('Erro ao salvar entry:', err);
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.form}>
        <Text style={styles.label}>Nova entrada</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          style={[styles.input, styles.textarea]}
          placeholder="Escreva sua entrada..."
          multiline
        />

        <Button title={saving ? 'Salvando...' : 'Salvar entrada'} onPress={handleSave} disabled={saving} />
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
    backgroundColor: '#fff',
  },
  textarea: { height: 140, textAlignVertical: 'top' },
});
