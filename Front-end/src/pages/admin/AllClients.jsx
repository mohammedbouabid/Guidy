import UserManagement from "@/components/UserManagement";
import { createProfileColumn, createTextColumn, createDateColumn } from "@/utils/tableColumns";

export default function AllClients() {
  const clientsColumns = [
    createProfileColumn(),
    createTextColumn("email", "Email"),
    createTextColumn("phone", "Phone"),
    createDateColumn("createdAt", "Joined On"),
  ];

  return <UserManagement role="client" title="Clients" columnConfig={clientsColumns} />;
}
