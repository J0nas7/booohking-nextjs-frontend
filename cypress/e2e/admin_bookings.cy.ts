import { BookingDTO } from "@/types";
import { expect } from "chai";

describe("Admin Bookings Page", () => {
    beforeEach(() => {
        // Cache login session
        cy.session("auth-admin", () => {
            cy.login("jonas-adm@booohking.com", "abc123def");
        });

        // Intercept admin bookings API
        cy.intercept("GET", "http://localhost:8080/api/bookings").as("getAdminBookings");

        cy.visit("/admin");
    });

    it("renders bookings from real API with full structure", () => {
        cy.wait("@getAdminBookings", { timeout: 10000 }).then(({ response }) => {
            expect(response).to.not.be.undefined;
            expect(response?.statusCode).to.eq(200);

            const body = response?.body;
            expect(body).to.have.property("success", true);
            expect(body).to.have.property("message").that.is.a("string");

            const data = body.data;
            expect(data).to.have.property("data").that.is.an("array");
            expect(data).to.have.property("pagination").that.is.an("object");

            // Pagination checks
            expect(data.pagination).to.include.keys("total", "perPage", "currentPage");

            // Booking object shape (spot-check first item)
            if (data.data.length > 0) {
                const booking = data.data[0];
                expect(booking).to.have.property("Booking_ID");
                expect(booking).to.have.property("User_ID");
                expect(booking).to.have.property("Service_ID");
                expect(booking).to.have.property("Provider_ID");
                expect(booking).to.have.property("Booking_StartAt");
                expect(booking).to.have.property("Booking_EndAt");
                expect(booking).to.have.property("Booking_Status").that.is.a("string");
                expect(booking).to.have.property("user");
                expect(booking).to.have.property("service");
                expect(booking).to.have.property("provider");
            }
        });
    });

    it("renders upcoming and past bookings sections", () => {
        cy.contains("h2", "Upcoming bookings").should("be.visible");
        cy.wait("@getAdminBookings", { timeout: 10000 }).then(() => {
            cy.contains("h2", "Past bookings").should("be.visible");
        });
    });

    it("renders booking cards with correct content", () => {
        cy.wait("@getAdminBookings", { timeout: 10000 }).then(({ response }) => {
            cy.get(".myBookings-module-scss-module__DxLNEW__bookingCard")
                .should("have.length.greaterThan", 0);

            cy.get(".myBookings-module-scss-module__DxLNEW__bookingCard")
                .first()
                .within(() => {
                    cy.get(".myBookings-module-scss-module__DxLNEW__serviceName").should("exist").and("not.be.empty");
                    cy.get(".myBookings-module-scss-module__DxLNEW__providerName").should("exist").and("not.be.empty");
                    cy.contains("Date:");
                    cy.contains("Time:");
                    cy.contains("Booked by:"); // Admin-specific
                });
        });
    });

    it("shows correct status chips and cancel button behavior", () => {
        cy.wait("@getAdminBookings", { timeout: 10000 }).then(() => {
            cy.get(".myBookings-module-scss-module__DxLNEW__statusChip").each(($chip, index) => {
                // Re-query the chip by index to avoid detached DOM errors
                cy.get(".myBookings-module-scss-module__DxLNEW__statusChip").eq(index).within(() => {
                    cy.get("span")
                        .invoke("text")
                        .then((text) => {
                            expect(["BOOKED", "CANCELLED"]).to.include(text.trim());
                        });

                    cy.get("span").invoke("text").then((statusText) => {
                        if (statusText.includes("BOOKED")) {
                            cy.get("button").should("contain.text", "Cancel booking");
                        } else {
                            cy.get("button").should("not.exist");
                        }
                    });
                });
            });

        });
    });

    it("renders mocked bookings correctly", () => {
        const mockBookings: BookingDTO[] = [
            {
                Booking_ID: 1,
                User_ID: 2,
                Service_ID: 5,
                Provider_ID: 11,
                Booking_StartAt: "2025-12-26T10:00:00Z",
                Booking_EndAt: "2025-12-26T10:30:00Z",
                Booking_Status: "booked",
                user: { name: "Jonas Admin", email: "jonas-adm@booohking.com", password: "-", role: "ROLE_USER" },
                service: { Service_Name: "Waitress", Service_DurationMinutes: 15 },
                provider: { Provider_Name: "Gerlach LLC", Provider_Timezone: "CET" },
            },
            {
                Booking_ID: 2,
                User_ID: 3,
                Service_ID: 2,
                Provider_ID: 4,
                Booking_StartAt: "2025-12-21T10:30:00Z",
                Booking_EndAt: "2025-12-21T11:00:00Z",
                Booking_Status: "cancelled",
                user: { name: "Abbie", email: "mmills@example.net", password: "-", role: "ROLE_USER" },
                service: { Service_Name: "Equal Opportunity Representative", Service_DurationMinutes: 30 },
                provider: { Provider_Name: "Wunsch, Wisozk and O'Conner", Provider_Timezone: "CET" },
            },
        ];

        cy.intercept("GET", "http://localhost:8080/api/bookings", {
            statusCode: 200,
            body: {
                success: true,
                message: "Bookings found",
                data: { data: mockBookings, pagination: { total: mockBookings.length, perPage: 10, currentPage: 1, lastPage: 1 } },
            },
        }).as("getMockAdminBookings");

        cy.visit("/admin");

        cy.wait("@getMockAdminBookings", { timeout: 10000 });

        cy.get(".myBookings-module-scss-module__DxLNEW__bookingCard")
            .should("have.length", mockBookings.length);

        cy.contains("Waitress");
        cy.contains("Gerlach LLC");
        cy.contains("Jonas Admin");
        cy.contains("Equal Opportunity Representative");
        cy.contains("Abbie");
    });
});
