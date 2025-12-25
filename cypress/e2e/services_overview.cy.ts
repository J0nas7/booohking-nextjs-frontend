import { ServiceDTO } from '@/types';
import { expect } from "chai";

describe("Services Overview Page", () => {
    beforeEach(() => {
        // Cache login session
        cy.session("auth-user", () => {
            cy.login("jonas-usr@booohking.com", "abc123def");
        });

        // Intercept real services API **before visiting page**
        cy.intercept("GET", "http://localhost:8080/api/services/users/1").as("getServices");

        // Visit the page after intercept is in place
        cy.visit("/");
    });

    it("renders services from real API with full structure", () => {
        // Wait for the real API call
        cy.wait("@getServices").then(({ response }) => {
            expect(response).to.not.be.undefined;
            expect(response?.statusCode).to.eq(200);

            const body = response?.body;
            expect(body).to.have.property("success", true);
            expect(body).to.have.property("message").that.is.a("string");

            const data = body.data;
            expect(data).to.have.property("data").that.is.an("array").with.length.greaterThan(0);
            expect(data).to.have.property("pagination").that.is.an("object");

            // Check pagination properties
            const pagination = data.pagination;
            expect(pagination).to.have.property("total").that.is.a("number");
            expect(pagination).to.have.property("perPage").that.is.a("number");
            expect(pagination).to.have.property("currentPage").that.is.a("number");
            expect(pagination).to.have.property("lastPage").that.is.a("number");

            // Validate first service object shape
            const firstService: ServiceDTO = data.data[0];
            expect(firstService).to.have.property("Service_ID");
            expect(firstService).to.have.property("Service_Name").that.is.a("string");
            expect(firstService).to.have.property("Service_DurationMinutes").that.is.a("number");
        });

        cy.get(".overview-module-scss-module__T4eVdW__cardShadow")
            .should("have.length.greaterThan", 0);

        cy.get(".overview-module-scss-module__T4eVdW__cardTitle").first()
            .should("exist")
            .and("not.be.empty");

        cy.get(".overview-module-scss-module__T4eVdW__editButton").each(($btn) => {
            cy.wrap($btn).should("have.attr", "href").and("include", "/service/");
        });
    });

    it("renders mocked services correctly", () => {
        const mockServices: ServiceDTO[] = [
            {
                Service_ID: 1,
                Service_Name: "Test Service 1",
                Service_DurationMinutes: 30
            },
            {
                Service_ID: 2,
                Service_Name: "Test Service 2",
                Service_DurationMinutes: 45
            },
        ];

        // Intercept mock API **before visiting page**
        cy.intercept("GET", "http://localhost:8080/api/services/users/1", {
            statusCode: 200,
            body: {
                data: {
                    data: mockServices, // nested under "data"
                    pagination: {
                        total: mockServices.length,
                        perPage: mockServices.length,
                        currentPage: 1,
                        lastPage: 1,
                    }
                }
            }
        }).as("getMockServices");

        cy.visit("/");

        cy.wait("@getMockServices").then(({ response }) => {
            const services = response?.body.data.data;
            expect(services).to.have.length(mockServices.length);
        });

        cy.get(".overview-module-scss-module__T4eVdW__cardTitle")
            .should("have.length", mockServices.length)
            .then(($titles) => {
                expect($titles[0].innerText).to.contain("Test Service 1");
                expect($titles[1].innerText).to.contain("Test Service 2");
            });
    });
});
