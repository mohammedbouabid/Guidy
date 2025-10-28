// utils/tableColumns.js - Shared column definitions

export const createProfileColumn = () => ({
  accessorKey: "name",
  id: "profile",
  header: "Profile",
  sortField: "name",
  cell: ({ row }) => {
    const user = row.original;
    return (
      <div className="flex items-center gap-2">
        <a href={user.profileImage} target="_blank" rel="noopener noreferrer">
          <img
            src={
              user.profileImage ||
              "https://res.cloudinary.com/dqbu98gev/image/upload/v1760193539/profile-icon-vector_lxkuyo.jpg"
            }
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        </a>
        <span className="truncate text-sm sm:text-base max-w-[100px]">
          {user.name}
        </span>
      </div>
    );
  },
});

export const createTextColumn = (accessorKey, header) => ({
  accessorKey,
  header,
  cell: ({ row }) => {
    const value = row.getValue(accessorKey);
    return value ? (
      <input
        readOnly
        value={value}
        className="w-full bg-transparent border-none outline-none text-sm text-gray-800 truncate cursor-text"
        onFocus={(e) => e.target.select()}
      />
    ) : (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700 whitespace-nowrap">
        Not defined
      </span>
    );
  },
});

export const createDateColumn = (accessorKey = "createdAt", header = "Joined On") => ({
  accessorKey,
  header,
  cell: ({ row }) => {
    const date = new Date(row.original[accessorKey]);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  },
});

export const createBadgeColumn = (accessorKey, header, getBadgeConfig) => ({
  accessorKey,
  header,
  enableSorting: false,
  cell: ({ row }) => {
    const value = row.getValue(accessorKey);
    const config = getBadgeConfig(value);
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${config.className}`}>
        {config.label}
      </span>
    );
  },
});

export const createImageColumn = (accessorKey, header) => ({
  accessorKey,
  header,
  enableSorting: false,
  cell: ({ row }) => {
    const url = row.getValue(accessorKey);
    return url ? (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img
          src={url}
          alt={header}
          className="w-16 h-16 object-cover rounded-md hover:scale-105 transition-transform"
        />
      </a>
    ) : (
      <span className="text-gray-400 text-sm">No image</span>
    );
  },
});

export const createLinkColumn = (accessorKey, header, linkBuilder) => ({
  accessorKey,
  header,
  cell: ({ row }) => {
    const value = row.getValue(accessorKey);
    const link = linkBuilder ? linkBuilder(row.original) : value;
    return value ? (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline truncate block max-w-[200px]"
      >
        {value}
      </a>
    ) : (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700 whitespace-nowrap">
        Not defined
      </span>
    );
  },
});

export const createNumberColumn = (accessorKey, header, formatter) => ({
  accessorKey,
  header,
  cell: ({ row }) => {
    const value = row.getValue(accessorKey);
    return formatter ? formatter(value) : value?.toLocaleString() || "0";
  },
});