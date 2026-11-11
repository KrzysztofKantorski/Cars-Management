import type { User } from "./Auth";

export interface AuthStore {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}