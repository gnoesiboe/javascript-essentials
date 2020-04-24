export type Serializable =
    | null
    | boolean
    | number
    | string
    | Serializable[]
    | { [key: string]: Serializable };
