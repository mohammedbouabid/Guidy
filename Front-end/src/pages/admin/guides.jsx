"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";

const data = [
  {
    id: "1",
    avatar:
      "https://res.cloudinary.com/dqbu98gev/image/upload/v1760193539/profile-icon-vector_lxkuyo.jpg",
    name: "Alice",
    email: "alice@example.com",
    phone: "+212 xxxx-xxxxx",
    cin: "CNXXXXXX",
  },
  {
    id: "2",
    avatar:
      "https://res.cloudinary.com/dqbu98gev/image/upload/v1760193539/profile-icon-vector_lxkuyo.jpg",
    name: "Bob",
    email: "bob@example.com",
    phone: "+212 xxxx-xxxxx",
    cin: "CNXXXXXX",
  },
  {
    id: "3",
    avatar:
      "https://res.cloudinary.com/dqbu98gev/image/upload/v1760193539/profile-icon-vector_lxkuyo.jpg",
    name: "Carol",
    email: "carol@example.com",
    phone: "+212 xxxx-xxxxx",
    cin: "CNXXXXXX",
  },
];

export default function AllGuides() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Guides</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
