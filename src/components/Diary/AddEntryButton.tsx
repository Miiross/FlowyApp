import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';


type Props = {
  onPress: () => void;
};

export default function AddEntryButton({ onPress }: Props) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.plus}>s</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#18b0df',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  plus: { color: '#fff', fontSize: 30, height: 45},
});
