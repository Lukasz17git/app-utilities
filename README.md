# App Utilities

Strictly typed utilities for building apps. No `any` in the public types, no runtime dependencies.

```bash
npm install @lukasz17/app-utilities
```

## Obj

Helpers for objects. The returned types follow what JavaScript really returns.

```ts
import { Obj } from '@lukasz17/app-utilities'

const user = { id: 1, name: 'Ana', role: 'admin' }

Obj.keys(user) // ('id' | 'name' | 'role')[]
Obj.entries(user) // (['id', number] | ['name', string] | ['role', string])[]
Obj.pick(user, ['id', 'name']) // { id: number; name: string }
Obj.omit(user, ['role']) // { id: number; name: string }
Obj.mapValues(user, String) // { id: string; name: string; role: string }
Obj.record(['a', 'b'], 0) // Record<'a' | 'b', number>
Obj.createRecord(['a', 'b'], key => key.toUpperCase()) // Record<'a' | 'b', string>
Obj.flip({ draft: 'D', done: 'X' }) // { D: 'draft'; X: 'done' }
Obj.hasKey(user, someString) // narrows someString to 'id' | 'name' | 'role'
Obj.isEmpty({}) // true
```

| Method                         | Returns                                                               |
| ------------------------------ | --------------------------------------------------------------------- |
| `keys(obj)`                    | Keys as strings (`{ 1: 'a' }` -> `['1']`), symbols skipped            |
| `keys(obj, 'non-empty-tuple')` | `[key, ...keys]`; throws on `{}`                                      |
| `values(obj)`                  | Values of the string and number keys                                  |
| `entries(obj)`                 | `[key, value]` pairs, each value typed by its own key                 |
| `pick(obj, keys)`              | New object with only `keys`; keys missing in `obj` stay missing       |
| `omit(obj, keys)`              | Copy of `obj` without `keys`                                          |
| `mapValues(obj, fn)`           | Same keys, each value -> `fn(value, key)`                             |
| `record(keys, value)`          | Every key set to `value`                                              |
| `createRecord(keys, fn)`       | Every key set to `fn(key)`                                            |
| `flip(obj)`                    | Keys and values swapped; on repeated values the last key wins         |
| `hasKey(obj, key)`             | `true` for own keys only (`'toString'` -> `false`), and narrows `key` |
| `isEmpty(obj)`                 | `true` when `obj` has no keys                                         |

TypeScript object types don't stop extra keys at runtime (`const a: { id: number } = userWithMoreKeys`), so `keys`, `values` and `entries` can return more than their type says, same as `Object.keys`.

## Types

The types `Obj` returns, to use in your own helpers.

```ts
import type { TEntry, TPrettify, TStringKey, TValue } from '@lukasz17/app-utilities'

type TUser = { id: number; name: string; 1: boolean }

type TUserKey = TStringKey<TUser> // 'id' | 'name' | '1'
type TUserValue = TValue<TUser> // number | string | boolean
type TUserEntry = TEntry<TUser> // ['id', number] | ['name', string] | ['1', boolean]
type TAdmin = TPrettify<Pick<TUser, 'id'> & { role: 'admin' }> // { id: number; role: 'admin' }
```

| Type            | Is                                                                                     |
| --------------- | -------------------------------------------------------------------------------------- |
| `TStringKey<T>` | Keys as `Object.keys` returns them: numbers as strings (`1` -> `'1'`), symbols skipped |
| `TValue<T>`     | Values as `Object.values` returns them (values of symbol keys skipped)                 |
| `TEntry<T>`     | `[key, value]` pairs, each value typed by its own key                                  |
| `TPrettify<T>`  | Same type, shown on hover as one object instead of `Pick<...> & {...}`                 |

## Development

| Script           | Does                                                                    |
| ---------------- | ----------------------------------------------------------------------- |
| `npm run dev`    | Runs the tests in watch mode                                            |
| `npm test`       | Runs the tests once (`expectTypeOf` checks run in `npm run lint`)       |
| `npm run lint`   | Type-checks everything, tests included                                  |
| `npm run build`  | Builds ESM + CJS to `dist` and checks the package with publint and attw |
| `npm run format` | Formats with Prettier                                                   |
| `npx changeset`  | Adds a changeset for the next release                                   |

### Releasing

1. Run `npx changeset`, pick the bump type and describe the change, and commit the generated file.
2. When pushed to `master`, CI opens a "Version Packages" PR and runs the checks on it.
3. Merging that PR publishes to npm with [trusted publishing](https://docs.npmjs.com/trusted-publishers) (no npm token needed).
