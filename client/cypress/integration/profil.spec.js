describe('Profil', () => {
    it('can go to profil through navbar', () => {
        cy.get(':nth-child(4) > a').click();
        cy.get('.profil-info > h1').contains('Mathis Beauville');
    });

    it('Can go through post', () => {
        cy.visit('/');
        cy.get('[href="/profil/9"]:first').click();
        cy.get('.profil-info > h1').contains('M. Roger');
    });
});
