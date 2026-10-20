import type { TEntry, TPrettify, TStringKey, TValue } from '../types/utility-types'

type TFlip<T extends Record<keyof T, string | number>> = TPrettify<{
  -readonly [K in keyof T as K extends symbol ? never : T[K]]: `${Extract<K, string | number>}`
}>

/** Typed object helpers, all static: `Obj.keys(user)`, `Obj.pick(user, ['id'])` */
export class Obj {
  /** Typed `Object.keys`; with `'non-empty-tuple'` it throws on `{}` and returns `[key, ...keys]` */
  static keys<T extends object>(obj: T): TStringKey<T>[]
  static keys<T extends object>(obj: T, mode: 'non-empty-tuple'): [TStringKey<T>, ...TStringKey<T>[]]
  static keys<T extends object>(obj: T, mode?: 'non-empty-tuple'): TStringKey<T>[] {
    const keys = Object.keys(obj) as TStringKey<T>[]
    if (mode === 'non-empty-tuple' && keys.length === 0) throw new Error('Obj.keys: the object has no keys')
    return keys
  }

  static values<T extends object>(obj: T): TValue<T>[] {
    return Object.values(obj) as TValue<T>[]
  }

  static entries<T extends object>(obj: T): TEntry<T>[] {
    return Object.entries(obj) as TEntry<T>[]
  }

  /** Copies only `keys`; keys missing in `obj` stay missing */
  static pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): TPrettify<Pick<T, K>> {
    const picked = {} as Pick<T, K>
    for (const key of keys) {
      if (key in obj) picked[key] = obj[key]
    }
    return picked
  }

  static omit<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): TPrettify<Omit<T, K>> {
    const copy: Partial<T> = { ...obj }
    for (const key of keys) delete copy[key]
    return copy as Omit<T, K>
  }

  /** Runs `fn` on each value and keeps the keys (`{ a: 1 }` -> `{ a: fn(1, 'a') }`) */
  static mapValues<T extends object, TResult>(
    obj: T,
    fn: (value: TValue<T>, key: TStringKey<T>) => TResult,
  ): { [K in keyof T as Extract<K, string | number>]: TResult } {
    const mapped: Record<string, TResult> = {}
    for (const key of Obj.keys(obj)) mapped[key] = fn(obj[key as keyof T] as TValue<T>, key)
    return mapped as { [K in keyof T as Extract<K, string | number>]: TResult }
  }

  /** Gives every key the same value (`(['a', 'b'], 0)` -> `{ a: 0, b: 0 }`) */
  static record<K extends string | number, V>(keys: readonly K[], value: V): Record<K, V> {
    return Object.fromEntries(keys.map((key) => [key, value])) as Record<K, V>
  }

  /** Builds each key's value with `fn` (`(['a'], (key) => key.toUpperCase())` -> `{ a: 'A' }`) */
  static createRecord<K extends string | number, V>(keys: readonly K[], fn: (key: K) => V): Record<K, V> {
    return Object.fromEntries(keys.map((key) => [key, fn(key)])) as Record<K, V>
  }

  /** Swaps keys and values (`{ a: 'x' }` -> `{ x: 'a' }`); on repeated values the last key wins */
  static flip<const T extends Record<keyof T, string | number>>(obj: T): TFlip<T> {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key])) as TFlip<T>
  }

  /** Narrows `key` to a key of `obj`; only own keys count (`'toString'` -> `false`) */
  static hasKey<T extends object>(obj: T, key: PropertyKey): key is keyof T {
    return Object.hasOwn(obj, key)
  }

  static isEmpty(obj: object): boolean {
    return Object.keys(obj).length === 0
  }
}
