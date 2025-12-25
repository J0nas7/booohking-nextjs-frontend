import { ProviderDTO, ServiceDTO } from "@/types";
import { expect } from "chai";

describe("Service Providers Page", () => {
    const serviceId = 2;

    beforeEach(() => {
        // Cache login session
        cy.session("auth-user", () => {
            cy.login("jonas-usr@booohking.com", "abc123def");
        });

        // Intercept the service and providers API
        cy.intercept("GET", `http://localhost:8080/api/services/${serviceId}`).as("getService");
        cy.intercept("GET", `http://localhost:8080/api/providers/services/${serviceId}`).as("getProviders");

        // Visit the service page
        cy.visit(`/service/${serviceId}-Equal-Opportunity-Representative`);
    });

    it("renders the service details from API", () => {
        cy.wait("@getService").then(({ response }) => {
            expect(response).to.not.be.undefined;
            expect(response?.statusCode).to.eq(200);

            const body = response?.body;
            expect(body).to.have.property("success", true);
            expect(body).to.have.property("message").that.is.a("string");

            const service: ServiceDTO = body.data;
            expect(service).to.have.property("Service_ID", serviceId);
            expect(service).to.have.property("Service_Name").that.is.a("string").and.not.be.empty;
            expect(service).to.have.property("Service_DurationMinutes").that.is.a("number");
            expect(service).to.have.property("Service_Description").that.is.a("string");
            expect(service).to.have.property("bookings").that.is.an("array");
            expect(service).to.have.property("providers").that.is.an("array");
        });

        cy.get("main h1")
            .should("exist")
            .and("not.be.empty");

        cy.get(".overview-module-scss-module__T4eVdW__cardDescription").first().should("exist");
    });

    it("renders providers correctly", () => {
        cy.wait("@getProviders").then(({ response }) => {
            expect(response).to.not.be.undefined;
            expect(response?.statusCode).to.eq(200);

            const body = response?.body;
            expect(body).to.have.property("success", true);
            expect(body).to.have.property("message", "Providers found");

            const data = body.data;
            expect(data).to.have.property("data").that.is.an("array").with.length.greaterThan(0);
            expect(data).to.have.property("pagination").that.is.an("object");

            const pagination = data.pagination;
            expect(pagination).to.have.property("total").that.is.a("number");
            expect(pagination).to.have.property("perPage").that.is.a("number");
            expect(pagination).to.have.property("currentPage").that.is.a("number");
            expect(pagination).to.have.property("lastPage").that.is.a("number");

            // Validate first provider object
            const firstProvider: ProviderDTO = data.data[0];
            expect(firstProvider).to.have.property("Provider_ID").that.is.a("number");
            expect(firstProvider).to.have.property("Service_ID", serviceId);
            expect(firstProvider).to.have.property("Provider_Name").that.is.a("string").and.not.be.empty;
        });

        cy.get(".overview-module-scss-module__T4eVdW__cardTitle")
            .should("have.length.greaterThan", 0)
            .then(($titles) => {
                expect($titles[0].innerText).to.not.be.empty;
            });

        cy.get(".overview-module-scss-module__T4eVdW__editButton").each(($btn) => {
            cy.wrap($btn).should("have.attr", "href").and("include", "/book/");
        });

        cy.get(".overview-module-scss-module__T4eVdW__workingHourItem")
            .should("have.length.greaterThan", 0);
    });

    it("can mock the service and providers API", () => {
        const mockService: ServiceDTO = {
            Service_ID: serviceId,
            Service_Name: "Mock Service",
            Service_DurationMinutes: 60,
            Service_Description: "Mock description",
            bookings: [],
            providers: []
        };

        const mockProviders: ProviderDTO[] = [
            { Provider_ID: 1, Service_ID: serviceId, Provider_Name: "Provider 1", Provider_Timezone: "CET" },
            { Provider_ID: 2, Service_ID: serviceId, Provider_Name: "Provider 2", Provider_Timezone: "CET" },
        ];

        cy.intercept("GET", `http://localhost:8080/api/services/${serviceId}`, {
            statusCode: 200,
            body: { success: true, message: "Service found (mock)", data: mockService }
        }).as("getMockService");

        cy.intercept("GET", `http://localhost:8080/api/providers/services/${serviceId}`, {
            statusCode: 200,
            body: { success: true, message: "Providers found (mock)", data: { data: mockProviders, pagination: { total: 2, perPage: 10, currentPage: 1, lastPage: 1 } } }
        }).as("getMockProviders");

        cy.visit(`/service/${serviceId}-Mock-Service`);

        cy.wait("@getMockService").then(({ response }) => {
            expect(response?.body.data.Service_Name).to.eq("Mock Service");
        });

        cy.wait("@getMockProviders").then(({ response }) => {
            expect(response?.body.data.data).to.have.length(2);
        });

        cy.get(".overview-module-scss-module__T4eVdW__cardTitle")
            .should("have.length", mockProviders.length)
            .then(($titles) => {
                expect($titles[0].innerText).to.contain("Provider 1");
                expect($titles[1].innerText).to.contain("Provider 2");
            });
    });
});
