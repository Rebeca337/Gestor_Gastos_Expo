export const CATEGORIAS = [
  'Alimentación',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Otros',
];

export function crearGasto(descripcion, monto, categoria) {
  return {
    id: Date.now().toString(),
    descripcion: descripcion.trim(),
    monto: Number(monto),
    categoria: categoria.trim(),
  };
}

export function validarGasto(descripcion, monto, categoria) {
  if (!descripcion.trim() || !monto.trim() || !categoria.trim()) {
    return 'Completá todos los campos.';
  }

  //Solo se aceptan montos con números
  if (!/^\d+$/.test(monto.trim()) || Number(monto) <= 0) {
    return 'Escribí el monto solo con números, por ejemplo 15000.';
  }

  return null;
}
