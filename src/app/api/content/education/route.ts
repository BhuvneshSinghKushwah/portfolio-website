import { createListCreateHandlers } from "@/lib/content-crud";
import { educationSchema } from "@/lib/validators";

export const { GET, POST } = createListCreateHandlers("education", educationSchema);
