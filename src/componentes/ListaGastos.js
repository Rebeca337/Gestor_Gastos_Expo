import { View, Text, StyleSheet } from 'react-native';
import TarjetaGasto from './TarjetaGasto';

export default function ListaGastos({
  gastos,
  onEliminarGasto,
  onEditarGasto,
}) {
  if (gastos.length === 0) {
    return (
      <Text style={styles.vacio}>
        No hay gastos para mostrar.
      </Text>
    );
  }

  return (
    <View>
      {gastos.map((gasto) => (
        <TarjetaGasto
          key={gasto.id}
          gasto={gasto}
          onEliminar={() => onEliminarGasto(gasto.id)}
          onEditar={() => onEditarGasto(gasto)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  vacio: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777777',
  },
});
