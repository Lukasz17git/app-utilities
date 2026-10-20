import type { TEntry, TPrettify, TStringKey, TValue } from '../types/utility-types'

type TFlip<T extends Record<keyof T, string | number>> = TPrettify<{
   -readonly [Key in keyof T as Key extends symbol ? never : T[Key]]: `${Extract<Key, string | number>}`
}>

type TMappedValues<T, TResult> = { [Key in keyof T as Extract<Key, string | number>]: TResult }

function keys<T extends object>(obj: T): TStringKey<T>[]
function keys<T extends object>(obj: T, mode: 'non-empty-tuple'): [TStringKey<T>, ...TStringKey<T>[]]
function keys<T extends object>(obj: T, mode?: 'non-empty-tuple'): TStringKey<T>[] {
   const objKeys = Object.keys(obj) as TStringKey<T>[]
   if (mode === 'non-empty-tuple' && !objKeys.length) throw new Error('Obj.keys: the object has no keys')
   return objKeys
}

const values = <T extends object>(obj: T) => Object.values(obj) as TValue<T>[]

const entries = <T extends object>(obj: T) => Object.entries(obj) as TEntry<T>[]

const pick = <T extends object, TKey extends keyof T>(obj: T, keys: readonly TKey[]) => {
   const existingKeys = keys.filter(key => key in obj)
   return Object.fromEntries(existingKeys.map(key => [key, obj[key]])) as TPrettify<Pick<T, TKey>>
}

const omit = <T extends object, TKey extends keyof T>(obj: T, keys: readonly TKey[]) => {
   const objWithoutKeys: Partial<T> = { ...obj }
   keys.forEach(key => delete objWithoutKeys[key])
   return objWithoutKeys as TPrettify<Omit<T, TKey>>
}

const mapValues = <T extends object, TResult>(obj: T, fn: (value: TValue<T>, key: TStringKey<T>) => TResult) => {
   const mappedEntries = keys(obj).map(key => [key, fn(obj[key as keyof T] as TValue<T>, key)])
   return Object.fromEntries(mappedEntries) as TMappedValues<T, TResult>
}

const record = <TKey extends string | number, TRecordValue>(keys: readonly TKey[], value: TRecordValue) =>
   Object.fromEntries(keys.map(key => [key, value])) as Record<TKey, TRecordValue>

const createRecord = <TKey extends string | number, TRecordValue>(
   keys: readonly TKey[],
   fn: (key: TKey) => TRecordValue,
) => Object.fromEntries(keys.map(key => [key, fn(key)])) as Record<TKey, TRecordValue>

const flip = <const T extends Record<keyof T, string | number>>(obj: T) =>
   Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key])) as TFlip<T>

const hasKey = <T extends object>(obj: T, key: PropertyKey): key is keyof T => Object.hasOwn(obj, key)

const isEmpty = (obj: object) => !Object.keys(obj).length

// JSDoc goes on each property: the built d.ts drops the one on the helper consts
/** Typed object helpers: `Obj.keys(user)`, `Obj.pick(user, ['id'])` */
export const Obj = {
   /** Typed `Object.keys`; with `'non-empty-tuple'` it throws on `{}` and returns `[key, ...keys]` */
   keys,
   values,
   entries,
   /** Copies only `keys`; keys missing in `obj` stay missing */
   pick,
   omit,
   /** Runs `fn` on each value and keeps the keys (`{ a: 1 }` -> `{ a: fn(1, 'a') }`) */
   mapValues,
   /** Gives every key the same value (`(['a', 'b'], 0)` -> `{ a: 0, b: 0 }`) */
   record,
   /** Builds each key's value with `fn` (`(['a'], key => key.toUpperCase())` -> `{ a: 'A' }`) */
   createRecord,
   /** Swaps keys and values (`{ a: 'x' }` -> `{ x: 'a' }`); on repeated values the last key wins */
   flip,
   /** Narrows `key` to a key of `obj`; only own keys count (`'toString'` -> `false`) */
   hasKey,
   isEmpty,
}
