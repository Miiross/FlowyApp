// app/diary/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEntries } from '@/src/contexts/diary/EntriesContext';
import { todayLocalISO, parseLocalDateFromYMD, formatDateTimeFromYMDorISO } from '@/src/utils/date';

type Params = { id?: string; };

export default function EditEntry() {
  const params = useLocalSearchParams<Params>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const { entries, updateEntry, deleteEntry, loaded } = useEntries();
  const router = useRouter();

  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!loaded) return <View style={[styles.container, {alignItems:'center', justifyContent:'center'}]}><ActivityIndicator size="large" /><Text>Carregando entrada...</Text></View>;
  if (!id) return <View style={styles.container}><Text>ID inválido.</Text></View>;

  const entry = entries.find((e) => e.id === id);
  useEffect(() => { if (entry) setText(entry.text); }, [entry]);
  if (!entry) return <View style={styles.container}><Text>Entrada não encontrada.</Text></View>;

  const isEditable = todayLocalISO() === entry.createdAt; // só pode editar se data do celular = data da criação

  const handleSave = async () => {
    if (!isEditable) { Alert.alert('Aviso', 'Não é possível editar esta entrada em outro dia.'); return; }
    const trimmed = text.trim();
    if (trimmed.length === 0) { Alert.alert('Erro', 'O texto não pode ficar vazio.'); return; }
    try {
      setSaving(true);
      await updateEntry(id, { text: trimmed });
      router.back();
    } catch (err) {
      console.warn('Erro ao atualizar entry:', err);
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (!isEditable) { Alert.alert('Aviso', 'Não é possível apagar esta entrada em outro dia.'); return; }
    Alert.alert('Excluir', 'Deseja realmente apagar esta entrada?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            await deleteEntry(id);
            router.back();
          } catch (err) {
            console.warn('Erro ao deletar entry:', err);
            Alert.alert('Erro', 'Não foi possível excluir. Tente novamente.');
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined} style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Data de criação</Text>
        <Text style={styles.readonlyDate}>{formatDateTimeFromYMDorISO(entry.createdAt)}</Text>

        <Text style={styles.label}>Texto</Text>
        <TextInput value={text} onChangeText={setText} style={[styles.input, styles.textarea]} multiline editable={isEditable} />

        <Button title={saving ? 'Salvando...' : 'Salvar'} onPress={handleSave} disabled={saving} />
        <View style={{height:10}} />
        <Button title={deleting ? 'Excluindo...' : 'Excluir'} color="#e8524d" onPress={handleDeleteConfirm} disabled={deleting} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, backgroundColor:'#fff' },
  form:{ flex:1 },
  label:{ marginBottom:6, fontWeight:'600' },
  readonlyDate:{ marginBottom:12, color:'#333' },
  input:{ borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:6, marginBottom:12, backgroundColor:'#fff' },
  textarea:{ height:160, textAlignVertical:'top' },
});
