import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';

export default function FormularioGasto({
  descripcion,
  setDescripcion,
  monto,
  setMonto,
  categoria,
  setCategoria,
  onAgregar,
  onEditar,
  modoEdicion,
  deshabilitado,
}) {
  return (
    <View style={styles.formulario}>
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TextInput
        style={styles.input}
        placeholder="Monto"
        value={monto}
        onChangeText={setMonto}
        keyboardType="number-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Categoría"
        value={categoria}
        onChangeText={setCategoria}
      />

      <Button
        title={modoEdicion ? 'Guardar cambios' : 'Agregar gasto'}
        color="#001F3F"
        onPress={modoEdicion ? onEditar : onAgregar}
        disabled={deshabilitado}
      />

      {modoEdicion && (
        <Text style={styles.textoEdicion}>
          Estás editando un gasto existente.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formulario: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 15,
  },
  textoEdicion: {
    color: '#777777',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
  },
});
