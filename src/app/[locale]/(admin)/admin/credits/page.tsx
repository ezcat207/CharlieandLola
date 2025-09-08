import { TableColumn } from "@/types/blocks/table";
import TableSlot from "@/components/dashboard/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import { getCredits } from "@/models/credit";
import moment from "moment";

export default async function () {
  const credits = await getCredits(1, 50);

  const columns: TableColumn[] = [
    { name: "trans_no", title: "Transaction No" },
    { name: "user_uuid", title: "User UUID" },
    { name: "trans_type", title: "Type" },
    { 
      name: "credits", 
      title: "Credits",
      callback: (row) => (
        <span className={row.credits > 0 ? "text-green-600" : "text-red-600"}>
          {row.credits > 0 ? "+" : ""}{row.credits}
        </span>
      )
    },
    { name: "order_no", title: "Order No" },
    {
      name: "created_at",
      title: "Created At",
      callback: (row) => moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      name: "expired_at",
      title: "Expired At",
      callback: (row) => row.expired_at ? moment(row.expired_at).format("YYYY-MM-DD HH:mm:ss") : "N/A",
    },
  ];

  const table: TableSlotType = {
    title: "All Credits",
    columns,
    data: credits || [],
  };

  return <TableSlot {...table} />;
}