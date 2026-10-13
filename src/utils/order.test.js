import {test, expect, describe} from 'vitest'
import {getSelectedItems, getSubtotal} from './order'


const menuItems = [
    {id: 1, name: 'Classic Burger', description: 'Beef patty.', price: 12.99},
    {id: 2, name: 'Cheese Burger', description: 'Cheddar.', price: 13.99},
    {id: 3, name: 'French Fries', description: 'Crispy.', price: 4.99},
]


describe('getSelectedItems', () => {
    test('returns an empty list when nothing is selected', () => {
        expect(getSelectedItems(menuItems, {1: 0, 2: 0, 3: 0})).toEqual([])
        expect(getSelectedItems(menuItems, {})).toEqual([])
    })

    test('returns one selected item with its line total', () => {
        expect(getSelectedItems(menuItems, {1: 3, 2: 0, 3: 0})).toEqual([
            {id: 1, name: 'Classic Burger', price: 12.99, quantity: 3, lineTotal: 38.97},
        ])
    })

    test('returns multiple selected items in menu order', () => {
        expect(getSelectedItems(menuItems, {3: 2, 1: 1, 2: 0})).toEqual([
            {id: 1, name: 'Classic Burger', price: 12.99, quantity: 1, lineTotal: 12.99},
            {id: 3, name: 'French Fries', price: 4.99, quantity: 2, lineTotal: 9.98},
        ])
    })

    test('excludes items with quantity 0', () => {
        const selected = getSelectedItems(menuItems, {1: 0, 2: 1, 3: 0})

        expect(selected.map((item) => item.id)).toEqual([2])
    })
})


describe('getSubtotal', () => {
    test('returns 0 for an empty list', () => {
        expect(getSubtotal([])).toBe(0)
    })

    test('returns the line total for one item', () => {
        expect(getSubtotal(getSelectedItems(menuItems, {1: 3}))).toBe(38.97)
    })

    test('adds up the line totals of multiple items', () => {
        expect(getSubtotal(getSelectedItems(menuItems, {1: 2, 2: 1, 3: 3}))).toBe(54.94)
    })

    test('ignores items with quantity 0', () => {
        expect(getSubtotal(getSelectedItems(menuItems, {1: 0, 2: 0, 3: 1}))).toBe(4.99)
    })
})
