// app/diary/newPage.tsx
import { useEntries } from "@/src/contexts/diary/EntriesContext";
import { todayLocalISO } from "@/src/utils/date";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MOODS: {
  key: "happy" | "neutral" | "sad" | "angry" | "anxious";
  label: string;
  emoji: string;
}[] = [
  { key: "happy", label: "Feliz", emoji: "😄" },
  { key: "neutral", label: "Neutro", emoji: "😐" },
  { key: "sad", label: "Triste", emoji: "😢" },
  { key: "angry", label: "Bravo", emoji: "😠" },
  { key: "anxious", label: "Ansioso", emoji: "😰" },
];

export default function NewPage() {
  const { addEntry } = useEntries();
  const router = useRouter();

  const today = todayLocalISO();
  const [date] = useState(today);
  const [text, setText] = useState("");
  const [mood, setMood] = useState<
    "happy" | "neutral" | "sad" | "angry" | "anxious"
  >("neutral"); // default
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      Alert.alert("Erro", "O texto não pode ficar vazio.");
      return;
    }

    try {
      setSaving(true);
      await addEntry({ text: trimmed, createdAt: date, mood });
      router.back();
    } catch (err) {
      console.warn("Erro ao salvar entry:", err);
      Alert.alert("Erro", "Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.form}>
        <Text style={styles.label}>Nova entrada</Text>

        <Text style={{ marginBottom: 6 }}>Humor</Text>
        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m.key}
              onPress={() => setMood(m.key)}
              style={[
                styles.moodButton,
                mood === m.key ? styles.moodSelected : undefined,
              ]}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={styles.moodLabel}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          value={text}
          onChangeText={setText}
          style={[styles.input, styles.textarea]}
          placeholder="Escreva sua entrada..."
          multiline
        />

        <Button
          title={saving ? "Salvando..." : "Salvar entrada"}
          onPress={handleSave}
          disabled={saving}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  form: { flex: 1 },
  label: { marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  textarea: { height: 140, textAlignVertical: "top" },

  moodRow: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  moodButton: {
    alignItems: "center",
    padding: 8,
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
  },
  moodSelected: {
    borderColor: "#18b0df",
    backgroundColor: "#e6f7fb",
  },
  moodEmoji: { fontSize: 22 },
  moodLabel: { fontSize: 12, marginTop: 4 },
});
