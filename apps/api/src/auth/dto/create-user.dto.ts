import z from 'zod';

export const userDtoSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(),
    password: z.string()
})


export type UserDto = z.infer<typeof userDtoSchema>;

