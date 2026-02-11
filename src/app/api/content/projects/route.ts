import { createListCreateHandlers } from "@/lib/content-crud";
import { projectSchema } from "@/lib/validators";

export const { GET, POST } = createListCreateHandlers("projects", projectSchema);
