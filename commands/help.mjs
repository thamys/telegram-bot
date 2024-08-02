const apiOptions = {
  "ability-scores": "/api/ability-scores",
  alignments: "/api/alignments",
  backgrounds: "/api/backgrounds",
  classes: "/api/classes",
  conditions: "/api/conditions",
  "damage-types": "/api/damage-types",
  equipment: "/api/equipment",
  "equipment-categories": "/api/equipment-categories",
  feats: "/api/feats",
  features: "/api/features",
  languages: "/api/languages",
  "magic-items": "/api/magic-items",
  "magic-schools": "/api/magic-schools",
  monsters: "/api/monsters",
  proficiencies: "/api/proficiencies",
  races: "/api/races",
  "rule-sections": "/api/rule-sections",
  rules: "/api/rules",
  skills: "/api/skills",
  spells: "/api/spells",
  subclasses: "/api/subclasses",
  subraces: "/api/subraces",
  traits: "/api/traits",
  "weapon-properties": "/api/weapon-properties",
};

function getOptions() {
  return Object.keys(apiOptions);
}

export default function () {
  let response = "\n\nAvailable commands:";
  response += "\n\n/help - List available commands";
  const options = getOptions();
  options.forEach((option) => {
    response += `\n\n/${option} - Get ${option}`;
  });
  return response;
}
