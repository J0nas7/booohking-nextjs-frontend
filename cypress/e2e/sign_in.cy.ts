import { UserDTO } from '@/types';

describe("Sign in page", () => {
    beforeEach(() => {
        cy.visit("/sign-in");
    });

    it("renders the login form", () => {
        cy.get('[data-testid="signin-form"]').should("be.visible");

        cy.findByRole("heading", { name: /login/i }).should("be.visible");

        cy.get('input[type="email"]').should("exist");
        cy.get('input[type="password"]').should("exist");

        cy.findByRole("button", { name: /login/i }).should("be.enabled");
    });

    it("allows a user to type email and password", () => {
        cy.get('input[type="email"]')
            .type("user@example.com")
            .should("have.value", "user@example.com");

        cy.get('input[type="password"]')
            .type("password123abc")
            .should("have.value", "password123abc");
    });

    it("submits the login form and validates API response", () => {
        cy.intercept("POST", "http://localhost:8080/api/auth/login").as("signIn");

        cy.get('input[type="email"]').type("jonas-usr@booohking.com");
        cy.get('input[type="password"]').type("abc123def");

        cy.findByRole("button", { name: /login/i }).click();

        cy.wait("@signIn").then(({ response }) => {
            expect(response).to.not.be.undefined;
            expect(response?.statusCode).to.eq(200);

            const body = response?.body;
            expect(body).to.have.property("success", true);
            expect(body).to.have.property("message", "User logged in successfully");
            expect(body).to.have.property("data").that.is.an("object");

            const data = body.data;
            expect(data).to.have.property("accessToken").that.is.a("string").and.not.be.empty;
            expect(data).to.have.property("user").that.is.an("object");

            const user: UserDTO = data.user;
            expect(user).to.have.property("id").that.is.a("number");
            expect(user).to.have.property("name").that.is.a("string").and.not.be.empty;
            expect(user).to.have.property("email").that.is.a("string").and.not.be.empty;
        });
    });

    it("has links to recover password and register", () => {
        cy.findByRole("link", { name: /recover/i })
            .should("have.attr", "href", "/forgot-password");

        cy.findByRole("link", { name: /register/i })
            .should("have.attr", "href", "/register-account");
    });
});
