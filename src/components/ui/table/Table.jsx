const Table = ({
  title,
  data = [],
  columns = [],
  actions = [],
  onAdd,
  loading = false,
  emptyMessage = "No hay datos para mostrar",
}) => {


  const getNestedValue = (obj, key) => {
    return key.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pt-2 pb-2">
          {title}
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap ${col.headerClassName || ''}`}
                >
                  {col.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase whitespace-nowrap w-32">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    Cargando...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-6 py-4 ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(item) : (
                        <div className={`text-sm text-gray-600 dark:text-gray-400 ${col.truncate ? 'max-w-xs truncate' : ''}`}>

                          {getNestedValue(item, col.key) ?? (
                            <i className='text-gray-400'>N/A</i>
                          )}

                        </div>
                      )}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 w-32">
                      <div className="flex items-center justify-center gap-1">
                        {actions.map((action) => (
                          <button
                            key={action.key}
                            onClick={() => action.onClick(item)}
                            className={`p-2 rounded-lg transition-colors ${action.className || 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'}`}
                            title={action.label}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
