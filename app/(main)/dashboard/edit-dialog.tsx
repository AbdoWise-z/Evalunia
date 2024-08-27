import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  address: z.string().optional(),
  phone: z.string().optional(),
  tags: z.string().optional(),
  school: z.string().optional(),
  birthDate: z.string().optional(),
  qualifications: z.string().optional(),
  summary: z.string().min(1, { message: "Summary is required" }),
});

//TODO: nvm .. I'm too lazy to implement this
//      if anyone wants to do, you just create
//      something like the add page