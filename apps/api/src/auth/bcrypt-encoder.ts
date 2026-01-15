import type { IPasswordEncoder } from "./password-encoder.interface.js";
import bcrypt from 'bcryptjs';

class BcryptEncoder implements IPasswordEncoder {
    encode(password: string) {
        return bcrypt.hash(password, 10);
    }

    check(password: string, hashed: string) {
        return bcrypt.compare(password, hashed);
    }
}

export default BcryptEncoder;