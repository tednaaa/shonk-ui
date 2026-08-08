export function createCSVFile(name: string, csv: string): File {
  const trimmed = csv.trim().split('\n').map(line => line.trim()).join('\n');
  if (!trimmed)
    throw new Error('csv must not be empty');

  return new File(
    [trimmed],
    name.endsWith('.csv') ? name : `${name}.csv`,
    { type: 'text/csv' },
  );
}
