import { describe, expect, it } from "vitest";
import { isLinkName, linkSlug, newLinkName, normalizeLinkName } from "@/lib/invitation-link";

describe("linkSlug", () => {
  it("lowercases and joins words with hyphens", () => {
    expect(linkSlug("The Etzion Family")).toBe("the-etzion-family");
  });

  it("turns punctuation into single hyphens and trims them from the ends", () => {
    expect(linkSlug("Alex Rivera (Miami)")).toBe("alex-rivera-miami");
    expect(linkSlug("  O'Brien & Sons!  ")).toBe("o-brien-sons");
  });

  it("drops accents", () => {
    expect(linkSlug("José Muñoz")).toBe("jose-munoz");
  });

  it("caps the length without leaving a trailing hyphen", () => {
    const slug = linkSlug("The Very Long Household Name Of The Extended Family Branch");
    expect(slug.length).toBeLessThanOrEqual(40);
    expect(slug).not.toMatch(/-$/);
  });

  it("falls back when nothing usable is left", () => {
    expect(linkSlug("!!!")).toBe("invitation");
    expect(linkSlug("李家")).toBe("invitation");
  });
});

describe("newLinkName", () => {
  it("adds a 6-character code without look-alike characters", () => {
    for (let i = 0; i < 200; i++) {
      expect(newLinkName("The Etzion Family")).toMatch(/^the-etzion-family-[a-hjkmnp-tv-z2-9]{6}$/);
    }
  });

  it("gives every invitation a different link", () => {
    const links = new Set(Array.from({ length: 1000 }, () => newLinkName("Rivera Family")));
    expect(links.size).toBe(1000);
  });
});

describe("normalizeLinkName", () => {
  it("ignores case and outer spaces", () => {
    expect(normalizeLinkName("  The-Etzion-Family-K7M2QX ")).toBe("the-etzion-family-k7m2qx");
  });
});

describe("isLinkName", () => {
  it("accepts links that newLinkName makes", () => {
    for (const name of ["The Etzion Family", "Alex Rivera (Miami)", "!!!", "The Very Long Household Name Of The Extended Family Branch"]) {
      expect(isLinkName(newLinkName(name))).toBe(true);
    }
  });

  it("rejects a name without its code", () => {
    expect(isLinkName("the-etzion-family")).toBe(false);
  });

  it("rejects codes with the wrong length or characters", () => {
    expect(isLinkName("the-etzion-family-k7m2q")).toBe(false);
    expect(isLinkName("the-etzion-family-k7m2qx9")).toBe(false);
    expect(isLinkName("the-etzion-family-k7m2q0")).toBe(false);
    expect(isLinkName("the-etzion-family-K7M2QX")).toBe(false);
  });

  it("rejects anything else", () => {
    for (const bad of ["", "-k7m2qx", "the--family-k7m2qx", "the etzion-k7m2qx", "../admin-k7m2qx", `${"a".repeat(41)}-k7m2qx`]) {
      expect(isLinkName(bad)).toBe(false);
    }
  });
});
