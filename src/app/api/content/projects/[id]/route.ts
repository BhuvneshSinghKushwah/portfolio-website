import { createItemHandlers } from "@/lib/content-crud";
import { projectSchema } from "@/lib/validators";

export const { GET, PATCH, DELETE } = createItemHandlers("projects", projectSchema);
