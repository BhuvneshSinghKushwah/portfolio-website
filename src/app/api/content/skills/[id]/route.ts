import { createItemHandlers } from "@/lib/content-crud";
import { skillSchema } from "@/lib/validators";

export const { GET, PATCH, DELETE } = createItemHandlers("skills", skillSchema);
