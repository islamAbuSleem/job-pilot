import { z } from "zod";

export const workExperienceRoleSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1).max(200),
  job_title: z.string().min(1).max(200),
  start_date: z.string().min(1),
  end_date: z.string().optional().nullable(),
  current: z.boolean().optional().default(false),
  key_responsibilities: z.string().max(2000).optional().default(""),
});

export const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required").max(200),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required").max(50),
  location: z.string().min(1, "Location is required").max(200),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  portfolio_url: z.string().url().optional().or(z.literal("")),
  work_authorization: z.enum(["citizen", "permanent_resident", "visa_required"]).optional().or(z.literal("")),
  current_title: z.string().min(1, "Current title is required").max(200),
  experience_level: z.enum(["junior", "mid", "senior", "lead"], { message: "Experience level is required" }),
  years_experience: z.coerce.number().int().min(0).max(60),
  skills: z.array(z.string().min(1).max(100)).min(1, "At least one skill is required").max(50),
  industries: z.array(z.string().max(100)).max(20).default([]),
  work_experience: z.array(workExperienceRoleSchema).min(1, "At least one work experience is required").max(3),
  highest_degree: z.string().min(1, "Highest degree is required"),
  field_of_study: z.string().min(1, "Field of study is required").max(200),
  institution_name: z.string().max(200).optional().default(""),
  graduation_year: z.string().optional().default(""),
  job_titles_seeking: z.array(z.string().min(1).max(100)).min(1, "At least one job title is required").max(20),
  remote_preference: z.enum(["remote", "onsite", "hybrid", "any"]).optional().or(z.literal("")),
  salary_expectation: z.string().max(100).optional().default(""),
  preferred_locations: z.array(z.string().max(100)).max(20).default([]),
  cover_letter_tone: z.enum(["formal", "casual", "enthusiastic"]).optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type WorkExperienceRoleInput = z.infer<typeof workExperienceRoleSchema>;
