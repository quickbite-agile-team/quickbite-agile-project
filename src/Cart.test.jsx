import {test, expect, afterEach} from 'vitest'
import {render, screen, fireEvent, cleanup, within} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import App from './App'


afterEach(() => {
    cleanup()
})


function getCart() {
    return screen.getByRole('complementary', {name: 'Your order'})
}


test('cart shows an empty message when nothing is selected', () => {
    render(<App />)

    const cart = getCart()
    expect(within(cart).getByRole('heading', {name: 'Your order'})).toBeInTheDocument()
    expect(within(cart).getByText('No items selected yet.')).toBeInTheDocument()
    expect(within(cart).queryByText('Classic Burger')).not.toBeInTheDocument()
})

test('an item appears in the cart after clicking +', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', {name: 'Increase Classic Burger'}))

    const cart = getCart()
    expect(within(cart).getByText('Classic Burger')).toBeInTheDocument()
    expect(within(cart).getByText('× 1')).toBeInTheDocument()
    expect(within(cart).queryByText('No items selected yet.')).not.toBeInTheDocument()
})

test('cart shows correct line totals and subtotal in CAD', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', {name: 'Increase Classic Burger'}))
    fireEvent.click(screen.getByRole('button', {name: 'Increase Classic Burger'}))
    fireEvent.click(screen.getByRole('button', {name: 'Increase French Fries'}))

    const cart = getCart()
    const lines = within(cart).getAllByRole('listitem')
    expect(lines).toHaveLength(2)

    expect(lines[0]).toHaveTextContent('Classic Burger')
    expect(lines[0]).toHaveTextContent('× 2')
    expect(lines[0]).toHaveTextContent('$25.98')

    expect(lines[1]).toHaveTextContent('French Fries')
    expect(lines[1]).toHaveTextContent('× 1')
    expect(lines[1]).toHaveTextContent('$4.99')

    expect(within(cart).getByLabelText('Subtotal amount')).toHaveTextContent('$30.97')
})

test('an item disappears from the cart when its quantity goes back to 0', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', {name: 'Increase Cheese Burger'}))
    fireEvent.click(screen.getByRole('button', {name: 'Increase French Fries'}))
    fireEvent.click(screen.getByRole('button', {name: 'Decrease Cheese Burger'}))

    const cart = getCart()
    expect(within(cart).queryByText('Cheese Burger')).not.toBeInTheDocument()
    expect(within(cart).getByText('French Fries')).toBeInTheDocument()
    expect(within(cart).getByLabelText('Subtotal amount')).toHaveTextContent('$4.99')

    fireEvent.click(screen.getByRole('button', {name: 'Decrease French Fries'}))
    expect(within(cart).getByText('No items selected yet.')).toBeInTheDocument()
})
