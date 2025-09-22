import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { EntriesProvider } from "../contexts/diary/EntriesContext"; // sobe uma pasta pra src

//Isso aqui serve como um layout global, onde todos os componentes vao ser renderizados dentro do <Slot />
//Basicamente, da pra usar como header/footer que aparece em todas as telas
export default function RootLayout() {
  return (
    <EntriesProvider>
      <View style={styles.root}>
        <View style={styles.header}>
          {/* Aqui pode ser um header fixo*/}
        </View>
        <Slot />
      </View>
    </EntriesProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#b4dde9',
  },
  header: {
    // opcional styling de header
  },
});