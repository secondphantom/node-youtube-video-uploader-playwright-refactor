declare global {
    interface ObjectConstructor {
        keys<T>(o: T): (keyof T)[];
    }
}
export {};
