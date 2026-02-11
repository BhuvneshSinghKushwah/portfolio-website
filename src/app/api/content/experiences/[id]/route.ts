import { createItemHandlers } from "@/lib/content-crud";
import { experienceSchema } from "@/lib/validators";

export const { GET, PATCH, DELETE } = createItemHandlers("experiences", experienceSchema);
