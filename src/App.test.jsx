import {test, expect} from 'vitest'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import App from './App'


test('displays the restaurant information and menu items', () => {
    render(<App />)

    expect(
        screen.getByRole('heading', {name: 'Grill House Burgers'})
    ).toBeInTheDocument()

    expect(
        screen.getByText(
            'Fresh burgers, crispy fries, and classic sides made for quick pickup.'
        )
    ).toBeInTheDocument()

    expect(screen.getByText('Classic Burger')).toBeInTheDocument()
    expect(screen.getByText('Cheese Burger')).toBeInTheDocument()
    expect(screen.getByText('Crispy Chicken Burger')).toBeInTheDocument()
    expect(screen.getByText('French Fries')).toBeInTheDocument()
})