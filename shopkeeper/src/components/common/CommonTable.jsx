import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const CommonTable = ({
  columns = [], // [{ header: "Name", accessor: "name", render: (row) => ... }]
  data = [],
  loading = false,
  showActions = true,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-green-200">
      <table className="min-w-full text-sm text-center text-green-900">
        <thead className="bg-green-200 text-green-800 uppercase text-sm font-semibold">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-4 py-3 border border-green-300">
                {col.header}
              </th>
            ))}
            {showActions && (
              <th className="px-4 py-3 border border-green-300">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (showActions ? 1 : 0)}
                className="px-4 py-4 text-center text-green-700"
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (showActions ? 1 : 0)}
                className="px-4 py-4 text-center text-green-500"
              >
                No data found.
              </td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr
                key={item._id || i}
                className={`${
                  i % 2 === 0 ? "bg-green-100" : "bg-green-50"
                } hover:bg-green-200 transition`}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 border border-green-200"
                  >
                    {col.render ? col.render(item, i) : item[col.accessor]}
                  </td>
                ))}

                {showActions && (
                  <td className="px-4 py-2 border border-green-200 flex justify-center gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(item)}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md transition flex items-center justify-center"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black p-2 rounded-md transition flex items-center justify-center"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition flex items-center justify-center"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CommonTable;
