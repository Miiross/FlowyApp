// app/diary/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEntries } from '@/src/contexts/diary/EntriesContext';

type Params = {
  id?: string;
};

export default function EditEntry() {
  const params = useLocalSearchParams<Params>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const { entries, updateEntry, deleteEntry, loaded } = useEntries();
  const router = useRouter();

  const [text, setText] = useState('');
  const [date, setDate] = useState('');

  // enquanto o provider não carregou, mostra loading
  if (!loaded) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Carregando entrada...</Text>
      </View>
    );
  }

  if (!id) {
    return (
      <View style={styles.container}>
        <Text>ID inválido.</Text>
      </View>
    );
  }

  const entry = entries.find(e => e.id === id);

  useEffect(() => {
    // sempre que a entry (ou id) mudar, atualiza inputs
    if (entry) {
      setText(entry.text);
      setDate(entry.date);
    }
  }, [entry]);

  if (!entry) {
    return (
      <View style={styles.container}>
        <Text>Entrada não encontrada.</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (text.trim().length === 0) {
      Alert.alert('Erro', 'O texto não pode ficar vazio.');
      return;
    }
    updateEntry(id, { date, text: text.trim() });
    router.back();
  };

  const handleDelete = () => {
    Alert.alert('Excluir', 'Deseja realmente apagar esta entrada?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteEntry(id);
          router.back();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Data</Text>
        <TextInput value={date} onChangeText={setDate} style={styles.input} placeholder="YYYY-MM-DD" />

        <Text style={styles.label}>Texto</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          style={[styles.input, styles.textarea]}
          multiline
        />

        <Button title="Salvar" onPress={handleSave} />
        <View style={{ height: 10 }} />
        <Button title="Excluir" color="#d9534f" onPress={handleDelete} />
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
  textarea: { height: 160, textAlignVertical: 'top' },
});