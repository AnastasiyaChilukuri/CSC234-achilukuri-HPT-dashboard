/// <reference types="cypress" />

describe('HPT Dashbaord Add new tool page test', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/')
      cy.get('#mainMenu button').contains("Add New Tool").click()
      cy.get('#loginPage').should('exist').should('be.visible')
      Cypress.config('defaultCommandTimeout', 20000)

    })

    it('Click on "Add New Tool" tab and expect a Loging page to show up', () => {
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

    it('Sign in with valid credentials and expect to see AddNewTool form', () => {        
        cy.get('#loginPageUserNameField').type('sampleuser1@hpt.com')
        cy.get('#loginPagePasswordField').type('1234')
        cy.get('#loginPageSignInButton').click()
        cy.get('#addNewToolForm').should('exist').should('be.visible')
        
        cy.get('#addNewToolForm_ToolSerialNo').invoke('attr','aria-invalid').should('eq', 'false')
        cy.get('#addNewToolForm_MotorSerialNo').invoke('attr','aria-invalid').should('eq', 'false')
        cy.get('#addNewToolForm_BatterySerialNo').invoke('attr','aria-invalid').should('eq', 'false')

        cy.get('#addNewToolForm_button').click()
        cy.get('#addNewToolForm_ToolSerialNo').invoke('attr','aria-invalid').should('eq', 'true')
        cy.get('#addNewToolForm_MotorSerialNo').invoke('attr','aria-invalid').should('eq', 'true')
        cy.get('#addNewToolForm_BatterySerialNo').invoke('attr','aria-invalid').should('eq', 'true')

        cy.get('#addNewToolForm_ToolSerialNo-helper-text').should('have.text','Serial number is Required')
        cy.get('#addNewToolForm_MotorSerialNo-helper-text').should('have.text','Motor Serial number is Required')
        cy.get('#addNewToolForm_BatterySerialNo-helper-text').should('have.text','Battery Serial number is Required')
        
        cy.get('#addNewToolForm_ToolTypeSelect').click()
        cy.get(`[aria-labelledby="addNewToolForm_ToolTypeSelect"]`).find('li').should('have.length', 7)    
    })


    it('Sign in with valid credentials and add already existing tool, and expect failure dialog', () => {        
        cy.get('#loginPageUserNameField').type('sampleuser1@hpt.com')
        cy.get('#loginPagePasswordField').type('1234')
        cy.get('#loginPageSignInButton').click()
        cy.get('#addNewToolForm').should('exist').should('be.visible')
        
        cy.get('#addNewToolForm_ToolSerialNo').type('HDB201301719')
        cy.get('#addNewToolForm_MotorSerialNo').type('HDBM202210646')
        cy.get('#addNewToolForm_BatterySerialNo').type('HDBB202209683')
        cy.get('#addNewToolForm_ToolTypeSelect').click()
        cy.get(`[data-value="HammerDrill Bulldog"]`).click()
        
        cy.get('#failureDialog').should('not.exist')
        cy.get('#addNewToolForm_button').click()
        cy.get('#failureDialog').should('exist').should('be.visible')
        cy.get('#failureDialog button').wait(2000).click()
    })

    it('Sign in with valid credentials and add already existing motor/battery, and expect failure dialog', () => {        
        cy.get('#loginPageUserNameField').type('sampleuser1@hpt.com')
        cy.get('#loginPagePasswordField').type('1234')
        cy.get('#loginPageSignInButton').click()
        cy.get('#addNewToolForm').should('exist').should('be.visible')
        
        cy.get('#addNewToolForm_ToolSerialNo').type('HDB202201719')
        cy.get('#addNewToolForm_MotorSerialNo').type('HDBM202210646')
        cy.get('#addNewToolForm_BatterySerialNo').type('HDBB202209683')
        cy.get('#addNewToolForm_ToolTypeSelect').click()
        cy.get(`[data-value="HammerDrill Bulldog"]`).click()
        
        cy.get('#failureDialog').should('not.exist')
        cy.get('#addNewToolForm_button').click()
        cy.get('#failureDialog').should('exist').should('be.visible')
        cy.get('#failureDialog button').wait(2000).click()
    })

    it('Sign in with valid credentials and add already existing battery, and expect failure dialog', () => {        
        cy.get('#loginPageUserNameField').type('sampleuser1@hpt.com')
        cy.get('#loginPagePasswordField').type('1234')
        cy.get('#loginPageSignInButton').click()
        cy.get('#addNewToolForm').should('exist').should('be.visible')
        
        cy.get('#addNewToolForm_ToolSerialNo').type('HDB202201719')
        cy.get('#addNewToolForm_MotorSerialNo').type('HDBM202210647')
        cy.get('#addNewToolForm_BatterySerialNo').type('HDBB202209683')
        cy.get('#addNewToolForm_ToolTypeSelect').click()
        cy.get(`[data-value="HammerDrill Bulldog"]`).click()
        
        cy.get('#failureDialog').should('not.exist')
        cy.get('#addNewToolForm_button').click()
        cy.get('#failureDialog').should('exist').should('be.visible')
        cy.get('#failureDialog button').wait(2000).click()
    })

    it('Sign in with valid credentials and add new tool, and expect sucess dialog', () => {        
        cy.get('#loginPageUserNameField').type('sampleuser1@hpt.com')
        cy.get('#loginPagePasswordField').type('1234')
        cy.get('#loginPageSignInButton').click()
        cy.get('#addNewToolForm').should('exist').should('be.visible')
        
        cy.get('#addNewToolForm_ToolSerialNo').type('HDB202201719')
        cy.get('#addNewToolForm_MotorSerialNo').type('HDBM202210647')
        cy.get('#addNewToolForm_BatterySerialNo').type('HDBB202209680')
        cy.get('#addNewToolForm_ToolTypeSelect').click()
        cy.get(`[data-value="HammerDrill Bulldog"]`).click()
        
        cy.get('#sucessDialog').should('not.exist')
        cy.get('#addNewToolForm_button').click()
        cy.get('#sucessDialog').should('exist').should('be.visible')
        cy.get('#sucessDialog button').wait(2000).click()        
    })

    it('Find and delete the newly added tool in the above test', () => { 
        //delete the newly added tool
        cy.get('#mainMenu button').contains("View/Edit Data").click()
        cy.get('#loginPage').should('exist').should('be.visible')

        cy.get('#loginPageUserNameField').type('sampleuser1@hpt.com')
        cy.get('#loginPagePasswordField').type('1234')
        cy.get('#loginPageSignInButton').click()
        cy.get('#tableMenuBar').should('exist').should('be.visible')
        cy.get('#vendiaTable').should('exist').should('be.visible')
        cy.get('#toolTable').should('exist').should('be.visible')
        cy.get('.MuiTablePagination-select').should('have.text','10')
        //cy.get('tr').eq(1).find('td').eq(5).find('button').click()
        
        var toolId = "HDB202201719";
        var found = false;
        var rowToDelete;
        async function traveseTableAndFindID () {
            cy.get('tr > td').each(($sno) => {
                cy.wrap($sno).invoke('text').then(text => {
                    if(text.trim() == toolId)
                    { 
                        found = true;
                        rowToDelete = $sno
                    }
                })
            }).then(()=>{
                if (found) {
                    cy.wrap(rowToDelete).parent().find(`[aria-label="toolTableDeleteRow"]`).click()
                    found = false;
                    return;                    
                }
                else {
                    cy.get(`[aria-label="Go to next page"]`).should('exist').then(($btn) => {
                        if ($btn.is(":disabled")) {
                            return;
                        } else {
                            cy.get(`[aria-label="Go to next page"]`).click({force:true});

                            traveseTableAndFindID();
                        }
                    });
                }
            })
            
        }

        traveseTableAndFindID()
    })
})