import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Product } from "../../types/Product";
import { render } from "../../utils/test-utils";
import Products from "./[id]";

const product: Product = {
  id: "MGG73GG",
  defaultSelectedProductOptions: {
    format: "F020",
    paper: "P01",
    refinement: "V00",
    quantity: 10,
  },
  variants: [
    {
      format: "F020",
      formatLabel: "Postkarte flach",
      dimension: "148 x 105mm",
      image:
        "https://assets.kartenmacherei.de/produktbilder/MGG73GG-LargePortraitGreyDetailImage/Geburtskarte-Pure-Happiness-weiss-0200100001de_DE.jpg",
      productOptions: {
        papers: [
          {
            key: "P01",
            description: "Unser Standardpapier",
            price: 0,
            label: "mattes Feinstpapier (wei\u00df)",
            isRefinable: true,
          },
          {
            key: "P14",
            description: "Unser strukturiertes Papier",
            price: 35,
            label: "strukturiertes Papier (wei\u00df)",
            isRefinable: false,
          },
          {
            key: "P08",
            description: "Unser seidenmattes Fotopapier",
            price: 40,
            label: "seidenmattes Fotopapier (wei\u00df)",
            isRefinable: true,
          },
        ],
        refinements: [
          {
            key: "V00",
            description: "",
            price: 0,
            label: "keine Veredelung",
          },
          {
            key: "V02",
            description: "Unsere Goldfolie",
            price: 50,
            label: "Goldfolie",
          },
        ],
      },
      prices: [
        {
          price: 250,
          quantity: 5,
          label: "5",
        },
        {
          price: 200,
          quantity: 10,
          label: "10",
        },
        {
          price: 188,
          quantity: 15,
          label: "15",
        },
      ],
    },
    {
      format: "F030",
      formatLabel: "Quadratische Postkarte",
      dimension: "145 x 145mm",
      image:
        "https://assets.kartenmacherei.de/produktbilder/MGG73GG-LargePortraitGreyDetailImage/Geburtskarte-Pure-Happiness-weiss-1410100001de_DE.jpg?t=1612859308796",
      productOptions: {
        papers: [
          {
            key: "P01",
            description: "Unser Standardpapier",
            price: 0,
            label: "mattes Feinstpapier (wei\u00df)",
            isRefinable: true,
          },
          {
            key: "P14",
            description: "Unser strukturiertes Papier",
            price: 35,
            label: "strukturiertes Papier (wei\u00df)",
            isRefinable: false,
          },
          {
            key: "P08",
            description: "Unser seidenmattes Fotopapier",
            price: 40,
            label: "seidenmattes Fotopapier (wei\u00df)",
            isRefinable: true,
          },
        ],
        refinements: [
          {
            key: "V00",
            description: "",
            price: 0,
            label: "keine Veredelung",
          },
          {
            key: "V02",
            description:
              "Unsere Goldfolie verleiht Ihrer Karte einen besonders edlen Effekt und macht sie zu einem glanzvollen Unikat.",
            price: 50,
            label: "Goldfolie",
          },
        ],
      },
      prices: [
        {
          price: 338,
          quantity: 5,
          label: "5",
        },
        {
          price: 270,
          quantity: 10,
          label: "10",
        },
        {
          price: 254,
          quantity: 15,
          label: "15",
        },
      ],
    },
  ],
  name: "Pure Happiness",
  description:
    '"Pure Happiness" bietet viel Platz f\u00fcr die sch\u00f6nten Fotos Ihres Schatzes. Verbreiten Sie pure Freude an Ihre Liebsten.',
  groupName: "Geburtskarte",
};

describe("Products", () => {
  it("renders product information", () => {
    render(<Products product={product} />);
    screen.getByRole("heading", { name: product.name });
    screen.getByText(product.groupName);
    screen.getByText(/20,00 €/);
    expect(screen.getByLabelText(/format/i)).toHaveValue("F020");
    expect(screen.getByLabelText(/papier/i)).toHaveValue("P01");
    expect(screen.getByLabelText(/veredelung/i)).toHaveValue("V00");
    expect(screen.getByLabelText(/menge/i)).toHaveValue("10");
    expect(
      screen.getByRole("link", { name: /jetzt gestalten/i })
    ).toHaveAttribute(
      "href",
      "/configure?id=MGG73GG&format=F020&paper=P01&refinement=V00&quantity=10"
    );
  });
  describe("when selecting a production option with additional price", () => {
    it("should update the price and the configure link", () => {
      render(<Products product={product} />);
      userEvent.selectOptions(screen.getByLabelText(/papier/i), "P08");
      userEvent.selectOptions(screen.getByLabelText(/veredelung/i), "V02");
      userEvent.selectOptions(screen.getByLabelText(/menge/i), "15");
      screen.getByText(/41,70 €/);
      expect(
        screen.getByRole("link", { name: /jetzt gestalten/i })
      ).toHaveAttribute(
        "href",
        "/configure?id=MGG73GG&format=F020&paper=P08&refinement=V02&quantity=15"
      );
    });
  });
});
