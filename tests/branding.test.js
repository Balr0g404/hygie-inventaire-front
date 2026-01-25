const assert = require("node:assert/strict");
const test = require("node:test");

const { getBrandConfig } = require("../lib/branding");

test("getBrandConfig falls back to default", () => {
  const config = getBrandConfig("inconnu");

  assert.equal(config.key, "default");
  assert.ok(config.name.includes("Hygie"));
});

test("getBrandConfig returns AASC config", () => {
  const config = getBrandConfig("aasc");

  assert.equal(config.key, "aasc");
  assert.equal(config.apiLabel, "API DRF · Réseau AASC");
});
