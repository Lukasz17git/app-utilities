import { describe, expect, expectTypeOf, it } from 'vitest'

import { Obj } from './Obj'

type TUser = { id: number; name: string; email?: string }

const user: TUser = { id: 1, name: 'Ana' }

describe('Obj', () => {
  describe('keys', () => {
    it('returns the keys typed', () => {
      const keys = Obj.keys(user)

      expect(keys).toEqual(['id', 'name'])
      expectTypeOf(keys).toEqualTypeOf<('id' | 'name' | 'email')[]>()
    })

    it('returns number keys as strings', () => {
      const keys = Obj.keys({ 1: 'a', b: 2 })

      expect(keys).toEqual(['1', 'b'])
      expectTypeOf(keys).toEqualTypeOf<('1' | 'b')[]>()
    })

    it('returns a non-empty tuple when asked', () => {
      const keys = Obj.keys({ a: 1 }, 'non-empty-tuple')

      expect(keys).toEqual(['a'])
      expectTypeOf(keys).toEqualTypeOf<['a', ...'a'[]]>()
    })

    it('throws on an empty object when a non-empty tuple is asked', () => {
      expect(() => Obj.keys({}, 'non-empty-tuple')).toThrow('Obj.keys: the object has no keys')
    })
  })

  describe('values', () => {
    it('returns the values typed', () => {
      const values = Obj.values({ a: 1, b: 'x' })

      expect(values).toEqual([1, 'x'])
      expectTypeOf(values).toEqualTypeOf<(number | string)[]>()
    })
  })

  describe('entries', () => {
    it('keeps each value matched to its key', () => {
      const entries = Obj.entries({ a: 1, b: 'x' })

      expect(entries).toEqual([
        ['a', 1],
        ['b', 'x'],
      ])
      expectTypeOf(entries).toEqualTypeOf<(['a', number] | ['b', string])[]>()
    })

    it('types optional keys with undefined', () => {
      expectTypeOf(Obj.entries(user)).toEqualTypeOf<
        (['id', number] | ['name', string] | ['email', string | undefined])[]
      >()
    })
  })

  describe('pick', () => {
    it('copies only the given keys', () => {
      const picked = Obj.pick(user, ['id'])

      expect(picked).toEqual({ id: 1 })
      expectTypeOf(picked).toEqualTypeOf<{ id: number }>()
    })

    it('skips keys missing in the object', () => {
      const picked = Obj.pick(user, ['id', 'email'])

      expect(picked).toEqual({ id: 1 })
      expect('email' in picked).toBe(false)
      expectTypeOf(picked).toEqualTypeOf<{ id: number; email?: string }>()
    })

    it('does not change the original object', () => {
      Obj.pick(user, ['id'])

      expect(user).toEqual({ id: 1, name: 'Ana' })
    })
  })

  describe('omit', () => {
    it('removes the given keys', () => {
      const omitted = Obj.omit(user, ['id', 'email'])

      expect(omitted).toEqual({ name: 'Ana' })
      expectTypeOf(omitted).toEqualTypeOf<{ name: string }>()
    })

    it('removes number keys', () => {
      expect(Obj.omit({ 1: 'a', b: 2 }, [1])).toEqual({ b: 2 })
    })

    it('does not change the original object', () => {
      Obj.omit(user, ['id'])

      expect(user).toEqual({ id: 1, name: 'Ana' })
    })
  })

  describe('mapValues', () => {
    it('maps each value and keeps the keys', () => {
      const mapped = Obj.mapValues({ a: 1, b: 2 }, (value, key) => `${key}${value * 2}`)

      expect(mapped).toEqual({ a: 'a2', b: 'b4' })
      expectTypeOf(mapped).toEqualTypeOf<{ a: string; b: string }>()
    })

    it('keeps optional keys optional', () => {
      expectTypeOf(Obj.mapValues(user, String)).toEqualTypeOf<{ id: string; name: string; email?: string }>()
    })
  })

  describe('record', () => {
    it('gives every key the same value', () => {
      const record = Obj.record(['a', 'b'], 0)

      expect(record).toEqual({ a: 0, b: 0 })
      expectTypeOf(record).toEqualTypeOf<Record<'a' | 'b', number>>()
    })
  })

  describe('createRecord', () => {
    it('builds each value from its key', () => {
      const record = Obj.createRecord(['a', 'b'], (key) => key.toUpperCase())

      expect(record).toEqual({ a: 'A', b: 'B' })
      expectTypeOf(record).toEqualTypeOf<Record<'a' | 'b', string>>()
    })

    it('passes number keys as numbers', () => {
      expect(Obj.createRecord([1, 2], (key) => key * 10)).toEqual({ 1: 10, 2: 20 })
    })
  })

  describe('flip', () => {
    it('swaps keys and values', () => {
      const flipped = Obj.flip({ a: 'x', b: 1 })

      expect(flipped).toEqual({ x: 'a', 1: 'b' })
      expectTypeOf(flipped).toEqualTypeOf<{ x: 'a'; 1: 'b' }>()
    })

    it('keeps the last key when values repeat', () => {
      const flipped = Obj.flip({ a: 'x', b: 'x' })

      expect(flipped).toEqual({ x: 'b' })
      expectTypeOf(flipped).toEqualTypeOf<{ x: 'a' | 'b' }>()
    })
  })

  describe('hasKey', () => {
    it('narrows the key to a key of the object', () => {
      const key: string = 'name'

      if (!Obj.hasKey(user, key)) throw new Error('expected the key to exist')

      expectTypeOf(key).toEqualTypeOf<keyof TUser>()
      expect(user[key]).toBe('Ana')
    })

    it('ignores inherited keys', () => {
      expect(Obj.hasKey(user, 'toString')).toBe(false)
    })
  })

  describe('isEmpty', () => {
    it('is true only for objects without keys', () => {
      expect(Obj.isEmpty({})).toBe(true)
      expect(Obj.isEmpty(user)).toBe(false)
    })
  })
})
