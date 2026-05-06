export function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildCsv(headers: readonly string[], rows: readonly (readonly unknown[])[]): string {
  const headerLine = headers.map(escapeCsvField).join(",");
  const rowLines = rows.map((row) => row.map(escapeCsvField).join(","));
  return [headerLine, ...rowLines].join("\n");
}

export function buildCsvFilename(kind: string): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `freeledger-${kind}-${year}-${month}.csv`;
}
