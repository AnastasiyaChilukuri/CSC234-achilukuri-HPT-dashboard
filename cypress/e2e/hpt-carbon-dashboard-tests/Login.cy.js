/// <reference types="cypress" />

describe('HPT Dashbaord overall login functionality test', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/')
      Cypress.config('defaultCommandTimeout', 20000)
    })

    it('Expect to see login prompt in every page', () => {
      cy.get('#loginPage').should('not.exist')
      cy.get('#mainMenu button').contains("Historical Data").click().wait(2000)
      cy.get('#loginPage').should('exist').should('be.visible')
      cy.get('#mainMenu button').contains("Add New Tool").click().wait(2000)
      cy.get('#loginPage').should('exist').should('be.visible')      
      cy.get('#mainMenu button').contains("View/Edit Data").click().wait(2000)
      cy.get('#loginPage').should('exist').should('be.visible')   
    })

    it('Login with admin credentials in one of the pages and expect to get access to whole system', () => {
        cy.get('#mainMenu button').contains("Historical Data").click().wait(2000)
        cy.get('#loginPageUserNameField').type('sampleuser1@hpt.com')
        cy.get('#loginPagePasswordField').type('1234')
        cy.get('#loginPageSignInButton').click()
        cy.get('#toolPicGrid').should('exist')
        cy.get('#toolPicGrid').find('li').should('have.length', 7).wait(2000)
    
        
        cy.get('#mainMenu button').contains("Add New Tool").click().wait(2000)
        cy.get('#loginPage').should('not.exist')
        cy.get('#addNewToolForm').should('exist').should('be.visible')


        cy.get('#mainMenu button').contains("View/Edit Data").click().wait(2000)
        cy.get('#loginPage').should('not.exist')

        
        cy.get('#accountMenu').click()
        cy.get('#logoutButton').should('be.visible').wait(2000).click()
        cy.get('#loginPageUserNameField').should('exist').should('be.visible')
        cy.get('#loginPagePasswordField').should('exist').should('be.visible')
        cy.get('#loginPageSignInButton').should('exist').should('be.visible')
        cy.get('#hideShowPassword').should('exist').should('be.visible')
      })
    
    it('Login with user credentials in one of the pages and expect to get access to whole system except "Add New Tool" form', () => {
        cy.get('#mainMenu button').contains("Historical Data").click().wait(2000)
        cy.get('#loginPageUserNameField').type('sampleuser2@hpt.com')
        cy.get('#loginPagePasswordField').type('1111')
        cy.get('#loginPageSignInButton').click()
        cy.get('#toolPicGrid').should('exist')
        cy.get('#toolPicGrid').find('li').should('have.length', 7).wait(2000)
    
        
        cy.get('#mainMenu button').contains("Add New Tool").click().wait(2000)
        cy.get('#loginPage').should('not.exist')
        cy.get('#notEnoughPermissions').should('exist').should('be.visible')


        cy.get('#mainMenu button').contains("View/Edit Data").click().wait(2000)
        cy.get('#loginPage').should('not.exist')
      })
})