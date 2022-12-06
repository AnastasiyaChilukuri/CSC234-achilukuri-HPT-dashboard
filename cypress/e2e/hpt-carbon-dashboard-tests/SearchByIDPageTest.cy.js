/// <reference types="cypress" />

describe('HPT Dashbaord search by ID test', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/')
    })

    it('Check if page is loaded with expected field(s) and button(s)', () => {
      //make sure there are only input fields and no popups on page load
      cy.get('#toolSerialNumInputTextField')
      cy.get('#toolSerialNumInputSubmitButton')
      cy.get('#toolPopUp').should('not.exist')
      cy.get('#wrongSerialNumber').should('not.exist')
    })

    it('Press "Find Tool" wihtout entering a serial number and expect to see helper text', () => {
      // make sure the page is loaded with 'valid' text field (in blue color)
      cy.get('#toolSerialNumInputTextField').invoke('attr','aria-invalid').should('eq', 'false')
      cy.get('#toolSerialNumInputSubmitButton').click()
      // After pressing the submit button with no value in textfield
      // make sure the 'valid' attribute if 'false' field (in red color)
      cy.get('#toolSerialNumInputTextField').invoke('attr','aria-invalid').should('eq', 'true')
      cy.get('#toolSerialNumInputTextField-helper-text').should('have.text','Serial number is required!')
    })

    it('Press "Find Tool" with a wrong serial number and expect a popup with error', () => {
      cy.get('#wrongSerialNumber').should('not.exist')
      cy.get('#toolSerialNumInputTextField').type("123")
      cy.get('#toolSerialNumInputSubmitButton').click()
      cy.get('#wrongSerialNumber', { timeout: 10000 })
      cy.get('#wrongSerialNumber button').click()
      cy.get('#wrongSerialNumber').should('not.exist');
    })

    it('Press "Find Tool" with a valid serial number and expect a tool popup with right tool image', () => {
      cy.get('#toolPopUp').should('not.exist')
      const ids = [
        ["HDB201301719", "HAMMERDRILL BULLDOG WITH SERIAL NUMBER HDB201301719"],
        ["PD201301667", "PRECUSSION DRILL WITH SERIAL NUMBER PD201301667"],
        ["MD201301686", "MIXER DRILL WITH SERIAL NUMBER MD201301686"],
        ["CD201301894", "COMPACT DRILL WITH SERIAL NUMBER CD201301894"],
        ["RD201301355", "ROTARY DRILL WITH SERIAL NUMBER RD201301355"],
        ["AD201301242", "ANGLE DRILL WITH SERIAL NUMBER AD201301242"],
        ["HD201301284", "HAMMER DRILL WITH SERIAL NUMBER HD201301284"]
      ]

      cy.wrap(ids).each((elem, i, array) => {
        cy.get('#toolSerialNumInputTextField').clear()
        cy.get('#toolSerialNumInputTextField').type(elem[0])
        cy.get('#toolSerialNumInputSubmitButton').click()
        cy.get('#toolPopUp', { timeout: 10000 })
        // Make sure the image is loaded
        // refernce : https://glebbahmutov.com/cypress-examples/9.6.0/recipes/image-loaded.html
        cy.get('#toolPopUpImg')
          .should('be.visible')
          .and('have.prop', 'naturalWidth')
          .should('be.greaterThan', 0)
        cy.get('#toolPopUp').find('span').contains(elem[1],{ matchCase: false })
        cy.get('#toolPopUp button').click()

      })
    })

})