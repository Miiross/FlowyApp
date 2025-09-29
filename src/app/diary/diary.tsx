import { useEntries } from "@/src/contexts/diary/EntriesContext";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AddEntryButton from "../../components/Diary/AddEntryButton";
import DiaryEntryCard from "../../components/Diary/DiaryEntryCard";

export default function Diary() {
  const { entries, loaded } = useEntries();
  const router = useRouter();

  if (!loaded) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Carregando entradas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Retângulo central */}
      <View style={styles.cardContainer}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {entries.length === 0 ? (
            <Text style={styles.emptyText}>No entries yet. Start your first one!</Text>
          ) : (
            entries.map((entry) => (
              <DiaryEntryCard
                key={entry.id}
                entry={entry}
                onPress={() => router.push(`/diary/${entry.id}`)}
              />
            ))
          )}
        </ScrollView>
      </View>

      {/* Botão flutuante */}
      <AddEntryButton onPress={() => router.push("/diary/newPage")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#413636", 
    alignItems: "center", 
    justifyContent: "center",
  },
  cardContainer: {
    flex: 1,
    width: "90%",           // retângulo centralizado horizontalmente
    maxHeight: "80%",       // altura máxima pra não ocupar toda tela
    backgroundColor: "#cbe6e6",
    borderRadius: 12,
    padding: 10,
    elevation: 4,           // sombra no Android
    shadowColor: "#000",    // sombra no iOS
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emptyText: { 
    textAlign: "center", 
    color: "#666", 
    marginTop: 20 
  },
});
