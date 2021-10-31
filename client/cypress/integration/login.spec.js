describe('Authentification flow', () => {
    it('Shows home page', () => {
        cy.login('z@z', 'z');
        cy.visit('http://localhost:3000');
        cy.wait(100);
        cy.get('.title h1').contains('Twitter V2');
        cy.get(':nth-child(5) > a').click();
    });
});
