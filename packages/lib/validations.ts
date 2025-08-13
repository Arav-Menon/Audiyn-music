import z from "zod";

/**
 * Rules used:
 * - username: 3-30 chars, letters/numbers/._- allowed, can't start/end with punctuation, trimmed
 * - email: valid email, normalized to lowercase
 * - country: ISO 3166-1 alpha-2 (e.g. "IN", "US") OR full country name (letters + spaces) — choose one by commenting.
 * - password: 8-128 chars, must include upper, lower, number and special char
 */

// export const authSchema = z.object({
//   username: z
//     .string()
//     .trim()
//     .min(3, { message: "Username must be at least 3 characters" })
//     .max(30, { message: "Username must be at most 30 characters" })
//     .regex(
//       // allow letters, numbers, ., _, - ; don't start or end with ._-
//       /^(?![._-])(?!.*[._-]$)[A-Za-z0-9._-]+$/,
//       {
//         message:
//           "Username can contain letters, numbers, ., _, - and cannot start/end with . _ -",
//       }
//     ),

//   email: z
//     .string()
//     .trim()
//     .toLowerCase()
//     .email({ message: "Invalid email address" }),

//   // Option A: require ISO 3166-1 alpha-2 country code (recommended)
//   country: z
//     .string()
//     .trim()
//     .length(2, {
//       message: "Country must be an ISO 3166-1 alpha-2 code (e.g. 'US', 'IN')",
//     })
//     .regex(/^[A-Z]{2}$/, {
//       message: "Country must be 2 uppercase letters (ISO alpha-2)",
//     }),

//   /*
//   // Option B: allow full country name (uncomment if you prefer names)
//   country: z
//     .string()
//     .trim()
//     .min(2)
//     .max(60)
//     .regex(/^[A-Za-z ]+$/, { message: "Country must only contain letters and spaces" }),
//   */

//   password: z
//     .string()
//     .min(8, { message: "Password must be at least 8 characters" })
//     .max(128, { message: "Password is too long" })
//     .refine((val) => /[a-z]/.test(val), {
//       message: "Password must contain a lowercase letter",
//     })
//     .refine((val) => /[A-Z]/.test(val), {
//       message: "Password must contain an uppercase letter",
//     })
//     .refine((val) => /[0-9]/.test(val), {
//       message: "Password must contain a number",
//     })
//     .refine((val) => /[^A-Za-z0-9]/.test(val), {
//       message: "Password must contain a special character",
//     }),
// });

// export type AuthInput = z.infer<typeof authSchema>;

export const authSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});
