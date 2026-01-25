/**
 * @typedef {Object} BrandConfig
 * @property {string} key
 * @property {string} name
 * @property {string} tagline
 * @property {string} apiLabel
 */

/** @type {Record<string, BrandConfig>} */
const BRAND_CONFIG = {
  default: {
    key: "default",
    name: "Hygie Inventaire",
    tagline: "Pilotage du matériel et conformité en temps réel.",
    apiLabel: "API DRF principale",
  },
  aasc: {
    key: "aasc",
    name: "Hygie Inventaire · AASC",
    tagline: "Tableau de bord pour AASC et ambulanciers privés.",
    apiLabel: "API DRF · Réseau AASC",
  },
  ambulance: {
    key: "ambulance",
    name: "Hygie Inventaire · Ambulance",
    tagline: "Suivi opérationnel du parc et du matériel embarqué.",
    apiLabel: "API DRF · Parc ambulance",
  },
};

/**
 * @param {string} brand
 * @returns {BrandConfig}
 */
function getBrandConfig(brand) {
  return BRAND_CONFIG[brand] ?? BRAND_CONFIG.default;
}

module.exports = { BRAND_CONFIG, getBrandConfig };
