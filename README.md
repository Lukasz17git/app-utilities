# App Utilities

Strictly typed utilities for building apps. No `any` in the public types, no runtime dependencies.

```bash
npm install @lukasz17/app-utilities
```

## Obj

Static helpers for objects. The returned types follow what JavaScript really returns.

```ts
import { Obj } from '@lukasz17/app-utilities'

const user = { id: 1, name: 'Ana', role: 'admin' }

Obj.keys(user) // ('id' | 'name' | 'role')[]
Obj.entries(user) // (['id', number] | ['name', string] | ['role', string])[]
Obj.pick(user, ['id', 'name']) // { id: number; name: string }
Obj.omit(user, ['role']) // { id: number; name: string }
Obj.mapValues(user, String) // { id: string; name: string; role: string }
Obj.record(['a', 'b'], 0) // Record<'a' | 'b', number>
Obj.createRecord(['a', 'b'], (key) => key.toUpperCase()) // Record<'a' | 'b', string>
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
2. When pushed to `master`, CI opens a "Version Packages" PR.
3. Merging that PR publishes to npm with [trusted publishing](https://docs.npmjs.com/trusted-publishers) (no npm token needed).
