export interface IPasswordEncoder {
    encode: (password: string) => Promise<string>
    check: (password: string, hashed: string) => Promise<Boolean>
}