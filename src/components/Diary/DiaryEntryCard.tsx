// src/components/Diary/DiaryEntryCard.tsx (atualize o render)
import { Entry } from "@/src/contexts/diary/EntriesContext";
import { formatDateFromYMD } from "@/src/utils/date";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  entry: Entry;
  onPress?: () => void;
  onLongPress?: () => void;
};

const MOOD_EMOJI: Record<string, string> = {
  happy: "😄",
  neutral: "😐",
  sad: "😢",
  angry: "😠",
  anxious: "😰",
};

function formatDate(iso: string) {
  try {
    return formatDateFromYMD(iso);
  } catch {
    return iso;
  }
}

export default function DiaryEntryCard({ entry, onPress, onLongPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.headerRow}>
        <Text style={styles.date}>{formatDate(entry.createdAt)}</Text>
        {entry.mood ? (
          <Text style={styles.mood}>{MOOD_EMOJI[entry.mood] ?? "·"}</Text>
        ) : null}
      </View>
      <Text numberOfLines={2} style={styles.text}>
        {entry.text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    boxShadow: "0 2px 4px rgba(26, 26, 29, 0.212)",
    backgroundColor: "#e6f5fc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontWeight: "600", marginBottom: 6 },
  mood: { fontSize: 18 },
  text: { color: "#333" },
});
