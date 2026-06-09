import { Pencil } from "lucide-react";

export function DataTable({ columns, rows, emptyText = "No records", onEdit }) {
  if (!rows.length) {
    return <div className="empty-state">{emptyText}</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {onEdit && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
              ))}
              {onEdit && (
                <td>
                  <button className="icon-button" type="button" onClick={() => onEdit(row)}>
                    <Pencil size={14} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
