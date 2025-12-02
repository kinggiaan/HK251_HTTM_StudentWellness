import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiClient } from "../lib/api";

type RoleKey = "consultant" | "teacher_supervisor" | "data_scientist";
type FeatureKey =
  | "users.manage"
  | "students.viewAll"
  | "students.create"
  | "students.update"
  | "students.delete"
  | "students.export"
  | "students.import"
  | "records.viewAll"
  | "records.create"
  | "records.update"
  | "records.delete"
  | "sessions.manageOwn"
  | "analytics.viewAll"
  | "mlModels.manage"
  | "datasets.manage";

type PermissionMatrix = Record<RoleKey, Partial<Record<FeatureKey, boolean>>>;

interface PermissionsContextValue {
  matrix: PermissionMatrix;
  hasPermission: (feature: FeatureKey) => boolean;
  reload: () => Promise<void>;
  isLoading: boolean;
}

const PermissionsContext = createContext<PermissionsContextValue | undefined>(undefined);

const DEFAULT_MATRIX: PermissionMatrix = {
  consultant: { "students.export": true, "students.import": true },
  teacher_supervisor: { "students.export": false, "students.import": false },
  data_scientist: { "students.viewAll": true, "students.export": true, "datasets.manage": true, "mlModels.manage": true, "analytics.viewAll": true }
};

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [matrix, setMatrix] = useState<PermissionMatrix>(DEFAULT_MATRIX);
  const [isLoading, setIsLoading] = useState(true);

  const reload = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get<{ permissions?: PermissionMatrix }>("/admin/permissions");
      const permissions = (data as any)?.permissions ?? data;
      if (permissions) setMatrix((prev) => ({ ...prev, ...permissions }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const hasPermission = useMemo(() => {
    const roleKey = (user?.role ?? "teacher_supervisor") as RoleKey;
    return (feature: FeatureKey) => {
      return Boolean(matrix?.[roleKey]?.[feature]);
    };
  }, [matrix, user?.role]);

  const value: PermissionsContextValue = { matrix, hasPermission, reload, isLoading };
  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
}

export function usePermissions() {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionsProvider");
  return ctx;
}


