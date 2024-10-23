import React from 'react'
import MultistepForm from './MultistepForm'

describe('<MultistepForm />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<MultistepForm />)
  })
})