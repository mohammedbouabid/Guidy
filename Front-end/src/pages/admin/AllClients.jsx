import UserManagement from "@/components/adminHelpers/UserManagement";
import { createProfileColumn, createTextColumn, createDateColumn } from "@/components/adminHelpers/tableColumns";

export default function AllClients() {
  const clientsColumns = [
    createProfileColumn(),
    createTextColumn("email", "Email"),
    createTextColumn("phone", "Phone"),
    createDateColumn("createdAt", "Joined On"),
  ];

  return <UserManagement role="client" title="Clients" columnConfig={clientsColumns} />;
}
