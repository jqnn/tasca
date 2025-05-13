import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { sha256 } from "js-sha256";
import { toast } from "sonner";
import type {
  FieldType,
  InstanceStatus,
  ProjectTask,
  Role,
  TeamRole,
} from "@prisma/client";
import type { TranslationFunction } from "~/types/translation-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashPassword(password: string) {
  return sha256(password);
}

export function escapeLDAPSearchFilter(value: string): string {
  return value
    .replace(/\\/g, "\\5c")
    .replace(/\*/g, "\\2a")
    .replace(/\(/g, "\\28")
    .replace(/\)/g, "\\29")
    .replace(/\0/g, "\\00");
}

export function showToast(title: string, description: string | null = null) {
  toast(title, {
    description: description ?? null,
    duration: 2500,
  });
}

export function showErrorToast(t: TranslationFunction, message?: string) {
  showToast(
    t("errors.unexpected.title"),
    message ? t("errors.unexpected.message") : t("errors.unexpected.message"),
  );
}

export function beautifyInstanceStatus(
  t: TranslationFunction,
  status: InstanceStatus,
) {
  return t(`common.statuses.${status.trim().toLowerCase()}`);
}

export function beautifyRole(t: TranslationFunction, role: Role) {
  return t(`common.roles.${role.trim().toLowerCase()}`);
}

export function beautifyTeamRole(t: TranslationFunction, role: TeamRole) {
  return t(`common.roles.${role.trim().toLowerCase()}`);
}

export function isProjectDone(projectTasks: ProjectTask[]) {
  return !projectTasks.find((task) => task.status == "OPEN");
}

export function isTaskDone(
  instance: {
    InstanceField: ({
      field: {
        fieldType: FieldType;
        id: number;
        label: string;
        order: number;
        placeHolder: string | null;
        templateId: number;
      };
    } & {
      fieldId: number;
      id: number;
      instanceId: number;
      updatedAt: Date;
      value: string;
    })[];
    InstanceTask: ({
      task: {
        description: string;
        id: number;
        order: number;
        task: string;
        templateId: number;
      };
    } & {
      id: number;
      instanceId: number;
      status: InstanceStatus;
      taskId: number;
      updatedAt: Date;
    })[];
    template: {
      createdAt: Date;
      createdById: number | null;
      description: string | null;
      id: number;
      name: string;
    };
  } & {
    createdAt: Date;
    createdById: number | null;
    id: number;
    status: InstanceStatus;
    templateId: number;
  },
) {
  if (instance.InstanceTask.find((task) => task.status == "OPEN")) return false;
  return !instance.InstanceField.find((field) => field.value == "");
}
