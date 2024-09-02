import { z } from "zod";

export const businessSchema = z.object({
    imageId: z.string().nullable().optional(),
    imageHash: z.string().nullable().optional(),
    name: z.string().min(1, "Business name is required"),
    bio: z.string().nullable().optional(),
    address_street: z.string().nullable().optional(),
    address_city: z.string().nullable().optional(),
    address_state: z.string().nullable().optional(),
    address_zip: z.string().nullable().optional(),
    address_country: z.string().nullable().optional(),
    contact_email: z.string().email("Invalid email format").nullable().optional(),
    contact_phone: z.string().nullable().optional(),
    // website: z.string().url("Invalid URL format").optional(), // Uncomment if the website field is needed and ensure it is a valid URL
    opening_hours: z.array(
        z.object({
            day: z.enum([
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
            ]),
            open: z.string().optional(),
            close: z.string().optional(),
        })
    ),
});

export const createBusinessSchema = businessSchema
    .omit({
        imageId: true,
    })
    .extend({
        imageWrapper: z.instanceof(FormData).optional(),
    });

export const updateBusinessSchema = businessSchema.partial();
