import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

export const columns = [
  {
    accessorKey: "profile",
    header: "Profile",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <a href={user.avatar} target="_blank">
            <img
              src={
                user.avatar ||
                "https://res.cloudinary.com/dqbu98gev/image/upload/v1760193539/profile-icon-vector_lxkuyo.jpg"
              } // URL to avatar
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </a>
          <span>{user.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "cin",
    header: "CIN",
  }
];
