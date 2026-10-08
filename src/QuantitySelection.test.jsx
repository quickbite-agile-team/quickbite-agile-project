import {test, expect, afterEach} from 'vitest'
import {render, screen, fireEvent, cleanup} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import App from './App'


afterEach(() => {
    cleanup()
})


test('every menu item quantity starts at 0', () => {
    render(<App />)

    expect(screen.getByLabelText('Classic Burger quantity')).toHaveTextContent('0')
    expect(screen.getByLabelText('Cheese Burger quantity')).toHaveTextContent('0')
    expect(screen.getByLabelText('Crispy Chicken Burger quantity')).toHaveTextContent('0')
    expect(screen.getByLabelText('French Fries quantity')).toHaveTextContent('0')
})

test('clicking + increases the item quantity by 1', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', {name: 'Increase Classic Burger'}))
    expect(screen.getByLabelText('Classic Burger quantity')).toHaveTextContent('1')

    fireEvent.click(screen.getByRole('button', {name: 'Increase Classic Burger'}))
    expect(screen.getByLabelText('Classic Burger quantity')).toHaveTextContent('2')
})

test('clicking − decreases the item quantity by 1', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', {name: 'Increase Classic Burger'}))
    fireEvent.click(screen.getByRole('button', {name: 'Increase Classic Burger'}))
    fireEvent.click(screen.getByRole('button', {name: 'Decrease Classic Burger'}))

    expect(screen.getByLabelText('Classic Burger quantity')).toHaveTextContent('1')
})

test('− is disabled at 0 and the quantity cannot go below 0', () => {
    render(<App />)

    const decreaseButton = screen.getByRole('button', {name: 'Decrease Classic Burger'})
    expect(decreaseButton).toBeDisabled()

    fireEvent.click(decreaseButton)
    expect(screen.getByLabelText('Classic Burger quantity')).toHaveTextContent('0')

    fireEvent.click(screen.getByRole('button', {name: 'Increase Classic Burger'}))
    expect(decreaseButton).toBeEnabled()

    fireEvent.click(decreaseButton)
    expect(screen.getByLabelText('Classic Burger quantity')).toHaveTextContent('0')
    expect(decreaseButton).toBeDisabled()
})

test('changing one item quantity does not change another item', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', {name: 'Increase French Fries'}))
    fireEvent.click(screen.getByRole('button', {name: 'Increase French Fries'}))
    fireEvent.click(screen.getByRole('button', {name: 'Increase Cheese Burger'}))

    expect(screen.getByLabelText('French Fries quantity')).toHaveTextContent('2')
    expect(screen.getByLabelText('Cheese Burger quantity')).toHaveTextContent('1')
    expect(screen.getByLabelText('Classic Burger quantity')).toHaveTextContent('0')
    expect(screen.getByLabelText('Crispy Chicken Burger quantity')).toHaveTextContent('0')
})
