
import { z } from 'zod';

export const ParsedDzialkaSchema = z.object({
    nr_dzialki: z.string(),
    pow_dzialki_ha: z.number().or(z.string().transform((val) => Number(val))),
    uprawa: z.string(),
    kod_uprawy: z.string(),
    platnosci: z.array(z.string())
});

export const ParsedPodmiotSchema = z.object({
    ep: z.string(),
    nazwa: z.string(),
    adres: z.string()
});

export const ParsedWniosekSchema = z.object({
    kampania_rok: z.number().optional(),
    podmiot: ParsedPodmiotSchema,
    dzialki: z.array(ParsedDzialkaSchema),
    ekoschematy_ogolne: z.array(z.string()),
    podsumowanie: z.object({
        liczba_dzialek: z.number(),
        calkowita_powierzchnia_ha: z.number()
    })
});

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['application/pdf'];

// Custom validator for File objects (works in environment where File is global)
export const UploadFileSchema = z.object({
    file: z.custom<File>((val) => val instanceof File, "Input must be a File")
        .refine(file => file.size <= MAX_FILE_SIZE, `File size should be less than 10MB.`)
        .refine(file => ALLOWED_FILE_TYPES.includes(file.type), "Only PDF files are allowed.")
});
