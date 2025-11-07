import UserManagement from "@/components/adminHelpers/UserManagement";
import { createProfileColumn, createTextColumn, createDateColumn } from "@/components/adminHelpers/tableColumns";

export default function AllGuides() {
  const guidesColumns = [
    createProfileColumn(),
    createTextColumn("email", "Email"),
    createTextColumn("phone", "Phone"),
    createTextColumn("cin", "CIN"),
    createDateColumn("createdAt", "Joined On"),
  ];

  return <UserManagement role="guide" title="Guides" columnConfig={guidesColumns} />;
}