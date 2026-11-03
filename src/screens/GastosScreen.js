import { useState, useEffect, useRef } from 'react';

import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';

import {
  cargarGastos,
  agregarGasto,
  eliminarGasto,
  editarGasto,
  calcularTotal,
  buscarGastos,
} from '../controllers/GastosController';

import { CATEGORIAS } from '../models/Gasto';

import FormularioGasto from '../componentes/FormularioGasto';
import ListaGastos from '../componentes/ListaGastos';

export default function GastosScreen() {
  const [gastos, setGastos] = useState([]);

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('Todas');

  const [gastoEnEdicion, setGastoEnEdicion] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const scrollRef = useRef(null);

  const modoEdicion = gastoEnEdicion !== null;
  const total = calcularTotal(gastos);
  const gastosVisibles = buscarGastos(gastos, busqueda, filtro);

  useEffect(() => {
    async function iniciar() {
      try {
        const datos = await cargarGastos();
        setGastos(datos);
      } catch (error) {
        Alert.alert(
          'Error',
          'No se pudieron cargar los gastos.'
        );
      } finally {
        setCargando(false);
      }
    }

    iniciar();
  }, []);

  const limpiarFormulario = () => {
    setDescripcion('');
    setMonto('');
    setCategoria('');
    setGastoEnEdicion(null);
  };

  const manejarAgregar = async () => {
    if (guardando || cargando) {
      return;
    }

    try {
      setGuardando(true);

      const nuevosGastos = await agregarGasto(
        gastos,
        descripcion,
        monto,
        categoria
      );

      setGastos(nuevosGastos);
      setBusqueda('');
      setFiltro('Todas');
      limpiarFormulario();
    } catch (error) {
      Alert.alert(
        'No se pudo agregar el gasto',
        error.message || 'Ocurrió un error inesperado.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const manejarEditar = (gasto) => {
    setGastoEnEdicion(gasto.id);
    setDescripcion(gasto.descripcion);
    setMonto(String(gasto.monto));
    setCategoria(gasto.categoria);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const manejarGuardarEdicion = async () => {
    if (guardando || cargando || gastoEnEdicion === null) {
      return;
    }

    try {
      setGuardando(true);

      const nuevosGastos = await editarGasto(
        gastos,
        gastoEnEdicion,
        descripcion,
        monto,
        categoria
      );

      setGastos(nuevosGastos);
      setBusqueda('');
      setFiltro('Todas');
      limpiarFormulario();
    } catch (error) {
      Alert.alert(
        'No se pudieron guardar los cambios',
        error.message || 'Ocurrió un error inesperado.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminar = (id) => {
    if (guardando || cargando) {
      return;
    }

    Alert.alert(
      'Eliminar gasto',
      '¿Estás seguro de que querés eliminar este gasto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setGuardando(true);

              const nuevosGastos = await eliminarGasto(
                gastos,
                id
              );

              setGastos(nuevosGastos);

              if (gastoEnEdicion === id) {
                limpiarFormulario();
              }
            } catch (error) {
              Alert.alert(
                'Error',
                'No se pudo eliminar el gasto.'
              );
            } finally {
              setGuardando(false);
            }
          },
        },
      ]
    );
  };

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#001F3F" />
        <Text style={styles.textoCargando}>
          Cargando gastos...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.pantalla}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.titulo}>Mis gastos</Text>

      <Text style={styles.subtitulo}>
        Registro de gastos personales
      </Text>

      <View style={styles.tarjetaTotal}>
        <Text style={styles.textoTotal}>Total gastado</Text>
        <Text style={styles.montoTotal}>
          ${total.toLocaleString('es-AR')}
        </Text>
      </View>

      <FormularioGasto
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        monto={monto}
        setMonto={setMonto}
        categoria={categoria}
        setCategoria={setCategoria}
        onAgregar={manejarAgregar}
        onEditar={manejarGuardarEdicion}
        modoEdicion={modoEdicion}
        deshabilitado={guardando}
      />

      {modoEdicion && (
        <Pressable
          style={styles.botonCancelar}
          onPress={limpiarFormulario}
          disabled={guardando}
        >
          <Text style={styles.textoCancelar}>
            Cancelar edición
          </Text>
        </Pressable>
      )}

      <TextInput
        style={styles.busqueda}
        placeholder="Buscar por descripción"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <View style={styles.filtros}>
        {['Todas', ...CATEGORIAS].map((item) => (
          <Pressable
            key={item}
            style={[
              styles.filtro,
              filtro === item && styles.filtroActivo,
            ]}
            onPress={() => setFiltro(item)}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.textoFiltro,
                filtro === item && styles.textoFiltroActivo,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <ListaGastos
        gastos={gastosVisibles}
        onEliminarGasto={manejarEliminar}
        onEditarGasto={manejarEditar}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: '#F7F4EF',
  },
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitulo: {
    fontSize: 15,
    color: '#777777',
    marginTop: 5,
    marginBottom: 20,
  },
  tarjetaTotal: {
    backgroundColor: '#001F3F',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  textoTotal: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  montoTotal: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 4,
  },
  busqueda: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  filtros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filtro: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filtroActivo: {
    backgroundColor: '#001F3F',
  },
  textoFiltro: {
    color: '#001F3F',
    fontSize: 13,
    fontWeight: '600',
  },
  textoFiltroActivo: {
    color: '#FFFFFF',
  },
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F4EF',
  },
  textoCargando: {
    marginTop: 12,
    color: '#777777',
  },
  botonCancelar: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  textoCancelar: {
    color: '#777777',
    fontWeight: '600',
  },
});
