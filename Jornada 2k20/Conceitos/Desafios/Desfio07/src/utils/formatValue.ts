const formatValue = (value: number): string =>
  Intl.NumberFormat('pt-BR', {
    // Formatando para o padrão Brasileiro de moeda.
    style: 'currency',
    currency: 'BRL',
  }).format(value); // TODO

export default formatValue;
