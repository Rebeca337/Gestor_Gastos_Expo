import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  StyleSheet,
} from 'react-native';

import { CATEGORIAS } from '../models/Gasto';

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

      <Text style={styles.etiqueta}>Categoría</Text>

      <View style={styles.categorias}>
        {CATEGORIAS.map((item) => (
          <Pressable
            key={item}
            style={[
              styles.categoria,
              categoria === item && styles.categoriaActiva,
            ]}
            onPress={() => setCategoria(item)}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.textoCategoria,
                categoria === item && styles.textoCategoriaActiva,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

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
  etiqueta: {
    color: '#777777',
    fontSize: 14,
    marginBottom: 8,
  },
  categorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  categoria: {
    backgroundColor: '#E6EBF2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  categoriaActiva: {
    backgroundColor: '#001F3F',
  },
  textoCategoria: {
    color: '#001F3F',
    fontSize: 13,
    fontWeight: '600',
  },
  textoCategoriaActiva: {
    color: '#FFFFFF',
  },
  textoEdicion: {
    color: '#777777',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
  },
});
