import { BookingDTO } from '@/types';
import { expect } from "chai";

describe("My Bookings Page", () => {
    beforeEach(() => {
        // Cache login session
        cy.session("auth-user", () => {
            cy.login("jonas-adm@booohking.com", "abc123def");
        });

        // Intercept real bookings API
        cy.intercept(
            "GET",
            "http://localhost:8080/api/bookings/users/1"
        ).as("getBookings");

        cy.visit("/my-bookings");
    });

    it("renders bookings from real API with full structure", () => {
        cy.wait("@getBookings", { timeout: 10000 }).then(({ response }) => {
            expect(response).to.not.be.undefined;
            expect(response?.statusCode).to.eq(200);

            const body = response?.body;
            expect(body).to.have.property("success", true);
            expect(body).to.have.property("message").that.is.a("string");

            const data = body.data;
            expect(data).to.have.property("data").that.is.an("array");
            expect(data).to.have.property("pagination").that.is.an("object");

            // Pagination checks
            expect(data.pagination).to.include.keys(
                "total",
                "perPage",
                "currentPage"
            );

            // Booking object shape (spot-check first item)
            if (data.data.length > 0) {
                const booking = data.data[0];

                expect(booking).to.have.property("Booking_ID");
                expect(booking).to.have.property("Service_ID");
                expect(booking).to.have.property("Provider_ID");
                expect(booking).to.have.property("Booking_StartAt");
                expect(booking).to.have.property("Booking_EndAt");
                expect(booking).to.have.property("Booking_Status").that.is.a("string");
            }
        });
    });

    it("renders upcoming and past bookings sections", () => {
        cy.contains("h2", "Upcoming bookings").should("be.visible");
        cy.wait("@getBookings", { timeout: 10000 }).then(({ response }) => {
            cy.contains("h2", "Past bookings").should("be.visible");
        });
    });

    it("renders booking cards with correct content", () => {
        cy.get(".myBookings-module-scss-module__DxLNEW__bookingCard")
            .should("have.length.greaterThan", 0);

        cy.get(".myBookings-module-scss-module__DxLNEW__bookingCard")
            .first()
            .within(() => {
                cy.get(".myBookings-module-scss-module__DxLNEW__serviceName")
                    .should("exist")
                    .and("not.be.empty");

                cy.get(".myBookings-module-scss-module__DxLNEW__providerName")
                    .should("exist")
                    .and("not.be.empty");

                cy.contains("Date:");
                cy.contains("Time:");
            });

    });

    it("shows correct status chips and cancel button behavior", () => {
        cy.wait("@getBookings", { timeout: 10000 }).then(({ response }) => {
            cy.get(".myBookings-module-scss-module__DxLNEW__statusChip").each(($chip) => {
                cy.wrap($chip)
                    .find("span")
                    .invoke("text")
                    .then((text) => {
                        expect(["BOOKED", "CANCELLED"]).to.include(text.trim());
                    });

                // Cancel button only for BOOKED
                cy.wrap($chip).then(($el) => {
                    if ($el.text().includes("BOOKED")) {
                        cy.wrap($el)
                            .find("button")
                            .should("contain.text", "Cancel booking");
                    } else {
                        cy.wrap($el).find("button").should("not.exist");
                    }
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
                service: { Service_Name: "Waitress", Service_DurationMinutes: 15 },
                provider: { Provider_Name: "Gerlach LLC", Provider_Timezone: "CET" },
            },
            {
                Booking_ID: 2,
                User_ID: 2,
                Service_ID: 2,
                Provider_ID: 4,
                Booking_StartAt: "2025-12-21T10:30:00Z",
                Booking_EndAt: "2025-12-21T11:00:00Z",
                Booking_Status: "cancelled",
                service: { Service_Name: "Equal Opportunity Representative", Service_DurationMinutes: 30 },
                provider: { Provider_Name: "Wunsch, Wisozk and O'Conner", Provider_Timezone: "CET" },
            },
        ];

        cy.intercept(
            "GET",
            "http://localhost:8080/api/bookings/users/1",
            {
                statusCode: 200,
                body: {
                    success: true,
                    message: "Bookings found",
                    data: {
                        data: mockBookings,
                        pagination: {
                            total: mockBookings.length,
                            perPage: 10,
                            currentPage: 1,
                            lastPage: 1,
                        },
                    },
                },
            }
        ).as("getMockBookings");

        cy.visit("/my-bookings");

        cy.wait("@getMockBookings", { timeout: 10000 });

        cy.get(".myBookings-module-scss-module__DxLNEW__bookingCard")
            .should("have.length", mockBookings.length);

        cy.contains("Waitress");
        cy.contains("Gerlach LLC");
        cy.contains("Equal Opportunity Representative");
    });
});
