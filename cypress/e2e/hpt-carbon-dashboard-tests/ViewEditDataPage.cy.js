/// <reference types="cypress" />

describe('HPT Dashbaord View/Edit data page test', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/')
      cy.get('#mainMenu button').contains("View/Edit Data").click()
      cy.get('#loginPage').should('exist').should('be.visible')
      Cypress.config('defaultCommandTimeout', 20000)
    })

    it('Click on "View/Edit Data" tab and expect a Login page to show up', () => {
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

    it('Sign in with valid credentials and expect to see tables', () => {
        cy.get('#loginPageUserNameField').type('sampleuser1@hpt.com')
        cy.get('#loginPagePasswordField').type('1234')
        cy.get('#loginPageSignInButton').click()
        cy.get('#tableMenuBar').should('exist').should('be.visible')
        cy.get('#vendiaTable').should('exist').should('be.visible')
    }) 
 
    it('Check Pagination',() =>{
        cy.get('#loginPageUserNameField').type('sampleuser1@hpt.com')
        cy.get('#loginPagePasswordField').type('1234')
        cy.get('#loginPageSignInButton').click()
        cy.get('#tableMenuBar').should('exist').should('be.visible')
        cy.get('#vendiaTable').should('exist').should('be.visible')
        cy.get('#toolTable').should('exist').should('be.visible')
        cy.get('.MuiTablePagination-select').should('have.text','10')
        cy.get('#toolTable > .MuiTableBody-root').find('.MuiTableRow-root').should('have.length',10)
    })

    it('Find an tool ID',() =>{
        cy.get('#loginPageUserNameField').type('sampleuser1@hpt.com')
        cy.get('#loginPagePasswordField').type('1234')
        cy.get('#loginPageSignInButton').click()
        cy.get('#tableMenuBar').should('exist').should('be.visible')
        cy.get('#vendiaTable').should('exist').should('be.visible')
        cy.get('#toolTable').should('exist').should('be.visible')
        cy.get('.MuiTablePagination-select').should('have.text','10')
        
        var toolId = "HDB201307288";

        const traveseTableAndFindID = (atempts) => {
            if(atempts > 120) return;
            var found = false;
            cy.get('#toolTable > .MuiTableBody-root').find('.MuiTableRow-root').should('have.length',10)
            cy.get('#toolTable > .MuiTableBody-root')
            .find('.MuiTableRow-root')
            .each(($row, $rindex) => {
                cy.wrap($row).find('td').each(($col,$colindex) => {
                    if($colindex == 0){
                        cy.wrap($col)
                        .invoke('text')
                        .then(text => {
                            cy.log(text.trim())
                            if(text.trim() == toolId)
                            { 
                                found = true;
                                return;
                            }
                        })
                    }
                })
            }).then(()=>{
                if(!found){
                    cy.get(`[aria-label="Go to next page"]`).then(($btn) => {
                        if ($btn.is(":disabled")) {
                            return;
                        }
                    })
                    cy.wait(1000)


                    cy.get(`[aria-label="Go to next page"]`).click();

                    traveseTableAndFindID(atempts+1);
                }
            })
        }

        traveseTableAndFindID(0);
    })
})