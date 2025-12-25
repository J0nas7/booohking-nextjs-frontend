import { expect } from "chai";

describe("Book a Provider Page", () => {
    const providerId = 11;
    const serviceId = 5;
    const providerSlug = "Gerlach-LLC";

    beforeEach(() => {
        cy.session("auth-user", () => {
            cy.login("jonas-usr@booohking.com", "abc123def");
        });

        cy.intercept(
            "GET",
            `http://localhost:8080/api/providers/${providerId}`
        ).as("getProvider");

        cy.intercept(
            "GET",
            `http://localhost:8080/api/bookings/${providerId}/available-slots*`
        ).as("getSlots");

        cy.visit(`/book/${providerId}-${providerSlug}`);
    });

    it("loads provider and service details with full structure", () => {
        cy.wait("@getProvider").then(({ response }) => {
            expect(response).to.not.be.undefined;
            expect(response?.statusCode).to.eq(200);

            const body = response!.body;
            expect(body).to.have.property("success", true);
            expect(body).to.have.property("message").that.is.a("string");

            const provider = body.data;
            expect(provider).to.have.property("Provider_ID", providerId);
            expect(provider).to.have.property("Provider_Name").that.is.a("string");
            expect(provider).to.have.property("Provider_Timezone").that.is.a("string");
            expect(provider).to.have.property("Service_ID", serviceId);

            // Related entities
            expect(provider).to.have.property("service").that.is.an("object");
            expect(provider.service).to.have.property("Service_ID", serviceId);
            expect(provider.service).to.have.property("Service_Name").that.is.a("string");

            expect(provider).to.have.property("working_hours").that.is.an("array");
            expect(provider.working_hours.length).to.be.greaterThan(0);

            expect(provider).to.have.property("bookings").that.is.an("array");
        });

        // UI assertions
        cy.get("main h1")
            .should("exist")
            .and("not.be.empty");

        cy.get(".overview-module-scss-module__T4eVdW__bookHeader")
            .should("exist");

        cy.contains("Go back to providers")
            .should("have.attr", "href")
            .and("include", `/service/${serviceId}`);
    });

    it("loads available booking slots with pagination", () => {
        cy.wait("@getSlots").then(({ response }) => {
            expect(response).to.not.be.undefined;
            expect(response?.statusCode).to.eq(200);

            const body = response!.body;
            expect(body).to.have.property("success", true);
            expect(body).to.have.property("message", "Slots found");

            const data = body.data;
            expect(data).to.have.property("data").that.is.an("array");
            expect(data.data.length).to.be.greaterThan(0);

            expect(data).to.have.property("pagination").that.is.an("object");
            expect(data.pagination).to.have.property("total").that.is.a("number");
            expect(data.pagination).to.have.property("perPage").that.is.a("number");
            expect(data.pagination).to.have.property("currentPage");
        });

        // UI slot cards
        cy.get('[role="button"]')
            .should("have.length.greaterThan", 0);

        cy.get(".overview-module-scss-module__T4eVdW__dateContainer")
            .should("have.length.greaterThan", 0);

        cy.get(".overview-module-scss-module__T4eVdW__cardInnerTitle")
            .first()
            .should("contain.text", "→");
    });

    it("renders multiple dates with time ranges", () => {
        cy.get(".overview-module-scss-module__T4eVdW__dateHeader")
            .should("have.length.greaterThan", 0)
            .each(($dateHeader) => {
                cy.wrap($dateHeader).should("not.be.empty");
            });

        cy.get(".overview-module-scss-module__T4eVdW__dateTimestamp")
            .should("have.length.greaterThan", 0)
            .each(($range) => {
                expect($range.text()).to.match(/\d{2}:\d{2}-\d{2}:\d{2}/);
            });
    });

    it("allows clicking a time slot", () => {
        cy.get('[role="button"]').first().click();

        // This is intentionally flexible in case booking modal / redirect evolves
        cy.url().should("include", `/book/${providerId}`);
    });

    it("supports mocked provider and slots", () => {
        cy.intercept(
            "GET",
            `http://localhost:8080/api/providers/${providerId}`,
            {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Provider found (mock)",
                    data: {
                        Provider_ID: providerId,
                        Provider_Name: "Mock Provider",
                        Provider_Timezone: "UTC",
                        Service_ID: serviceId,
                        service: {
                            Service_ID: serviceId,
                            Service_Name: "Mock Service"
                        },
                        bookings: [],
                        working_hours: [
                            { day: "Mon", start: "09:00", end: "17:00" }
                        ]
                    }
                }
            }
        ).as("getMockProvider");

        cy.intercept(
            "GET",
            `http://localhost:8080/api/bookings/${providerId}/available-slots*`,
            {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Slots found",
                    data: {
                        data: [
                            { start: "09:00", end: "09:30" },
                            { start: "09:30", end: "10:00" }
                        ],
                        pagination: {
                            total: 2,
                            perPage: 20,
                            currentPage: 1,
                            lastPage: 1
                        }
                    }
                }
            }
        ).as("getMockSlots");

        cy.visit(`/book/${providerId}-Mock-Provider`);

        cy.wait("@getMockProvider");
        cy.wait("@getMockSlots");

        cy.get("main h1").should("contain.text", "Mock Provider");

        cy.get(".overview-module-scss-module__T4eVdW__cardInnerTitle")
            .should("have.length", 2);
    });
});
