import { createListCreateHandlers } from "@/lib/content-crud";
import { skillSchema } from "@/lib/validators";

export const { GET, POST } = createListCreateHandlers("skills", skillSchema);
