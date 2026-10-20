/** Shows the final object shape on hover instead of `Pick<...> & {...}` */
export type TPrettify<T> = { [Key in keyof T]: T[Key] } & {}

/** Keys as `Object.keys` returns them: numbers as strings (`1` -> `'1'`), symbols skipped */
export type TStringKey<T> = `${Extract<keyof T, string | number>}`

/** Values as `Object.values` returns them (symbol keys skipped) */
export type TValue<T> = T[Extract<keyof T, string | number>]

/** `[key, value]` pairs where each value keeps its own key's type (`['a', number] | ['b', string]`) */
export type TEntry<T> = Exclude<
   { [Key in keyof T]: [`${Extract<Key, string | number>}`, T[Key]] }[Extract<keyof T, string | number>],
   undefined
>
