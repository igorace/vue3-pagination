import TableWithPagination from "../TableWithPagination.vue";

// TODO: move it to fixtures
const mockData1 = {
  count: 15,
  results: [
    {
      id: 1,
      name: "example 1",
    },
    {
      id: 2,
      name: "example 2",
    },
    {
      id: 3,
      name: "example 3",
    },
    {
      id: 4,
      name: "example 4",
    },
    {
      id: 5,
      name: "example 5",
    },
    {
      id: 6,
      name: "example 6",
    },
    {
      id: 7,
      name: "example 7",
    },
    {
      id: 8,
      name: "example 8",
    },
    {
      id: 9,
      name: "example 9",
    },
    {
      id: 10,
      name: "example 10",
    },
  ],
};

const mockData2 = {
  count: 15,
  results: [
    {
      id: 11,
      name: "example 11",
    },
    {
      id: 12,
      name: "example 12",
    },
    {
      id: 13,
      name: "example 13",
    },
    {
      id: 14,
      name: "example 14",
    },
    {
      id: 15,
      name: "example 15",
    },
  ],
};

describe("Table with pagination component", () => {
  beforeEach(() => {
    cy.intercept("GET", "/users?page=0", {
      hostname: "localhost",
      port: 3000,
      statusCode: 200,
      body: mockData1,
    });
    cy.intercept("GET", "/users?page=1", {
      hostname: "localhost",
      port: 3000,
      statusCode: 200,
      body: mockData2,
    });
    cy.mount(TableWithPagination);
  });
  it("displays table with pagination", () => {
    cy.contains("th", "ID");
    cy.contains("th", "Name");
    cy.contains("button", "Start");
    cy.contains("button", "Previous");
    cy.contains("button", "Next");
    cy.contains("button", "End");
  });
  it("shows exactly 10 rows of data at start", () => {
    cy.get("tbody").find("tr").should("have.length", 10);
  });
  it("shows 5 items when click Next", () => {
    cy.get("button").contains("Next").click();
    cy.get("tbody").find("tr").should("have.length", 5);
  });
  it("shows 10 items when click Next -> Previous", () => {
    cy.get("button").contains("Next").click();
    cy.get("button").contains("Previous").click();
    cy.get("tbody").find("tr").should("have.length", 10);
  });
  it("should show Start and Previous controller as disabled at start", () => {
    cy.get("button").contains("Start").should("have.attr", "disabled");
    cy.get("button").contains("Previous").should("have.attr", "disabled");
  });
  it("should disable Next and End controller when we reach last page", () => {
    cy.get("button").contains("End").click();
    cy.get("button").contains("Next").should("have.attr", "disabled");
    cy.get("button").contains("End").should("have.attr", "disabled");
  });
  it("should enable Next and End controller when we reach last page and then click Previous", () => {
    cy.get("button").contains("End").click();
    cy.get("button").contains("Next").should("have.attr", "disabled");
    cy.get("button").contains("End").should("have.attr", "disabled");
    cy.get("button").contains("Previous").click();
    cy.get("button").contains("Next").should("not.have.attr", "disabled");
    cy.get("button").contains("End").should("not.have.attr", "disabled");
  });
});
