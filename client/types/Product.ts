// To parse this data:
//
//   import { Convert } from "./file";
//
//   const product = Convert.toProduct(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Product {
  id: string;
  defaultSelectedProductOptions: DefaultSelectedProductOptions;
  variants: Variant[];
  name: string;
  description: string;
  groupName: string;
}

export interface DefaultSelectedProductOptions {
  format: string;
  paper: string;
  refinement: string;
  quantity: number;
}

export interface Variant {
  format: string;
  formatLabel: string;
  dimension: string;
  image: string;
  productOptions: ProductOptions;
  prices: Price[];
}

export interface Price {
  price: number;
  quantity: number;
  label: string;
}

export interface ProductOptions {
  papers: Color[];
  refinements: Color[];
}

export interface Color {
  key: string;
  description: string;
  price: number;
  label: string;
  isRefinable?: boolean;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toProduct(json: string): Product[] {
    return cast(JSON.parse(json), a(r("Product")));
  }

  public static productToJson(value: Product[]): string {
    return JSON.stringify(uncast(value, a(r("Product"))), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ""): never {
  if (key) {
    throw Error(
      `Invalid value for key "${key}". Expected type ${JSON.stringify(
        typ
      )} but got ${JSON.stringify(val)}`
    );
  }
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`
  );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ""): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue("array", val);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue("Date", val);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue("object", val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty("props")
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Product: o(
    [
      { json: "id", js: "id", typ: "" },
      {
        json: "defaultSelectedProductOptions",
        js: "defaultSelectedProductOptions",
        typ: r("DefaultSelectedProductOptions"),
      },
      { json: "variants", js: "variants", typ: a(r("Variant")) },
      { json: "name", js: "name", typ: "" },
      { json: "description", js: "description", typ: "" },
      { json: "groupName", js: "groupName", typ: "" },
    ],
    false
  ),
  DefaultSelectedProductOptions: o(
    [
      { json: "format", js: "format", typ: "" },
      { json: "paper", js: "paper", typ: "" },
      { json: "refinement", js: "refinement", typ: "" },
      { json: "quantity", js: "quantity", typ: 0 },
    ],
    false
  ),
  Variant: o(
    [
      { json: "format", js: "format", typ: "" },
      { json: "formatLabel", js: "formatLabel", typ: "" },
      { json: "dimension", js: "dimension", typ: "" },
      { json: "image", js: "image", typ: "" },
      {
        json: "productOptions",
        js: "productOptions",
        typ: r("ProductOptions"),
      },
      { json: "prices", js: "prices", typ: a(r("Price")) },
    ],
    false
  ),
  Price: o(
    [
      { json: "price", js: "price", typ: 0 },
      { json: "quantity", js: "quantity", typ: 0 },
      { json: "label", js: "label", typ: "" },
    ],
    false
  ),
  ProductOptions: o(
    [
      { json: "papers", js: "papers", typ: a(r("Color")) },
      { json: "refinements", js: "refinements", typ: a(r("Color")) },
    ],
    false
  ),
  Color: o(
    [
      { json: "key", js: "key", typ: "" },
      { json: "description", js: "description", typ: "" },
      { json: "price", js: "price", typ: 0 },
      { json: "label", js: "label", typ: "" },
      { json: "isRefinable", js: "isRefinable", typ: u(undefined, true) },
    ],
    false
  ),
};
