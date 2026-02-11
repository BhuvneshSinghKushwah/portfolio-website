import { createItemHandlers } from "@/lib/content-crud";
import { educationSchema } from "@/lib/validators";

export const { GET, PATCH, DELETE } = createItemHandlers("education", educationSchema);
