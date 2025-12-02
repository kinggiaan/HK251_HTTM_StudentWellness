import { useEffect, useState } from "react";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { apiClient } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

type RoleKey = "consultant" | "teacher_supervisor" | "data_scientist";

const FEATURES = [
  "users.manage",
  "students.viewAll",
  "students.create",
  "students.update",
  "students.delete",
  "students.export",
  "students.import",
  "records.viewAll",
  "records.create",
  "records.update",
  "records.delete",
  "sessions.manageOwn",
  "analytics.viewAll",
  "mlModels.manage",
  "datasets.manage"
] as const;

type FeatureKey = typeof FEATURES[number];

type PermissionMatrix = Record<RoleKey, Record<FeatureKey, boolean>>;

const DEFAULT_MATRIX: PermissionMatrix = {
  consultant: {
    "users.manage": false,
    "students.viewAll": false,
    "students.create": true,
    "students.update": true,
    "students.delete": true,
    "students.export": true,
    "records.viewAll": false,
    "records.create": true,
    "records.update": true,
    "records.delete": true,
    "sessions.manageOwn": true,
    "analytics.viewAll": false,
    "mlModels.manage": false,
    "datasets.manage": false
  },
  teacher_supervisor: {
    "users.manage": false,
    "students.viewAll": true,
    "students.create": false,
    "students.update": false,
    "students.delete": false,
    "students.export": false,
    "records.viewAll": true,
    "records.create": false,
    "records.update": false,
    "records.delete": false,
    "sessions.manageOwn": false,
    "analytics.viewAll": true,
    "mlModels.manage": false,
    "datasets.manage": false
  },
  data_scientist: {
    "users.manage": false,
    "students.viewAll": true,
    "students.create": false,
    "students.update": false,
    "students.delete": false,
    "students.export": true,
    "records.viewAll": false,
    "records.create": false,
    "records.update": false,
    "records.delete": false,
    "sessions.manageOwn": false,
    "analytics.viewAll": true,
    "mlModels.manage": true,
    "datasets.manage": true
  }
};

export function AdminConsole() {
  const [matrix, setMatrix] = useState<PermissionMatrix>(DEFAULT_MATRIX);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();

  function toggle(role: RoleKey, feature: FeatureKey) {
    setMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [feature]: !prev[role][feature]
      }
    }));
  }

  async function save() {
    try {
      setIsSaving(true);
      await apiClient.post("/admin/permissions", { permissions: matrix });
      toast.success("Saved permission matrix");
      await load();
    } catch (err: any) {
      toast.error("Failed to save" + (err?.message ? `: ${err.message}` : ""));
    } finally {
      setIsSaving(false);
    }
  }

  async function load() {
    try {
      setIsLoading(true);
      const data = await apiClient.get<{ permissions?: any }>("/admin/permissions");
      const permissions = (data as any)?.permissions ?? data;
      if (permissions) setMatrix((prev) => ({ ...prev, ...permissions }));
    } catch (err: any) {
      toast.error("Failed to load permissions" + (err?.message ? `: ${err.message}` : ""));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white ml-[275.351px]">
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
        <div className="h-[56px] px-8 flex items-center justify-between">
          <h1 className="text-[#0c1e33] font-semibold">Admin Console — Roles & Permissions</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={save}
              disabled={isSaving}
              className="px-3 py-2 rounded bg-[#0c1e33] text-white text-sm disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={logout}
              className="px-3 py-2 rounded border border-[#0c1e33] text-[#0c1e33] text-sm hover:bg-[#0c1e33]/5"
              title="Logout admin"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {isLoading && (
          <div className="mb-4 text-sm text-[#495d72]">Loading permissions...</div>
        )}
        <div className="mb-4 p-4 bg-[#fff7e6] border border-[#ffe58f] rounded">
          <p className="text-sm text-[#ad6800]">
            Admin is developer-only and not visible to end users. Use this console to configure permissions for
            non-admin roles. Changes should be aligned with docs/ROLES.md.
          </p>
        </div>

        <div className="overflow-x-auto border rounded">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#f9fafb] border-b">
              <tr>
                <th className="text-left p-3 text-sm text-[#495d72]">Feature</th>
                <th className="text-center p-3 text-sm text-[#495d72]">Consultant</th>
                <th className="text-center p-3 text-sm text-[#495d72]">Teacher</th>
                <th className="text-center p-3 text-sm text-[#495d72]">Data Scientist</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f) => (
                <tr key={f} className="border-b">
                  <td className="p-3 text-sm text-[#0c1e33]">{f}</td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={matrix.consultant[f]}
                      onChange={() => toggle("consultant", f)}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={matrix.teacher_supervisor[f]}
                      onChange={() => toggle("teacher_supervisor", f)}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={matrix.data_scientist[f]}
                      onChange={() => toggle("data_scientist", f)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Toaster />
    </div>
  );
}


