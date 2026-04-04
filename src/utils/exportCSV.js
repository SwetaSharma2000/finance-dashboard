export function exportToCSV(transactions) {
  if (!transactions.length) return;

  const headers = ["Date", "Description", "Category", "Type", "Amount (₹)"];

  const rows = transactions.map((tx) => [
    tx.date,
    `"${tx.description}"`, // wrap in quotes in case of commas
    tx.category,
    tx.type,
    Math.abs(tx.amount),
  ]);

  const BOM = "\uFEFF";

  const csvContent = BOM + [
    headers.join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");

  // Create a blob and trigger download
  const blob = new URL(
    `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`
  );

  const link = document.createElement("a");
  link.href  = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
  link.download = `fintrack-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}