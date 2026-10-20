/** Shows the final object shape on hover instead of `Pick<...> & {...}` */
export type TPrettify<T> = { [K in keyof T]: T[K] } & {}

/** Keys as `Object.keys` returns them: numbers as strings (`1` -> `'1'`), symbols skipped */
export type TStringKey<T> = `${Extract<keyof T, string | number>}`

/** Values as `Object.values` returns them (symbol keys skipped) */
export type TValue<T> = T[Extract<keyof T, string | number>]

/** `[key, value]` pairs where each value keeps its own key's type (`['a', number] | ['b', string]`) */
export type TEntry<T> = Exclude<
  { [K in keyof T]: [`${Extract<K, string | number>}`, T[K]] }[Extract<keyof T, string | number>],
  undefined
>
