import { createListCreateHandlers } from "@/lib/content-crud";
import { experienceSchema } from "@/lib/validators";

export const { GET, POST } = createListCreateHandlers("experiences", experienceSchema);
