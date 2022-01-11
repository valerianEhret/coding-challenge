/// <reference types="cypress" />

describe("PDP", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  describe("when using the F020 format", () => {
    it("should allow to change options and continue to configure a product", () => {
      cy.findByRole("heading", { name: "Pure Happiness" });
      cy.findByText("Geburtskarte");
      cy.findByText(/20,00 €/);
      cy.findByLabelText(/format/i).should("have.value", "F020");
      cy.findByLabelText(/papier/i).should("have.value", "P01");
      cy.findByLabelText(/veredelung/i).should("have.value", "V00");
      cy.findByLabelText(/menge/i).should("have.value", "10");
      cy.findByLabelText(/papier/i)
        .select("P14")
        .should("have.value", "P14");
      cy.findByLabelText(/veredelung/i)
        .findByText(/Goldfolie/)
        .should("be.disabled");
      cy.findByText(/23,50 €/);
      cy.findByRole("link", { name: /jetzt gestalten/i }).click();
      cy.findByText(/format/);
      cy.findByText(/F020/);
      cy.findByText(/paper/);
      cy.findByText(/P14/);
      cy.findByText(/quantity/);
      cy.findByText(/10/);
    });
    describe("when selecting golden foil refinement", () => {
      it("should not allow to select structured paper", () => {
        cy.findByLabelText(/veredelung/i).select("V02");
        cy.findByLabelText(/papier/i)
          .findByText(/strukturiertes papier/i)
          .should("be.disabled");
      });
    });
    describe("when selecting structured paper first", () => {
      it("should not allow to select golden foil refinement", () => {
        cy.findByLabelText(/papier/i)
          .select("P14")
          .should("have.value", "P14");
        cy.findByLabelText(/veredelung/i)
          .findByText(/Goldfolie/)
          .should("be.disabled");
      });
    });
  });

  describe("when using the F030 format", () => {
    it("should allow to change options and continue to configure a product", () => {
      cy.findByRole("heading", { name: "Pure Happiness" });
      cy.findByText("Geburtskarte");
      cy.findByText(/20,00 €/);
      cy.findByLabelText(/format/i)
        .select("F030")
        .should("have.value", "F030");
      cy.findByText(/27,00 €/);
      cy.findByLabelText(/papier/i).should("have.value", "P01");
      cy.findByLabelText(/veredelung/i).should("have.value", "V00");
      cy.findByLabelText(/menge/i).should("have.value", "10");
      cy.findByLabelText(/papier/i)
        .select("P08")
        .should("have.value", "P08");
      cy.findByLabelText(/veredelung/i)
        .select("V02")
        .should("have.value", "V02");
      cy.findByText(/36,00 €/);
      cy.findByRole("link", { name: /jetzt gestalten/i }).click();
      cy.findByText(/format/);
      cy.findByText(/F030/);
      cy.findByText(/paper/);
      cy.findByText(/P08/);
      cy.findByText(/refinement/);
      cy.findByText(/V02/);
      cy.findByText(/quantity/);
      cy.findByText(/10/);
    });
  });
});
