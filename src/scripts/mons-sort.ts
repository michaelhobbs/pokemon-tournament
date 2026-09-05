type SortKey =
  | "name"
  | "trainer"
  | "HP"
  | "Attack"
  | "Defense"
  | "Sp. Atk"
  | "Sp. Def"
  | "Speed";

interface SortClickEvent extends MouseEvent {
  monsSortHandled?: boolean;
}

/** Sortable stat tables (`table[data-mons-sortable]`). Registers one delegated document listener. */
export function initMonsSort(): void {
  document.addEventListener("click", (event) => {
    const sortEvent = event as SortClickEvent;
    if (sortEvent.monsSortHandled) return;

    const header = (event.target as HTMLElement | null)?.closest?.(
      "th[data-sort-key]",
    ) as HTMLTableCellElement | null;
    if (!header) return;

    const table = header.closest<HTMLTableElement>("table[data-mons-sortable]");
    if (!table) return;

    sortEvent.monsSortHandled = true;

    const sortKey = header.dataset.sortKey as SortKey;
    const direction =
      table.dataset.sortKey === sortKey && table.dataset.sortDirection === "asc"
        ? "desc"
        : "asc";
    table.dataset.sortKey = sortKey;
    table.dataset.sortDirection = direction;

    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);
    const dir = direction === "asc" ? 1 : -1;

    rows.sort((a, b) => {
      if (sortKey === "name" || sortKey === "trainer") {
        const textA = a.cells[header.cellIndex]?.textContent ?? "";
        const textB = b.cells[header.cellIndex]?.textContent ?? "";
        return textA.localeCompare(textB) * dir;
      }
      const valueA = Number(a.cells[header.cellIndex]?.dataset.value ?? 0);
      const valueB = Number(b.cells[header.cellIndex]?.dataset.value ?? 0);
      return (valueA - valueB) * dir;
    });

    for (const row of rows) tbody.appendChild(row);

    table
      .querySelectorAll<HTMLTableCellElement>("th[data-sort-key]")
      .forEach((th) => {
        if (th.dataset.sortKey === sortKey) {
          th.dataset.direction = direction;
          th.setAttribute(
            "aria-sort",
            direction === "asc" ? "ascending" : "descending",
          );
        } else {
          delete th.dataset.direction;
          th.removeAttribute("aria-sort");
        }
      });
  });
}
