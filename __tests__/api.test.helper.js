function hasSimilarStructure(obj1, obj2) {
  //function checks if obj2 has a similar structure to obj1. Note obj2 may have addition keys

  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }
    if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
      if (!hasSimilarStructure(obj1[key], obj2[key])) {
        return false;
      }
    }
  }

  return true;
}

describe("hasSimilarStructure()", () => {
  test("Should return false when objects do not share similar structure", () => {
    const obj1 = { a: { b: "hello" } };
    const obj2 = { a: { c: "world" } };

    expect(hasSimilarStructure(obj1, obj2)).toBe(false);
  });
  test("Should return true when objects share similar structure", () => {
    const obj1 = { a: { b: "hello" } };
    const obj2 = { a: { b: "world", c: "extra" }, d: "extra" };

    expect(hasSimilarStructure(obj1, obj2)).toBe(true);
  });
});

module.exports = { hasSimilarStructure };
