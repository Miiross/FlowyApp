// src/components/Diary/DiaryEntryCard.tsx
import { Entry } from '@/src/contexts/diary/EntriesContext';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  entry: Entry;
  onPress?: () => void;
  onLongPress?: () => void;
};

export default function DiaryEntryCard({ entry, onPress, onLongPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} onLongPress={onLongPress}>
      <Text style={styles.date}>{entry.date}</Text>
      <Text numberOfLines={2} style={styles.text}>{entry.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  date: { fontWeight: '600', marginBottom: 6 },
  text: { color: '#333' },
});
