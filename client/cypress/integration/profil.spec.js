describe('Profil', () => {
    beforeEach(() => {
        cy.setCookie(
            'refreshToken',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwibmFtZSI6IlJvYm90IiwiZW1haWwiOiJ6QHoiLCJhdmF0YXIiOiJodHRwczovL3l0My5nZ3BodC5jb20veXRjL0FLZWRPTFRjSWw2a0t0M2xFUEpFeVNVZl9ocEhpS0RLaUZlbzllV1BSZUx5c1E9czE3Ni1jLWstYzB4MDBmZmZmZmYtbm8tcmoiLCJiaW8iOiJIZXkgSSdtIGEgc3VwZXIgY29vbCBSb2JvdCEiLCJpYXQiOjE2MzU3MTMyNjUsImV4cCI6MTYzNjMxODA2NSwiaXNzIjoib2JzdGluYXRlU29jaWFsTWVkaWEifQ.iRlpPEMZdziJQT_5aI3_oXf31JpVaD13NA4-CnnvUkU'
        );
        cy.visit('http://localhost:3000');
        cy.wait(100);
    });

    it('can go to profil through navbar', () => {
        cy.get(':nth-child(3) > a').click();
        cy.get('.profil-info > h1').contains('Robot');
        cy.get('.profil-bio > p').contains("Hey I'm a super cool Robot!");
    });

    it('Can go through post', () => {
        cy.get('[href="/profil/9"]:first').click();
        cy.get('.profil-info > h1').contains('Robot');
        cy.get('.profil-bio > p').contains("Hey I'm a super cool Robot!");
    });
});
