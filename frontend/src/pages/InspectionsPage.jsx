import { DataTable } from "../components/DataTable.jsx";
import { RecordForm } from "../components/RecordForm.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useAppData } from "../context/AppContext.jsx";
import { inspectionFields } from "../modules/forms.js";

const columns = [
  { key: "project_name", label: "Project" },
  { key: "inspection_type", label: "Type" },
  { key: "scheduled_date", label: "Date" },
  { key: "inspector", label: "Inspector" },
  { key: "result", label: "Result", render: (row) => <StatusBadge value={row.result} /> },
  { key: "issues", label: "Issues" },
];

function validateInspection(payload) {
  if (payload.result === "整改" && !payload.issues.trim()) {
    return "验收不通过时必须填写整改问题";
  }
  return "";
}

export function InspectionsPage() {
  const { inspections, createRecord } = useAppData();

  return (
    <div className="page-stack">
      <RecordForm
        title="Schedule acceptance"
        fields={inspectionFields}
        validate={validateInspection}
        onSubmit={(payload) => createRecord("inspections", payload)}
      />
      <section className="panel">
        <div className="section-heading">
          <h2>Acceptance Management</h2>
          <span>{inspections.filter((item) => item.result !== "passed").length} need attention</span>
        </div>
        <DataTable columns={columns} rows={inspections} />
      </section>
    </div>
  );
}
