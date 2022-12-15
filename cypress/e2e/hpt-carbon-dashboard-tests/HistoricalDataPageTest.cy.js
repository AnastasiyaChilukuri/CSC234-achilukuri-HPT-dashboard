/// <reference types="cypress" />

describe('HPT Dashbaord Historical data page test', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/')
      cy.get('#mainMenu button').contains("Historical Data").click()
      cy.get('#loginPage').should('exist').should('be.visible')
      Cypress.config('defaultCommandTimeout', 20000)

    })

    it('Click on "Historical Data" tab and expect a Login page', () => {
        cy.get('#loginPageUserNameField').should('exist').should('be.visible')
        cy.get('#loginPagePasswordField').should('exist').should('be.visible')
        cy.get('#loginPageSignInButton').should('exist').should('be.visible')
        cy.get('#hideShowPassword').should('exist').should('be.visible')
    })

    it('Sign in with empty username and password and expect to see helper text', () => {
        cy.get('#loginPageUserNameField').invoke('attr','aria-invalid').should('eq', 'false')
        cy.get('#loginPagePasswordField').invoke('attr','aria-invalid').should('eq', 'false')
        cy.get('#loginPageSignInButton').click()
        cy.get('#loginPageUserNameField').invoke('attr','aria-invalid').should('eq', 'true')
        cy.get('#loginPagePasswordField').invoke('attr','aria-invalid').should('eq', 'true')
        cy.get('#loginPageUserNameField-helper-text').should('have.text','Username/email cannot be empty')
        cy.get('#loginPagePasswordField-helper-text').should('have.text','Password cannot be empty')
        
        cy.get('#loginPagePasswordField').invoke('attr','type').should('eq', 'password')
        cy.get('#hideShowPassword').click()
        cy.get('#loginPagePasswordField').invoke('attr','type').should('eq', 'text')
    })

    it('Sign in with invalid credentials and expect a wrong cred dialog', () => {
        cy.get('#loginPageUserNameField').type('sampleuser1@hpt.com')
        cy.get('#loginPagePasswordField').type('12354')
        cy.get('#wrongCredDialog').should('not.exist')
        cy.get('#loginPageSignInButton').click()
        cy.get('#wrongCredDialog').should('exist').should('be.visible')
        cy.get('#wrongCredDialog button').wait(2000).click()
    })

    it('Sign in with valid credentials and expect to see picture grid, click on each picture to see hist data, and logout', () => {
        //make sure that the 7 elements exisit in the grid
        //right now we have only 7 types of picture
        const toolTypes =[
            {

                "img": "hammerdrill.jpg",
                "title": "Hammer Drill",
                "type": "hammerDrill"
            },
            {
                "img": "angledrill.jpg",
                "title": "Angle Drill",
                "type": "angleDrill"
            },
            {
                "img": "rotarydrill.jpeg",
                "title": "Rotary Drill",
                "type": "rotaryDrill"
            },
            {
                "img": "compactdrill.jpg",
                "title": "Compact Drill",
                "type": "compactDrill"
            },
            {
                "img": "mixerdrill.jpg",
                "title": "Mixer Drill",
                "type": "mixerDrill"
            },
            {
                "img": "percussiondrill.jpeg",
                "title": "Precussion Drill",
                "type": "percussionDrill"
            },
            {
                "img": "hammerdrillbulldog.jpg",
                "title": "HammerDrill Bulldog",
                "type": "hammerDrillBulldog"
            }
        ]
        cy.get('#loginPageUserNameField').type('sampleuser1@hpt.com')
        cy.get('#loginPagePasswordField').type('1234')
        cy.get('#loginPageSignInButton').click()
        cy.get('#toolPicGrid').should('exist')
        cy.get('#toolPicGrid').find('li').should('have.length', 7)
    
        //make sure every image is loaded properly (title should match the image url)
        cy.wrap(toolTypes).each((toolType, i, array) => {
            cy.get('#'+toolType.type+'GridItemImage').invoke('attr','src').should('contain', toolType.img)
            cy.get('#'+toolType.type+'GridItemHeader').find('div').contains(toolType.title,{ matchCase: false })
            cy.get('#dialogPopupWithHistGraphAndTable').should('not.exist')
            cy.get('#'+toolType.type+'GridItemImage').click()
            cy.get('#dialogPopupWithHistGraphAndTable').should('exist')
            cy.get('#dialogPopupWithHistGraphAndTableHeader').find('span').contains('Historical data for ' + toolType.title)
            cy.get('#dialogPopupWithHistGraphAndTableImage')
            .should('be.visible')
            .and('have.prop', 'naturalWidth')
            .should('be.greaterThan', 0)
            cy.get('#dialogPopupWithHistGraphAndTableImage').invoke('attr','src').should('contain', toolType.img)     
            cy.get('#dialogPopupWithHistGraphAndTable_Graph').should('exist').scrollIntoView().should('be.visible')
            cy.get('#dialogPopupWithHistGraphAndTable_Table').should('exist').scrollIntoView().should('be.visible')
            cy.p
            cy.get('#dialogPopupWithHistGraphAndTable button').wait(2000).click()
        })
    
        cy.get('#accountMenu').click()
        cy.get('#logoutButton').should('be.visible').wait(2000).click()
        cy.get('#loginPageUserNameField').should('exist').should('be.visible')
        cy.get('#loginPagePasswordField').should('exist').should('be.visible')
        cy.get('#loginPageSignInButton').should('exist').should('be.visible')
        cy.get('#hideShowPassword').should('exist').should('be.visible')
    })

    


})