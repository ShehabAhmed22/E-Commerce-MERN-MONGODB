import { z } from "zod";

export const orderUpdateSchema = z.object({
  status: z.enum(["pending", "paid", "shipped", "delivered"], {
    required_error: "Status is required",
    invalid_type_error: "Invalid status value",
  }),
});
