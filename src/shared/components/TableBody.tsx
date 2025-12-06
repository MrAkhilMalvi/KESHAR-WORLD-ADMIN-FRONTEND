type TableBodyProps = {
  arr: any;
  tableKey: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };
  handleSort: (sortKey: string, sortOrder: string) => void;
  sortKey: string;
  sortOrder: string;
  filters: Record<string, any>;
  onFilterChange: (key: string, value: string) => void;
  showFilters: boolean;
  tableHeaders: any;
};

export const TableBody = ({
  arr,
  tableKey,
  pagination,
  handleSort,
  sortKey,
  sortOrder,
  filters,
  onFilterChange,
  showFilters,
  tableHeaders,
}: TableBodyProps) => {
  const triggerSort = (sortBy: string) => {
    const newOrder = sortKey === sortBy && sortOrder === "ASC" ? "DESC" : "ASC";
    handleSort(sortBy, newOrder);
  };

  return (
    <table className="min-w-full border-collapse">
      <thead className="sticky top-0 z-10 bg-white dark:bg-gray-900">
        <tr>
          {pagination && (
            <th
              className={`sticky top-0 bg-white dark:bg-gray-900 z-10 text-center px-4 py-2 whitespace-nowrap`}
            >
              Sr No.
            </th>
          )}
          {tableHeaders[tableKey].header.map((item, index) => {
            return (
              <th
                key={item.title}
                className={`sticky top-0 bg-white dark:bg-gray-900 z-10 text-left px-4 py-2 whitespace-nowrap min-w-[120px] ${item.customStyles}`}
              >
                {item.isSortable ? (
                  <button
                    onClick={() =>
                      triggerSort(tableHeaders[tableKey].body[index].key)
                    }
                  >
                    {item.title}
                    {tableHeaders[tableKey].body[index].key === sortKey
                      ? sortOrder === "ASC"
                        ? " ⇡"
                        : " ⇣"
                      : " ⇣"}
                  </button>
                ) : (
                  <span>{item.title}</span>
                )}
              </th>
            );
          })}
        </tr>
        {tableHeaders[tableKey].withFilters && showFilters && (
          <tr>
            {/* Empty cell for Sr No. column */}
            {pagination && <td></td>}

            {tableHeaders[tableKey].body.map((item) => {
              return (
                <td key={item.key} className="px-3 py-2">
                  {item.isSearchable && (
                    <input
                      maxLength={30}
                      type="text"
                      name={item.key}
                      className="max-w-[150px] px-2 py-1 text-sm 
                                border border-gray-400 dark:border-gray-600 
                                rounded 
                                bg-white dark:bg-gray-800 
                                text-gray-900 dark:text-gray-100 
                                placeholder-gray-400 dark:placeholder-gray-500
                                focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Search"
                      value={filters[item.filterKey || item.key] || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (item.regex && val && !item.regex.test(val)) {
                          return;
                        }
                         if (
                          val.trim()?.length > 0 ||
                          filters[item.filterKey || item.key]
                        ) {
                          onFilterChange(item.filterKey || item.key, val);
                        }
                      }}
                    />
                  )}
                </td>
              );
            })}
          </tr>
        )}
      </thead>

      <tbody>
        {arr && arr.length > 0 ? (
          arr.map((value, arrInd) => {
            const srNo =
              (pagination?.currentPage - 1) * pagination?.pageSize + arrInd + 1;
            return (
              <tr
                className="even:bg-gray-50 dark:even:bg-gray-900"
                key={arrInd}
              >
                {/* Sr No column */}
                {pagination && (
                  <td className="px-4 py-2 text-sm text-center font-medium">
                    {srNo}
                  </td>
                )}

                {tableHeaders[tableKey].body.map((item) => {
                  return item.isStatus ? (
                    <td
                      key={item.key}
                      className={`px-4 py-2 text-sm ${item.customStyles}`}
                    >
                      {value[item.key] ? "Yes" : "No"}
                    </td>
                  ) : (
                    <td
                      key={item.key}
                      className={`px-4 py-2 text-sm ${item.customStyles}`}
                    >
                      {value[item.key] === "" || value[item.key] == null
                        ? "-"
                        : value[item.key]}
                    </td>
                  );
                })}
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan={tableHeaders[tableKey].header.length + 1} // +1 because of Sr No column
              className="text-center text-gray-500 py-4"
            >
              {tableHeaders[tableKey].noDataText}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
