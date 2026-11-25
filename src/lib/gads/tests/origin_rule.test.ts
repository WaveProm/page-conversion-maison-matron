import { describe, expect, it } from "vitest";
import { origin_of_search, page_name_of } from "../origin_rule";

describe("origin_of_search", () => {
  it("takes gclid from gclid, else from lnid, and never keeps lnid under its name", () => {
    expect(origin_of_search("?gclid=TEST-CLIC-001&lnid=TEST-CLIC-002")).toBe(
      "gclid=TEST-CLIC-001",
    );
    expect(origin_of_search("?lnid=TEST-CLIC-002")).toBe("gclid=TEST-CLIC-002");
    expect(origin_of_search("?gclid=&lnid=TEST-CLIC-002")).toBe(
      "gclid=TEST-CLIC-002",
    );
    expect(origin_of_search("?lnid=TEST-CLIC-002")).not.toContain("lnid");
  });

  it("keeps gbraid and wbraid under their own keys and never copies them into gclid", () => {
    expect(origin_of_search("?gbraid=BRAID-G&wbraid=BRAID-W")).toBe(
      "gbraid=BRAID-G&wbraid=BRAID-W",
    );
    expect(origin_of_search("?wbraid=BRAID-W")).toBe("wbraid=BRAID-W");
    expect(origin_of_search("?gbraid=BRAID-G&lnid=L")).toBe(
      "gclid=L&gbraid=BRAID-G",
    );
  });

  it("keeps the eight keys in dictionary order and drops every other parameter", () => {
    expect(
      origin_of_search(
        "?utm_term=canape&foo=bar&utm_content=video&utm_medium=cpc&utm_campaign=hiver&utm_source=google&fbclid=TEST-META-001&wbraid=W&gbraid=B&gclid=TEST-CLIC-001",
      ),
    ).toBe(
      "gclid=TEST-CLIC-001&gbraid=B&wbraid=W&fbclid=TEST-META-001&utm_source=google&utm_campaign=hiver&utm_content=video&utm_term=canape",
    );
  });

  it("answers an empty origin for a URL that carries none of the parameters", () => {
    expect(origin_of_search("")).toBe("");
    expect(origin_of_search("?page=2&utm_medium=cpc")).toBe("");
  });

  it("drops a blank value and a value over 500 characters, trims the others", () => {
    expect(origin_of_search("?gclid=%20%20&utm_source=%20google%20")).toBe(
      "utm_source=google",
    );
    expect(origin_of_search(`?fbclid=${"a".repeat(501)}`)).toBe("");
    expect(origin_of_search(`?fbclid=${"a".repeat(500)}`)).toBe(
      `fbclid=${"a".repeat(500)}`,
    );
  });

  it("is its own fixed point, so a stored origin is read with the same rule", () => {
    const stored = origin_of_search(
      "?gclid=A%26B%3DC&utm_campaign=Soldes%20d%27hiver",
    );
    expect(origin_of_search(stored)).toBe(stored);
    expect(new URLSearchParams(stored).get("utm_campaign")).toBe(
      "Soldes d'hiver",
    );
  });
});

describe("page_name_of", () => {
  it("names the home accueil and a route by its path in lower case without accent or outer slash", () => {
    expect(page_name_of("/")).toBe("accueil");
    expect(page_name_of("")).toBe("accueil");
    expect(page_name_of("/Contact")).toBe("contact");
    expect(page_name_of("/Rénovation/Cuisine-Équipée/")).toBe(
      "renovation/cuisine-equipee",
    );
    expect(page_name_of("/r%C3%A9novation")).toBe("renovation");
    expect(page_name_of("/Devis%E0%A4%A")).toBe("devis%e0%a4%a");
  });

  it("leaves a page name unchanged, so the server can name a value the browser already named", () => {
    expect(page_name_of("accueil")).toBe("accueil");
    expect(page_name_of("renovation/cuisine-equipee")).toBe(
      "renovation/cuisine-equipee",
    );
  });
});
