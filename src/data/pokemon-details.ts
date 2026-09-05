/** User-submitted competitive sets scraped from pokemondb.net pokebase "What is a good moveset for X?" threads.
 *  Builds are the top-voted answers (up to 3). The summary is the first sentence of each answer's prose.
 *  Source data: /tmp/pkm-details.json (not committed). */
export interface MovesetBuild {
  ability?: string;
  item?: string;
  nature?: string;
  evs?: string;
  iv?: string;
  moves: string[];
  votes: number;
  summary?: string;
}

export interface PokemonDetails {
  pokedexUrl: string;
  movesetUrl?: string;
  builds: MovesetBuild[];
}

export const POKEMON_DETAILS: Record<string, PokemonDetails> = {
  "Hisuian Typhlosion": {
    pokedexUrl: "https://pokemondb.net/pokedex/typhlosion",
    movesetUrl:
      "https://pokemondb.net/pokebase/416926/what-is-a-good-moveset-for-hisuian-typhlosion",
    builds: [
      {
        ability: "Blaze",
        item: "Leftovers / Heavy-Duty Boots",
        nature: "Timid",
        evs: "152 HP / 104 SpA / 252 Spe",
        moves: ["Calm Mind", "Substitute", "Flamethrower", "Shadow Ball"],
        votes: 3,
        summary:
          "Something that Hisuian Typhlosion has over regular Typhlosion is access to Calm Mind.",
      },
      {
        ability: "Blaze",
        item: "Choice Scarf",
        nature: "Timid",
        evs: "252 SpA / 4 SpD / 252 Spe",
        moves: [
          "Eruption",
          "Fire Blast / Flamethrower",
          "Shadow Ball",
          "Focus Blast / Tera Blast",
        ],
        votes: 2,
        summary:
          "One of the downsides of Hisuian Typhlosion is it being 5 points slower than regular Typhlosion, but this can be mostly remedied with a Choice Scarf.",
      },
      {
        ability: "Blaze",
        item: "Life Orb",
        nature: "Hasty",
        evs: "212 Atk / 44 SpA / 252 Spe",
        moves: ["Flamethrower", "Shadow Ball", "Earthquake", "Low Kick"],
        votes: 2,
        summary:
          "Hisuian Typhlosion's attack stat is actually decent, allowing it to (somewhat) viably run a mixed set.",
      },
    ],
  },
  Murkrow: {
    pokedexUrl: "https://pokemondb.net/pokedex/murkrow",
    movesetUrl:
      "https://pokemondb.net/pokebase/101616/what-is-a-good-lc-moveset-for-murkrow",
    builds: [
      {
        ability: "Super Luck",
        item: "Life Orb / Choice Scarf",
        evs: "240 Atk / 80 SAtk / 188 Spd",
        moves: [
          "Brave Bird",
          "Sucker Punch",
          "Heat Wave",
          "Hidden Power [Grass]",
        ],
        votes: 4,
      },
      {
        ability: "Prankster",
        item: "Berry Juice",
        nature: "Calm",
        evs: "252 HP / 128 Def / 128 SpD",
        moves: ["Thunder Wave", "Swagger", "Foul Play", "Roost"],
        votes: 2,
        summary:
          "This set really jacked me up in my early days of Pokemon Showdown, although it is a bit luck dependent.",
      },
    ],
  },
  Torkoal: {
    pokedexUrl: "https://pokemondb.net/pokedex/torkoal",
    movesetUrl:
      "https://pokemondb.net/pokebase/5287/what-is-a-good-moveset-for-torkoal",
    builds: [
      {
        ability: "White Smoke",
        item: "Focus Sash",
        nature: "Bold",
        evs: "4 HP / 252 Def / 252 SpA",
        moves: ["Stealth Rock", "Yawn", "Rapid Spin", "Overheat"],
        votes: 5,
        summary:
          "An excellent lead set. Stealth Rock and Yawn work well together. Rapid Spin removes entry hazards that the foe is likely to set up. Overheat takes down common Steel tyype leads suc",
      },
      {
        ability: "Drought",
        item: "Heat Rock / Sitrus Berry / Shuca Berry",
        nature: "Bold / Sassy",
        evs: "252 HP / 120 Def / 132 SpD",
        moves: [
          "Yawn",
          "Protect",
          "Burning Jealousy / Eruption",
          "Sunny Day / Will-O-Wisp / Bulldoze / Rock Tomb / Clear Smog",
        ],
        votes: 1,
        summary:
          "This is built for series 8 Doubles, where it will be a support Pokemon",
      },
      {
        item: "Iron Ball",
        nature: "Brave",
        evs: "252 Def / 200 SpD / 28 Atk / 28 SpA",
        moves: ["Curse", "Gyro Ball", "Earthquake", "Heat Wave"],
        votes: 0,
        summary: "Problem with this set is it's a mixed set.",
      },
    ],
  },
  "Hisuian Lilligant": {
    pokedexUrl: "https://pokemondb.net/pokedex/lilligant",
    movesetUrl:
      "https://pokemondb.net/pokebase/416928/what-is-a-good-moveset-for-hisuian-lilligant",
    builds: [
      {
        ability: "Chlorophyll",
        item: "Life Orb",
        nature: "Adamant",
        evs: "252 Atk / 4 SpD / 252 Spe",
        moves: [
          "Victory Dance / Swords Dance",
          "Leaf Blade",
          "Ice Spinner / Tera Blast",
          "Close Combat",
        ],
        votes: 2,
        summary:
          "Hisuian Lilligant is a very strong attacker that can sweep teams if given the opportunity.",
      },
      {
        ability: "Chlorophyll",
        item: "Life Orb",
        nature: "Adamant",
        evs: "36 HP / 252 Atk / 220 Spe",
        moves: ["Victory Dance", "Solar Blade", "Close Combat", "Tera Blast"],
        votes: 2,
        summary:
          "Basically the set fwoofy posted, but with a stronger Grass STAB and a different Tera Type for Tera Blast.",
      },
      {
        ability: "Chlorophyll",
        item: "Focus Sash",
        nature: "Jolly",
        evs: "252 Atk / 4 SpD / 252 Spe",
        moves: ["After You", "Solar Blade", "Sleep Powder", "Close Combat"],
        votes: 1,
        summary:
          "An amazing torkoal partner, forming the infamous lillikoal strategy.",
      },
    ],
  },
  Pachirisu: {
    pokedexUrl: "https://pokemondb.net/pokedex/pachirisu",
    movesetUrl:
      "https://pokemondb.net/pokebase/6551/what-is-a-good-moveset-for-pachirisu",
    builds: [
      {
        ability: "Volt Absorb",
        item: "Sitrus Berry",
        nature: "Impish",
        evs: "252 HP / 252 Def / 4 Sp.Def",
        moves: ["Follow Me", "Super Fang", "Nuzzle", "Protect"],
        votes: 7,
        summary:
          "Doubles Moveset (As seen winning the 2014 World Championship).",
      },
      {
        item: "Focus Sash",
        evs: "4 Def / 252 SDef / 252 Spd",
        moves: ["Super Fang", "Volt Switch", "Sweet Kiss", "Light Screen"],
        votes: 0,
      },
      {
        item: "Choice Band",
        evs: "4 HP / 252 Atk / 252 Spd",
        moves: ["Seed Bomb", "Gunk Shot", "ThunderPunch", "Iron Tail"],
        votes: 0,
        summary:
          "Pachirisu (M) @ Choice Band\n\n\n\nTrait: Static\n\nEVs: 4 HP / 252 Atk / 252 Spd\n\nJolly Nature (+Spd, -Atk)",
      },
    ],
  },
  "Hisuian Goodra": {
    pokedexUrl: "https://pokemondb.net/pokedex/goodra",
    movesetUrl:
      "https://pokemondb.net/pokebase/416931/what-is-a-good-moveset-for-hisuian-goodra",
    builds: [
      {
        ability: "Sap Sipper",
        item: "Leftovers",
        nature: "Sassy",
        evs: "252 HP / 4 Atk / 252 SpD",
        moves: [
          "Heavy Slam",
          "Dragon Tail",
          "Knock Off / Flamethrower / Toxic / Ice Beam / Earthquake",
          "Protect",
        ],
        votes: 1,
        summary:
          "The Specially Defensive set Hisuian Goodra uses in National Dex Monotype.",
      },
      {
        ability: "Sap slipper",
        item: "leftovers",
        evs: "252 HP / 252 Atk / 4 SpD",
        moves: [
          "Curse",
          "Dragon claw",
          "Gyro ball",
          "Earthquake / Fire punch / Knock off",
          "The most important move of this set is curse. Goodra is pretty good defensively on the special side , the defence boost from curse gives us very needed bulk on physical side and the passive recovery from leftovers let's us live endlessly. The attack boost will be necessary and the speed drop will be VERY important later on",
          "Dragon claw is just a standard STAB physical move",
          "This is where the speed drop becomes usefull since goodra's speed is very low because of 0 speed IVs and Brave nature and the speed drop from curse will ensure that gyro ball will hit like a goddamn truck and you can Tera steel to get extra boost on gyro ball to knock out even the bulkiest mon that resist steel",
          "For the 4th move Earthquake and fire punch are for coverage against othe steel types and etc. or you can choose knock off for support",
        ],
        votes: 1,
        summary:
          "Goodra-hisui @ leftovers\n\nAbility: Sap slipper\n\nTera type: Steel\n\nEVs: 252 HP / 252 Atk / 4 SpD\n\nBrave nature\n\nIVs: 0 Spe\n\n- Curse\n\n- Dragon claw\n\n- Gyro ball\n\n- Earthquake / Fire punch / Knock off\n\nThis set can ERASE...",
      },
      {
        ability: "Shell Armor",
        item: "Leftovers",
        nature: "Calm",
        evs: "252 HP / 144 Def / 112 SpD",
        moves: ["Acid Armor", "Body Press", "Rest", "Sleep Talk"],
        votes: 0,
        summary:
          "This set just lets Goodra take attacks and set up almost endlessly.",
      },
    ],
  },
  "Alolan Ninetales": {
    pokedexUrl: "https://pokemondb.net/pokedex/ninetales",
    movesetUrl:
      "https://pokemondb.net/pokebase/274550/what-is-a-good-moveset-for-alolan-ninetales",
    builds: [
      {
        ability: "Snow Warning",
        item: "Light Clay / Icy Rock",
        nature: "Timid",
        evs: "252 SpA / 4 SpD / 252 Spe",
        iv: "0 Atk",
        moves: ["Blizzard / Freeze Dry", "Moonblast", "Aurora Veil", "Encore"],
        votes: 9,
        summary:
          "Alolan Ninetales is one of, if not the most reliable setter of Aurora Veil, which is basically Reflect and Light Screen combined that can only be used in Hail.",
      },
      {
        ability: "Snow Warning",
        item: "Choice Specs",
        nature: "Timid",
        evs: "252 SpA / 4 SpD / 252 Spe",
        moves: ["Blizzard", "Freeze-Dry", "Moonblast", "Dark Pulse"],
        votes: 3,
        summary:
          "I'm finally getting around to posting an Alolan Ninetales for NU, so here is a Choice Specs set it can use there.",
      },
      {
        ability: "Snow Warning",
        item: "Light Clay",
        nature: "Bold",
        evs: "252 HP / 252 Def / 4 SpA",
        moves: ["Blizzard", "Moonblast", "Aurora Veil", "Calm Mind"],
        votes: 2,
        summary:
          "The idea here is a bulky special wall, with a better typing than Kantonian Ninetales.",
      },
    ],
  },
  "Galarian Weezing": {
    pokedexUrl: "https://pokemondb.net/pokedex/weezing",
    movesetUrl:
      "https://pokemondb.net/pokebase/330804/what-is-a-good-moveset-for-galarian-weezing",
    builds: [
      {
        ability: "Misty Surge",
        item: "Assault Vest",
        nature: "Modest",
        evs: "252 HP, 252 SpAtk, 4 SpDef",
        moves: ["Sludge Bomb", "Strange Steam", "Fire Blast", "Thunderbolt"],
        votes: 1,
        summary:
          "Weezing-G @ Assault Vest\n\nAbility: Misty Surge\n\nEVs: 252 HP, 252 SpAtk, 4 SpDef\n\nNature: Modest\n\nIVs: 0 Atk\n\n- Sludge Bomb\n\n- Strange Steam\n\n- Fire Blast\n\n- Thunderbolt",
      },
      {
        ability: "Levitate",
        item: "Black Sludge",
        nature: "Bold",
        evs: "itate",
        moves: ["Will-O-Wisp", "Pain Split", "Defog", "Strange Steam"],
        votes: 0,
        summary:
          "I like this Pokemon as a defog user. Galarian Weezing is has 3 great abilities (Levitate, Neutralizing Gas, and Misty Surge) and you can easily go with any one depending in what yo",
      },
      {
        ability: "Neutralizing Gas",
        item: "Choice Specs",
        nature: "Modest",
        evs: "252 HP, 4 Def, 252 SpAtk",
        moves: ["Sludge Wave", "Strange Steam", "Fire Blast", "Thunderbolt"],
        votes: 0,
        summary:
          "Weezing-G @ Choice Specs\n\nAbility: Neutralizing Gas\n\nEVs: 252 HP, 4 Def, 252 SpAtk\n\nNature: Modest\n\n- Sludge Wave\n\n- Strange Steam\n\n- Fire Blast\n\n- Thunderbolt",
      },
    ],
  },
  Amoonguss: {
    pokedexUrl: "https://pokemondb.net/pokedex/amoonguss",
    movesetUrl:
      "https://pokemondb.net/pokebase/13593/what-is-a-good-moveset-for-amoonguss",
    builds: [
      {
        ability: "Effect Spore",
        item: "Black Sludge",
        nature: "Bold",
        evs: "252 Hp/166 Def/92 SDef",
        moves: ["Spore", "Giga Drain", "Protect", "Rage Powder"],
        votes: 3,
        summary: "Oh, Amoonguss. The best Pokemon on my team. BY FAR.",
      },
      {
        ability: "Regenerator",
        item: "Iapapa Berry",
        evs: "252 HP / 252 Def / 4 SpD",
        moves: [
          "Clear Smog / Spore",
          "Giga Drain",
          "Sludge Bomb",
          "Foul Play / Stomping Tantrum",
        ],
        votes: 2,
        summary:
          "This Amoonguss takes a +4 Rock Slide from Adamant Terrakion, and can fire off Clear Smog, which stops sweepers like Terrakion, and CurseLax/Belly Drum Snorlax.",
      },
      {
        ability: "Regenerator",
        item: "Sitrus Berry / Aguav Berry",
        nature: "Sassy",
        evs: "252 HP / 72 Def / 184 SpD",
        moves: ["Protect", "Rage Powder", "Spore", "Pollen Puff"],
        votes: 2,
        summary:
          "Kinda similar to some of the other movesets and the Smogon set for Doubles OU, but oh well.",
      },
    ],
  },
  Blissey: {
    pokedexUrl: "https://pokemondb.net/pokedex/blissey",
    movesetUrl:
      "https://pokemondb.net/pokebase/2613/what-is-a-good-moveset-for-blissey",
    builds: [
      {
        ability: "Natural Cure",
        item: "Leftovers",
        nature: "Calm",
        evs: "200 HP / 176 SpA / 132 SpD",
        moves: [
          "Ice Beam",
          "Thunderbolt",
          "Wish",
          "Heal Bell",
          "Seismic Toss",
          "Toxic",
          "Heal Bell",
          "Wish",
        ],
        votes: 9,
        summary:
          "Basically, this is a Cleric Bliss, which got an upgrade going into Gen V.",
      },
      {
        ability: "Natural Cure",
        item: "Leftovers",
        nature: "Bold",
        evs: "200 HP / 252 Def / 58 SpD",
        moves: ["Toxic", "Soft-Boiled", "Protect", "Flametrhower"],
        votes: 8,
        summary: "Here's a moveset for a Blissey in the role of stalling! ~",
      },
      {
        ability: "Serene Grace",
        item: "Choice Specs",
        nature: "Modest",
        evs: "252 SpA / 4 SpD / 252 Spe",
        moves: ["Hyper Voice", "Psychic", "Charge Beam", "Ice Beam"],
        votes: 4,
        summary: "Nobody put a PURE offensive Blissey. I'll put mine.",
      },
    ],
  },
  Shuckle: {
    pokedexUrl: "https://pokemondb.net/pokedex/shuckle",
    movesetUrl:
      "https://pokemondb.net/pokebase/4964/what-is-a-good-moveset-for-shuckle",
    builds: [
      {
        ability: "Contrary",
        item: "Leftovers",
        nature: "Relaxed",
        evs: "252 HP / 4 SpD / 252 Def",
        moves: [
          "Shell Smash",
          "Power Trick",
          "Gyro Ball",
          "Rock Slide / Stone Edge",
        ],
        votes: 5,
        summary:
          "Contrary works great on this set. Trick Room support is HIGHLY recommended for this set.\n\nShell Smash raises defenses and lowers Speed, thanks to Contrary.\n\nPower Swap, after 6 She",
      },
      {
        ability: "Sturdy",
        item: "Berry Juice",
        nature: "Careful",
        evs: "el one.",
        moves: ["Power Split", "Stealth Rock", "Sticky Web", "Knock Off"],
        votes: 5,
        summary:
          "Thought that these recent Pokemon in ou are too powerful? Well, this shuckle can basically half their attacking stats.",
      },
      {
        ability: "Contrary",
        item: "Leftovers / Chesto berry",
        nature: "Sassy",
        evs: "252 HP / 4 Def / 252 SpD",
        moves: ["Toxic", "Rest", "Shell Smash", "Knock Off"],
        votes: 3,
        summary: "Use this little guy in a sandstorm as special wall.",
      },
    ],
  },
  Slaking: {
    pokedexUrl: "https://pokemondb.net/pokedex/slaking",
    movesetUrl:
      "https://pokemondb.net/pokebase/36236/what-is-a-good-moveset-for-slaking",
    builds: [
      {
        item: "Choice Scarf",
        evs: "252 attack / 100 Spd / 60 def / 60 sp def",
        moves: ["Giga Impact", "Earthquake", "Hammer Arm", "Ice Punch"],
        votes: 3,
        summary: "EVS 252 attack / 100 Spd / 60 def / 60 sp def",
      },
      {
        item: "Life Orb",
        evs: "enge... ^_^",
        moves: ["Retaliate", "Earthquake", "Brick Break", "Shadow Claw"],
        votes: 3,
        summary:
          "And to answer the question that I KNOW will come up, I choose Retaliate over Giga Impact, because being a revenge killer, he can still do massive damage, and be able to switch.",
      },
      {
        item: "Choice Band",
        evs: "4 HP / 252 Atk / 252 Spe",
        moves: ["Return", "Hammer Arm/Earthquake", "Shadow Claw", "Pursuit"],
        votes: 2,
        summary:
          "Since Slaking should be switching out after it has attacked anyway, a choice item works excellently.",
      },
    ],
  },
  Aegislash: {
    pokedexUrl: "https://pokemondb.net/pokedex/aegislash",
    movesetUrl:
      "https://pokemondb.net/pokebase/165849/what-is-a-good-moveset-for-aegislash",
    builds: [
      {
        ability: "Stance Change",
        item: "Life Orb / Shell Bell /Weakness Policy",
        nature: "Adamant",
        evs: "252 Atk / 128 Def / 128 SpD",
        moves: [
          "Swords Dance",
          "King's Shield",
          "Shadow Sneak",
          "Sacred Sword",
        ],
        votes: 20,
        summary:
          "This guy is literally DESIGNED to use swords dance, if you don't have the move in your moveset, then what's the point in using him? By the way if this guy doesn't get into OU I will figuratively sh*t myself.",
      },
      {
        ability: "Stance Change",
        item: "Kasib Berry",
        nature: "Brave",
        evs: "40 HP / 252 Atk / 119 Def / 99 SpD",
        moves: ["Swords Dance", "Iron Head", "Shadow Claw", "King's Shield"],
        votes: 4,
        summary: "An attacker when need it, a defender when you want it",
      },
      {
        ability: "Stance Change",
        item: "Leftovers",
        nature: "Adamant",
        evs: "4 HP / 252 Atk / 252 Spe",
        moves: [
          "Swords Dance",
          "Autotomize",
          "Iron Head",
          "Shadow Claw / Sacred Sword",
        ],
        votes: 3,
        summary:
          "This Pokemon has a wonderful ability, allowing it to set up in Defensive mode, then attack with new stats.",
      },
    ],
  },
  Salamence: {
    pokedexUrl: "https://pokemondb.net/pokedex/salamence",
    movesetUrl:
      "https://pokemondb.net/pokebase/4729/what-is-a-good-moveset-for-salamence",
    builds: [
      {
        ability: "Aerilate",
        item: "Salamencite",
        nature: "Jolly",
        evs: "4 HP / 252 Atk / 252 Spe",
        moves: ["Dragon Dance", "Frustration", "Earthquake", "Roost"],
        votes: 15,
        summary:
          "Got them annoying Dittos in ladder? No worries! This set will make those Ditto cry and punch them hard!",
      },
      {
        ability: "Intimidate",
        item: "Leftovers",
        nature: "Impish",
        evs: "248 HP / 228 Def / 28 Spe",
        moves: ["Wish", "Dragon Claw", "Roost", "Roar"],
        votes: 4,
        summary:
          "Intimidate means Salamence has defensive merit to potentially pull off a bulky set.",
      },
      {
        ability: "Moxie",
        item: "Life Orb",
        nature: "Naive",
        evs: "252 Atk / 4 SpA / 252 Spe",
        moves: ["Draco Meteor", "Outrage", "Brick Break", "Stone Edge"],
        votes: 4,
        summary:
          "You may be wondering why I have a Special move with the nature I put down, but just hear me out.",
      },
    ],
  },
  Sylveon: {
    pokedexUrl: "https://pokemondb.net/pokedex/sylveon",
    movesetUrl:
      "https://pokemondb.net/pokebase/167894/what-is-a-good-moveset-for-sylveon",
    builds: [
      {
        ability: "Pixilate",
        item: "Leftovers",
        nature: "Modest",
        evs: "252 HP / 129 SpA / 129 SpD",
        moves: [
          "Hyper Voice",
          "Shadow Ball",
          "Hidden Power [Ground] / Psyshock",
          "Calm Mind",
        ],
        votes: 5,
        summary:
          "Calm Mind boosts your SpA & SpD. Hyper Voice becomes STAB because of Pixilate & gains a 30% boost. Shadow Ball is coverage, and HP Ground covers both your weaknesses. Psyshock is f",
      },
      {
        ability: "Pixilate",
        item: "Leftovers",
        nature: "Calm",
        evs: "252 HP / 4 SpA / 252 SpD",
        moves: ["Hyper Voice", "Wish", "Toxic / Heal Bell", "Protect"],
        votes: 3,
        summary:
          "Sylveon @ Leftovers\n\nAbility: Pixilate\n\nEVs: 252 HP / 4 SpA / 252 SpD\n\nCalm Nature\n\n- Hyper Voice\n\n- Wish\n\n- Toxic / Heal Bell\n\n- Protect",
      },
      {
        ability: "Cute Charm",
        item: "Rocky Helmet",
        nature: "Bold",
        evs: "126 HP / 252 Def / 4 SpA / 126 Spe",
        moves: ["Moonblast", "Skill Swap", "Calm Mind", "Shadow Ball"],
        votes: 3,
        summary:
          "Pixilate is somewhat useless to me. Sylveon, in my opinion, doesn't have many good normal attacks. Skill Swap is for the Mega Pokemon (with their amazing rarely seen abilities) and",
      },
    ],
  },
  Gastrodon: {
    pokedexUrl: "https://pokemondb.net/pokedex/gastrodon",
    movesetUrl:
      "https://pokemondb.net/pokebase/7528/what-is-a-good-moveset-for-gastrodon",
    builds: [
      {
        ability: "Sticky Hold",
        item: "Leftovers",
        nature: "Brave",
        evs: "4 HP / 252 Atk / 252 Def",
        moves: ["Waterfall", "Earthquake", "Rock Slide", "Curse"],
        votes: 3,
        summary: "Physical Gastrodon: Proud user of Earthquake!",
      },
      {
        ability: "Storm Drain",
        item: "Leftovers",
        nature: "Calm",
        evs: "164 HP / 92 SpA / 252 SpD",
        moves: ["Scald", "Earth Power / Toxic", "Sludge Bomb", "Recover"],
        votes: 2,
        summary:
          "The Standard Gastrodon Set, except with Sludge Bomb to defeat other Fairy Type Special Defensive Walls that would otherwise play around it's Toxic/Burn Stall Strategy.",
      },
      {
        ability: "Storm Drain",
        item: "Choice Specs",
        nature: "Modest",
        evs: "248 HP / 252 SpA / 8 SpD",
        moves: ["Ice Beam", "Scald", "Earth Power", "Sludge Bomb"],
        votes: 1,
        summary:
          "Bubblegum (Gastrodon) (M) @ Choice Specs\n\nAbility: Storm Drain\n\nEVs: 248 HP / 252 SpA / 8 SpD\n\nModest Nature\n\n- Ice Beam\n\n- Scald\n\n- Earth Power\n\n- Sludge Bomb\n\nWHATS THIS? SPECS GASTRODON?\n\nYeah, it's specs gastrodon.",
      },
    ],
  },
  Hariyama: {
    pokedexUrl: "https://pokemondb.net/pokedex/hariyama",
    movesetUrl:
      "https://pokemondb.net/pokebase/5161/what-is-a-good-moveset-for-hariyama",
    builds: [
      {
        item: "Flame Orb",
        nature: "Impish",
        evs: "4 HP / 252 Atk / 252 Def",
        moves: ["Rock Slide", "Close Combat", "Payback", "Facade"],
        votes: 1,
        summary:
          "Flame Orb+Guts+Facade=Death of the foe. Rock Slide covers Flying types and destroys Bugs resisting Close Combat. Close Combat is powerful STAB, but it lowers Defense and Special De",
      },
      {
        ability: "Guts",
        item: "Flame Orb / Toxic Orb",
        nature: "Adamant",
        evs: "252 Atk / 172 SpD / 84 Spe",
        moves: ["Fling / Fake Out", "Bullet Punch", "Close Combat", "Payback"],
        votes: 1,
        summary:
          "Fling tosses the Flame Orb at an opponent, giving them a burn.",
      },
      {
        ability: "Thick Fat / Guts",
        item: "Sitrus Berry",
        nature: "Adamant",
        evs: "4 HP / 252 Atk / 252 Spe",
        moves: ["Belly Drum", "Bullet Punch", "Drain Punch", "Knock Off"],
        votes: 1,
        summary: "A Belly Drum set Hariyama can use in Gen 9 NU.",
      },
    ],
  },
  Klefki: {
    pokedexUrl: "https://pokemondb.net/pokedex/klefki",
    movesetUrl:
      "https://pokemondb.net/pokebase/167507/what-is-a-good-moveset-for-klefki",
    builds: [
      {
        ability: "Prankster",
        item: "Light Clay",
        nature: "Bold / Calm / Impish / Careful",
        evs: "4 HP / 252 Def / 252 SpD",
        moves: [
          "Thunder Wave / Foul Play",
          "Spikes",
          "Reflect",
          "Light Screen",
        ],
        votes: 4,
        summary: "This is very good at setting up dual screens.",
      },
      {
        ability: "Prankster",
        item: "Leftovers",
        nature: "Lax",
        evs: "252 Def / 252 HP / 4 Atk",
        moves: ["Thunder Wave", "Flash Cannon", "Torment", "Foul Play"],
        votes: 2,
        summary:
          "Wrecks everything. Counters Aegislash. OU. TWave-Torment shuts down all the new Pokes.",
      },
      {
        ability: "Prankster",
        item: "Leftovers",
        nature: "Bold",
        evs: "252 HP / 252 Def / 4 Spe",
        moves: [
          "Calm Mind",
          "Draining Kiss",
          "Flash Cannon",
          "Hidden Power {Ground}",
        ],
        votes: 2,
        summary:
          "Calm Mind Klekfi. I decided on Draining Kiss. An odd choice, but recovery is necessary. Flash Cannon is STAB, and HP ground is to kill Steels, Poison, and fire",
      },
    ],
  },
  Whimsicott: {
    pokedexUrl: "https://pokemondb.net/pokedex/whimsicott",
    movesetUrl:
      "https://pokemondb.net/pokebase/14612/what-is-a-good-moveset-for-whimsicott",
    builds: [
      {
        ability: "Prankster",
        item: "Focus Sash",
        nature: "Timid",
        evs: "252 HP / 4 SpD / 252 Spe",
        moves: ["Tailwind", "Taunt", "Encore", "Beat Up"],
        votes: 3,
        summary: 'Ok, before you ask "why Beat Up?", I\'ll explain that first.',
      },
      {
        ability: "Chlorophyll",
        item: "Leftovers",
        nature: "Modest",
        evs: "198 HP / 252 SpA / 60 Spe",
        moves: ["Growth", "Solar Beam", "Psychic", "Hidden Power [Fire]"],
        votes: 1,
        summary:
          "Growth Boosts your S.Attack(and Attack but that is not important here) by two stages in the sun.",
      },
      {
        ability: "Prankster",
        item: "Sticky Barb",
        nature: "Impish",
        evs: "4 HP / 252 Def / 252 SpD",
        moves: ["Leech Seed", "Switcheroo", "Toxic", "Substitute"],
        votes: 1,
        summary:
          "The Prank-star\n\nThis name was inspired by a user named Prankstar.",
      },
    ],
  },
  Garchomp: {
    pokedexUrl: "https://pokemondb.net/pokedex/garchomp",
    movesetUrl:
      "https://pokemondb.net/pokebase/2075/what-is-a-good-moveset-for-garchomp",
    builds: [
      {
        ability: "Rough Skin",
        item: "Leftovers",
        nature: "Jolly",
        evs: "252 Atk / 4 Def / 252 Spe",
        moves: [
          "Substitute",
          "Swords Dance / Hone Claws / Fire Fang",
          "Earthquake",
          "Outrage / Dragon Claw / Dragon Rush",
        ],
        votes: 7,
        summary:
          "So, the point of this set it to go in there and set up on something you can resist or wall, such as Forretress or something along those lines.",
      },
      {
        ability: "Sand Veil",
        item: "Focus Sash / Groundium Z / Assault Vest",
        nature: "Jolly",
        evs: "252 Atk / 4 SpD / 252 Spe",
        moves: [
          "Earthquake",
          "Rock Slide",
          "Dragon Claw / Poison Jab",
          "Swords Dance / Protect / Poison Jab",
        ],
        votes: 5,
        summary: "The annoying Doubles Garchomp that could",
      },
      {
        ability: "Rough Skin",
        item: "Garchompite",
        nature: "Jolly",
        evs: "252 Atk / 4 SpD / 252 Spe",
        moves: [
          "Scale Shot",
          "Earthquake",
          "Swords Dance",
          "Stone Edge / Fire Fang",
        ],
        votes: 4,
        summary:
          "A full-offense lady. Scale Shot is STAB and breaks sashes + Substitutes plus can be a little annoying too. While M-Garchomp has a speed nerf that may kill her + a Defense drop afte",
      },
    ],
  },
  "Hisuian Zoroark": {
    pokedexUrl: "https://pokemondb.net/pokedex/zoroark",
    movesetUrl:
      "https://pokemondb.net/pokebase/416929/what-is-a-good-moveset-for-hisuian-zoroark",
    builds: [
      {
        ability: "Illusion",
        item: "Life Orb / Air Balloon (!!)",
        nature: "Timid",
        evs: "252 SpA / 4 SpD / 252 Spe",
        moves: ["Nasty Plot", "Shadow Ball", "Hyper Voice", "Focus Blast"],
        votes: 4,
        summary:
          "Pretty self-explanatory. Nasty Plot for setup, dual STAB in Shadow Ball and Hyper Voice, and Focus Blast for coverage. Tera Fighting lets you resist sucker punch and powers up Focu",
      },
      {
        ability: "Illusion",
        item: "Ghostium Z / Fightinium Z",
        nature: "Jolly",
        evs: "252 Atk / 4 SpD / 252 Spe",
        moves: ["Swords Dance", "Poltergeist", "Low Kick", "Shadow Sneak"],
        votes: 4,
        summary:
          "Since there wasn't any physical Hisuian Zoroark sets on this thread, here is a Swords Dance Z move set it can use in National Dex Monotype on offense (or HO) teams.",
      },
      {
        ability: "Illusion",
        item: "Choice Scarf / Choice Specs",
        nature: "Timid",
        evs: "252 SpA / 4 SpD / 252 Spe",
        moves: [
          "Shadow Ball",
          "Focus Blast",
          "Trick",
          "U-turn / Dark Pulse / Flamethrower / Grass Knot",
        ],
        votes: 1,
        summary: "A Choiced set Hisuian Zoroark can use in NatDex Monotype.",
      },
    ],
  },
  Charizard: {
    pokedexUrl: "https://pokemondb.net/pokedex/charizard",
    movesetUrl:
      "https://pokemondb.net/pokebase/9479/what-is-a-good-moveset-for-charizard",
    builds: [
      {
        ability: "Blaze --> Tough Claws",
        item: "Charizardite X",
        nature: "Adamant",
        evs: "252 Spe / 252 Atk / 4 HP",
        moves: [
          "Flare Blitz",
          "Dragon Dance",
          "Dragon Claw / Outrage",
          "Earthquake",
        ],
        votes: 7,
        summary:
          "You know how just frickin epic Ash Charizard was? Then you realized Ash isn't very good with Pokemon and Charizard really wasn't very good due to its underwhelming stats and Stealth Rock weakness? Well, it is finally...",
      },
      {
        ability: "Blaze",
        item: "Leftovers",
        nature: "Impish",
        evs: "4 HP / 252 Atk / 252 Def",
        moves: ["Flare Blitz", "Earthquake", "Thunder Punch", "Brick Break"],
        votes: 6,
        summary:
          "Alright, a Physical Tank. Really, I'm serious. 280 max defense is sweet.",
      },
      {
        ability: "Solar Power",
        item: "Leftovers",
        nature: "Timid",
        evs: "4 HP / 252 SpA / 252 Spe",
        moves: ["Air Slash", "Flamethrower", "Solar Beam", "Dragon Pulse"],
        votes: 5,
        summary:
          "Okay, I'm going to start off by saying this set only works in the sun.",
      },
    ],
  },
  Electabuzz: {
    pokedexUrl: "https://pokemondb.net/pokedex/electabuzz",
    builds: [],
  },
  Empoleon: {
    pokedexUrl: "https://pokemondb.net/pokedex/empoleon",
    movesetUrl:
      "https://pokemondb.net/pokebase/2273/what-is-a-good-moveset-for-empoleon",
    builds: [
      {
        ability: "Torrent",
        item: "Choice Scarf",
        nature: "Timid / Modest",
        evs: "4 HP / 252 SpA / 252 Spe",
        moves: [
          "Flash Cannon",
          "Ice Beam",
          "Grass Knot / Hidden Power [Flying]",
          "Hydro Pump / Surf",
        ],
        votes: 2,
        summary:
          "So, Choice Scarf with Timid Nature make his speed 300, or with Modest, his Speed reaches 274.",
      },
      {
        ability: "Torrent",
        item: "Focus Sash",
        nature: "Modest",
        evs: "128 Def / 252 SpA / 128 SpD",
        moves: ["Hidden Power [Fire]", "Surf", "Ice Beam", "Stealth Rock"],
        votes: 2,
        summary:
          "Most leads are now Fire-type Pokemon, or carry a Fire type move, because of Scizor and Forretress abuse.",
      },
      {
        ability: "Torrent",
        item: "Chople Berry / Wacan Berry / Shuca Berry / Life Orb",
        nature: "Timid Nature / Modest",
        evs: "252 SpA / 252 Spe / 4 SpD",
        moves: [
          "Ice Beam",
          "Surf / Hydro Pump",
          "Grass Knot",
          "Agility",
          "Aqua Jet",
          "Swords Dance",
          "Earthquake",
          "Drill Peck",
        ],
        votes: 2,
        summary:
          "Surf / Hydro Pump (Depends if you want power or accuracy)\n\nGrass Knot (Other Water types + heavier foes that threaten the Emperor)\n\nAgility (Helps out with Empoleon's less than desirable speed)",
      },
    ],
  },
  Togekiss: {
    pokedexUrl: "https://pokemondb.net/pokedex/togekiss",
    movesetUrl:
      "https://pokemondb.net/pokebase/18329/what-is-a-good-moveset-for-togekiss",
    builds: [
      {
        ability: "Serene Grace",
        item: "Leftovers",
        nature: "Bold",
        evs: "80 HP / 80 Def / 252 SpA / 16 SpD / 80 Spe",
        moves: ["Thunder Wave", "Air Slash", "Wish", "Aura Sphere"],
        votes: 8,
        summary:
          "Bulky Sweeper, para hax and flinch hax mixing is fun, Wish is for team support, and you can probably flinch the turn for you to use it.",
      },
      {
        ability: "Serene Grace",
        item: "Leftovers",
        nature: "Modest",
        evs: "252 SpA / 4 SpD / 252 Spe",
        moves: ["Thunder Wave", "Aura Sphere", "Water Pulse", "Air Slash"],
        votes: 5,
        summary:
          "Togekiss (F) @ Leftovers\n\nAbility: Serene Grace\n\nEVs: 252 SpA / 4 SpD / 252 Spe\n\nModest Nature\n\n- Thunder Wave\n\n- Aura Sphere\n\n- Water Pulse\n\n- Air Slash",
      },
      {
        ability: "Serene Grace",
        item: "Leftovers",
        nature: "Timid",
        evs: "6 HP / 252 SpA / 252 Spe",
        moves: [
          "Psyshock",
          "Aura Sphere",
          "Air Slash",
          "Thunder Wave / Nasty Plot",
        ],
        votes: 3,
        summary:
          "Psyshock: covers Blissey and co.\n\nAura Sphere: Major coverage\n\nAir Slash: 60% flinch + STAB\n\nThunder Wave/Nasty plot: Status or Super strong",
      },
    ],
  },
  Dragonite: {
    pokedexUrl: "https://pokemondb.net/pokedex/dragonite",
    movesetUrl:
      "https://pokemondb.net/pokebase/3967/what-is-a-good-moveset-for-dragonite",
    builds: [
      {
        ability: "Multiscale",
        item: "Leftovers",
        nature: "Careful",
        evs: "252 Atk / 156 SpD / 100 Spe",
        moves: ["Dragon Dance", "Roost", "Dragon Claw", "Fire Punch"],
        votes: 15,
        summary: "Set up Dragon Dance then start hitting the opponent hard.",
      },
      {
        ability: "Multiscale",
        item: "Leftovers",
        nature: "Impish",
        evs: "252 HP / 96 Def / 156 SpD / 4 Spe",
        moves: ["Substitute", "Thunder Wave", "Dragon Tail", "Roost"],
        votes: 9,
        summary: "First move I see on any Dragonite: Dragon Dance.",
      },
      {
        ability: "Marvel Scale",
        item: "Eviolite",
        nature: "Careful",
        evs: "iolite",
        moves: ["Rest", "Sleep Talk", "Dragon Dance", "Dragon Tail"],
        votes: 8,
        summary:
          "Finally B/W2 brought Sleep Talk and Marvel Scale together to make one amazing combination! Rest is for healing.",
      },
    ],
  },
  Metagross: {
    pokedexUrl: "https://pokemondb.net/pokedex/metagross",
    movesetUrl:
      "https://pokemondb.net/pokebase/4459/what-is-a-good-moveset-for-metagross",
    builds: [
      {
        item: "Leftovers",
        nature: "Adamant",
        evs: "252 HP / 252 Atk / 4 Spe",
        moves: [
          "Meteor Mash",
          "Earthquake",
          "Zen Headbutt",
          "Ice Punch / Bullet Punch",
        ],
        votes: 11,
        summary:
          "Metagross @ Leftovers\n\nClear Body\n\nEVs: 252 HP / 252 Atk / 4 Spe\n\nAdamant Nature\n\n- Meteor Mash\n\n- Earthquake\n\n- Zen Headbutt\n\n- Ice Punch / Bullet Punch",
      },
      {
        ability: "Clear Body",
        item: "Shuca Berry / Occa Berry / Leftovers",
        nature: "Adamant",
        evs: "252 HP / 252 Atk / 4 SpD",
        moves: [
          "Ice Punch",
          "Steel Roller",
          "Bullet Punch",
          "Stealth Rock / Toxic",
        ],
        votes: 5,
        summary:
          "This is a little gimmicky, but this set makes Metagross a terrain remover.",
      },
      {
        ability: "Clear Body",
        item: "Shuca Berry",
        nature: "Adamant",
        evs: "248 HP / 172 Atk / 40 Def / 48 Spe",
        moves: ["Steel Roller", "Ice Punch", "Stomping Tantrum", "Meteor Mash"],
        votes: 4,
        summary:
          "Terrain support is needed for this set. Steel Roller is an incredibly strong STAB that has the side effect of removing the terrain on the field. This move only works when a terrain",
      },
    ],
  },
  Hitmontop: {
    pokedexUrl: "https://pokemondb.net/pokedex/hitmontop",
    movesetUrl:
      "https://pokemondb.net/pokebase/5055/what-is-a-good-moveset-for-hitmontop",
    builds: [
      {
        ability: "Technician",
        item: "Assault Vest",
        nature: "Adamant",
        evs: "248 HP / 252 Atk / 8 SpD",
        moves: ["Triple Axel", "Mach Punch", "Close Combat", "Rapid Spin"],
        votes: 3,
        summary:
          "Technician Triple Axel is pretty neat. It can do up to 180 base power worth of damage. Mach Punch is STAB Technician boosted priority. Close Combat is strong STAB. Rapid Spin is to",
      },
      {
        ability: "Intimidate",
        item: "Leftovers",
        nature: "Impish",
        evs: "252 HP / 232 Def / 26 SpD",
        moves: [
          "Rapid Spin",
          "Toxic",
          "Close Combat / Hi Jump Kick",
          "Stone Edge",
          "Mike",
        ],
        votes: 2,
        summary:
          "Most people use Technician on Hitmontop, but Intimidate is the better of the Abilities if you are running a Rapid Spinner on it, which got it to the #1 used UU Pokemon in PO.",
      },
      {
        ability: "Intimidate",
        item: "Iron Ball",
        nature: "Brave",
        evs: "252 HP / 252 Atk / 4 Def",
        moves: [
          "Gyro Ball",
          "Revenge",
          "Fling",
          "Mach Punch / Stone Edge / Rapid Spin",
        ],
        votes: 1,
        summary:
          "Gyro Ball gets a crazy power with Iron Ball, hindering nature, max outed attack and 0 speed IVs.",
      },
    ],
  },
  Blastoise: {
    pokedexUrl: "https://pokemondb.net/pokedex/blastoise",
    movesetUrl:
      "https://pokemondb.net/pokebase/4913/what-is-a-good-moveset-for-blastoise",
    builds: [
      {
        ability: "Mega Launcher",
        item: "Blastoistinite",
        nature: "Modest",
        evs: "240 HP / 252 SpA / 16 SpD",
        moves: [
          "Water Pulse / Hydro Pump",
          "Aura Sphere",
          "Dragon Pulse",
          "Dark Pulse",
        ],
        votes: 5,
        summary:
          "What we thought was the worst Mega Evolution turned out to be one of the top Megas out there.",
      },
      {
        ability: "Torrent",
        item: "Leftovers",
        nature: "Modest",
        evs: "er mind. Anyway, today I plan on a short but hopefully interesting review on the famous Blastoise! I'll do this in sections, giving an overview, pros,cons, and sets for it's respected tiers and uses. I this case, lets begin!!",
        moves: [
          "Toxic",
          "Scald",
          "Rapid Spin",
          "Dragon Tail",
          "Hydro Pump",
          "Ice Beam",
          "Hidden Power [Grass]",
          "Surf",
        ],
        votes: 3,
        summary: "Hello people! How you doing? Never mind.",
      },
      {
        ability: "Torrent",
        item: "White Herb",
        nature: "Modest",
        evs: "252 SpA / 80 SpD / 176 Spe",
        moves: ["Shell Smash", "Aura Sphere", "Hydro Pump", "Ice Beam"],
        votes: 2,
        summary:
          "Okay, so, as of the time I write this, Blastoise remains unreleased in Gen 8, but when it becomes available through Pokemon Home, I can guarantee you this is going to be a crazy popular option to run it with.",
      },
    ],
  },
  Gengar: {
    pokedexUrl: "https://pokemondb.net/pokedex/gengar",
    movesetUrl:
      "https://pokemondb.net/pokebase/5449/what-is-a-good-moveset-for-gengar",
    builds: [
      {
        ability: "Levitate",
        item: "Choice Scarf",
        nature: "Modest",
        evs: "itate",
        moves: ["Shadow Ball", "Thunderbolt", "Giga Drain", "Sludge Bomb"],
        votes: 13,
        summary: "Will's Gengar is better, but this is also a useful set.",
      },
      {
        ability: "Levitate",
        item: "Focus Sash",
        nature: "Timid",
        evs: "itate",
        moves: [
          "Hypnosis",
          "Nightmare",
          "Hex / Dream Eater / Confuse Ray",
          "Mean Look",
        ],
        votes: 7,
        summary:
          "Put your opponent to sleep, trap them with Mean Look, give them nightmares, Confuse them/eat dat/attack dat, he mad yet?",
      },
      {
        ability: "Levitate",
        item: "Choice Specs",
        nature: "Timid",
        evs: "itate",
        moves: [
          "Shadow Ball",
          "Focus Blast",
          "Thunderbolt",
          "Sludge Bomb / Trick",
        ],
        votes: 5,
        summary:
          "Shadow Ball, taking care of opposing Ghost and Psychic type Pokemon, being STAB.",
      },
    ],
  },
  Scizor: {
    pokedexUrl: "https://pokemondb.net/pokedex/scizor",
    movesetUrl:
      "https://pokemondb.net/pokebase/4958/what-is-a-good-moveset-for-scizor",
    builds: [
      {
        ability: "Technician",
        item: "Leftovers / Life Orb / Occa Berry",
        nature: "Adamant",
        evs: "252 HP / 252 Atk / 6 Spe",
        moves: [
          "Bullet Punch",
          "Bug Bite",
          "Swords Dance",
          "Aerial Ace / Brick Break",
        ],
        votes: 6,
        summary:
          "Scizor @ Leftovers / Life Orb / Occa Berry\n\nAbility: Technician\n\nEVs: 252 HP / 252 Atk / 6 Spe\n\nAdamant Nature\n\n- Bullet Punch\n\n- Bug Bite\n\n- Swords Dance\n\n- Aerial Ace / Brick Break",
      },
      {
        ability: "Technician",
        item: "Scizorite",
        nature: "Adamant",
        evs: "252 Atk / 160 SpD / 96 HP",
        moves: [
          "Swords Dance",
          "Bullet Punch",
          "Bug Bite / Quick Attack / Roost",
          "Pursuit / Roost",
        ],
        votes: 4,
        summary: "Swords Dance to build its incredible Attack.",
      },
      {
        ability: "Technician",
        item: "Focus Sash",
        nature: "Hasty / Naive",
        evs: "252 Atk / 252 Spe",
        moves: ["Swords Dance", "Dual Wingbeat", "Big Bite", "Reversal"],
        votes: 4,
        summary:
          "Swords Dance: Good Attack boost, you can set up with Focus Sash\n\nDual Wingbeat: Very strong STAB with Technician\n\nBug Bite: Strong STAB\n\nReversal: Covers 4x Rock weakness, very powerful at 1 HP, which Scyther probably...",
      },
    ],
  },
  Greninja: {
    pokedexUrl: "https://pokemondb.net/pokedex/greninja",
    movesetUrl:
      "https://pokemondb.net/pokebase/165490/what-is-a-good-moveset-for-greninja",
    builds: [
      {
        ability: "Protean",
        item: "Expert Belt",
        nature: "Hasty",
        evs: "4 Atk / 252 SpA / 252 Spe",
        moves: ["Dark Pulse", "Hydro Pump", "Ice Beam", "U-turn"],
        votes: 17,
        summary:
          "This thing is a monster. So far my favorite set which abuses both it's speed, Hidden Ability and wonderful Special Attack stat utilizes the item Expert Belt. This allows it to fake",
      },
      {
        ability: "Protean",
        item: "Choice Specs",
        nature: "Naive",
        evs: "4 Atk / 252 SpA / 252 Spe",
        moves: [
          "Hydro Pump",
          "Dark Pulse",
          "Ice Beam",
          "U-turn / Extrasensory",
        ],
        votes: 6,
        summary:
          "The whole idea of this set is to get massive power and coverage from the constant STAB Protean provides combined with the boost from Choice Specs.",
      },
      {
        ability: "Protean",
        item: "Focus Sash",
        nature: "Naive",
        evs: "4 Atk / 252 SpA / 252 Spe",
        moves: ["Spikes", "Hydro Pump", "Hidden Power [Fire]", "U-turn"],
        votes: 5,
        summary:
          "This set is a great scout, and Protean allows it to become a great team player.",
      },
    ],
  },
  Excadrill: {
    pokedexUrl: "https://pokemondb.net/pokedex/excadrill",
    movesetUrl:
      "https://pokemondb.net/pokebase/14096/what-is-a-good-moveset-for-excadrill",
    builds: [
      {
        item: "Air Balloon",
        evs: "4 HP / 252 Atk / 252 Spd",
        moves: ["Swords Dance", "X-Scissor", "Rock Slide", "Earthquake"],
        votes: 9,
      },
      {
        ability: "Sand Force",
        item: "Smooth Rock",
        nature: "Adamant",
        evs: "248 HP / 252 Atk / 8 SpD",
        moves: ["Earthquake", "Iron Head", "Rock Slide", "Sandstorm"],
        votes: 2,
        summary:
          "Excadrill (M) @ Smooth Rock\n\nAbility: Sand Force\n\nEVs: 248 HP / 252 Atk / 8 SpD\n\nAdamant Nature\n\n- Earthquake\n\n- Iron Head\n\n- Rock Slide\n\n- Sandstorm",
      },
      {
        item: "Air Balloon",
        evs: "4 HP / 252 Atk / 252 Spd",
        moves: ["Hone Claws", "Drill Run", "Rock Slide", "Metal Claw"],
        votes: 1,
        summary:
          "Most of the time you can get away with running Sand force and fake your opponent into thinking you have Sand Rush.",
      },
    ],
  },
  Tyranitar: {
    pokedexUrl: "https://pokemondb.net/pokedex/tyranitar",
    movesetUrl:
      "https://pokemondb.net/pokebase/4042/what-is-a-good-moveset-for-tyranitar",
    builds: [
      {
        ability: "Sand Stream",
        item: "Tyranitarite",
        nature: "Jolly",
        evs: "252 Atk / 252 Spe / 4 SpD",
        moves: [
          "Dragon Dance",
          "Stone Edge",
          "Ice Punch / Thunder Punch",
          "Fire Punch / Earthquake",
        ],
        votes: 4,
        summary:
          "When you mega evolve, Tyranitar's defenses are increased by quite a bit, making it one of the most bulkiest sweepers (I believe).",
      },
      {
        ability: "Sand Stream",
        item: "Tyranitarite",
        nature: "Careful",
        evs: "252 HP / 4 Atk / 252 SpD",
        moves: [
          "Thunder Wave",
          "Pursuit",
          "Foul Play",
          "Stealth Rock",
          "252 SpA Calyrex-Shadow Astral Barrage vs. 252 HP / 252+ SpD Tyranitar-Mega in Sand: 50-59 (12.3 - 14.6%) -- possible 7HKO",
          "252 SpA Calyrex-Shadow Draining Kiss vs. 252 HP / 252+ SpD Tyranitar-Mega in Sand: 56-68 (13.8 - 16.8%) -- possible 6HKO",
          "252 SpA Calyrex-Shadow Pollen Puff vs. 252 HP / 252+ SpD Tyranitar-Mega in Sand: 102-120 (25.2 - 29.7%) -- guaranteed 4HKO",
          "252 SpA Life Orb Dark Aura Yveltal Dark Pulse vs. 252 HP / 252+ SpD Tyranitar-Mega in Sand: 48-57 (11.8 - 14.1%) -- possible 8HKO",
        ],
        votes: 4,
        summary:
          "Once, a king named Calyrex fused with Spectrier and become Calyrex-Shadow rider.",
      },
      {
        ability: "Sand Stream",
        item: "Choice Scarf",
        nature: "Adamant / Jolly",
        evs: "4 HP / 252 Atk / 252 Spe",
        moves: [
          "Stone Edge",
          "Crunch or Pursuit",
          "Earthquake",
          "Thunder Punch",
        ],
        votes: 3,
        summary:
          "This set gives him enough speed to out-run Politoed and if you run Jolly Ninetales.",
      },
    ],
  },
  Chansey: {
    pokedexUrl: "https://pokemondb.net/pokedex/chansey",
    builds: [],
  },
  Slowbro: {
    pokedexUrl: "https://pokemondb.net/pokedex/slowbro",
    movesetUrl:
      "https://pokemondb.net/pokebase/4585/what-is-a-good-moveset-for-slowbro",
    builds: [
      {
        ability: "Regenerator",
        item: "Leftovers",
        nature: "Bold",
        evs: "8 HP / 252 Def / 232 SpA / 16 SpD",
        moves: ["Scald", "Flamethrower", "Psyshock", "Calm Mind"],
        votes: 4,
        summary:
          "Okay, this guy is just awesome. Scald provides nice powered STAB that also will burn the foe fairly frequently, further increasing your defensive power, Psyshock is also STAB that",
      },
      {
        ability: "Regenerator",
        item: "Heavy-Duty Boots",
        nature: "Bold",
        evs: "252 HP / 248 Def / 8 SpD",
        moves: ["Scald", "Future Sight", "Teleport", "Slack Off"],
        votes: 3,
        summary: "This thing is absolutely everywhere right now.",
      },
      {
        ability: "Regenerator",
        item: "Leftovers / Covert Cloak",
        nature: "Bold",
        evs: "248 HP / 176 Def / 84 Spe",
        moves: ["Calm Mind", "Scald", "Psychic Noise", "Slack Off"],
        votes: 2,
        summary: "A Calm Mind set Slowbro can use in Gen 9 NU.",
      },
    ],
  },
  Ferrothorn: {
    pokedexUrl: "https://pokemondb.net/pokedex/ferrothorn",
    movesetUrl:
      "https://pokemondb.net/pokebase/13212/what-is-a-good-moveset-for-ferrothorn",
    builds: [
      {
        ability: "Iron Barbs",
        item: "Rocky Helmet",
        nature: "Adamant / Brave",
        evs: "120 HP / 252 Atk / 8 Def / 128 SpD",
        moves: [
          "Power Whip",
          "Shadow Claw",
          "Bulldoze / Gyro Ball",
          "Swords Dance",
        ],
        votes: 7,
        summary:
          "There might be better sets for Ferrothorn, but most sets here include Leech Seed and hazards.",
      },
      {
        ability: "Iron Barbs",
        item: "Rocky Helmet",
        nature: "Impish",
        evs: "252 HP / 128 Def / 128 SpD",
        moves: ["Thunder Wave", "Substitute", "Leech Seed", "Power Whip"],
        votes: 4,
        summary:
          "This guy is a pain in the rear end. First you Paralyze them with Thunder Wave to cut their Speed and chances off hitting you. This gives you a chance to set up Substitute to block",
      },
      {
        ability: "Iron Barbs",
        item: "Rocky Helmet",
        nature: "Impish / Brave",
        evs: "252 Atk / 252 Def",
        moves: [
          "Ingrain / Leech seed",
          "Spikes",
          "Stealth Rock",
          "Explosion / Power Whip / Gyro Ball",
        ],
        votes: 2,
        summary: "This version is meant to be a setup for a sweepers.",
      },
    ],
  },
  Clefable: {
    pokedexUrl: "https://pokemondb.net/pokedex/clefable",
    movesetUrl:
      "https://pokemondb.net/pokebase/3167/what-is-a-good-moveset-for-clefable",
    builds: [
      {
        ability: "Magic Guard",
        item: "Toxic Orb",
        nature: "Adamant",
        evs: "216 HP / 44 Atk / 192 Def / 56 SpD",
        moves: ["Facade", "Fire Punch / Fling", "Soft-Boiled", "Cosmic Power"],
        votes: 6,
        summary:
          "As I said, this ugly thing can be played a number of ways, I prefer to facade staller.",
      },
      {
        ability: "Magic Guard",
        item: "Leftovers",
        nature: "Bold",
        evs: "6 HP / 252 Def / 252 SpD or 252 HP / 128 Def / 128 SpD",
        moves: ["Cosmic Power", "Wish", "Toxic", "Protect"],
        votes: 2,
        summary:
          "This is the set I use most often, it has proven to be a very good wall but beware of Taunt.",
      },
      {
        ability: "Unaware",
        item: "Leftovers",
        nature: "Calm",
        evs: "252 HP / 240 Def / 16 SpD",
        moves: ["Cosmic Power", "Moonlight", "Stored Power", "Flamethrower"],
        votes: 2,
        summary:
          "It's really awesome how many people I've been able to troll with this Clefable, so how could I not post it?",
      },
    ],
  },
  Politoed: {
    pokedexUrl: "https://pokemondb.net/pokedex/politoed",
    movesetUrl:
      "https://pokemondb.net/pokebase/4882/what-is-a-good-moveset-for-politoed",
    builds: [
      {
        ability: "Drizzle",
        item: "Leftovers",
        nature: "Jolly",
        evs: "4 HP / 252 Atk / 252 Spe",
        moves: [
          "Wake-up Slap / Focus Punch / Frustration / Return",
          "Hypnosis",
          "Waterfall",
          "Belly Drum",
        ],
        votes: 8,
        summary:
          "My little sweeping beast :] if you've battled any of my rain teams, ( Heck, most all of my teams have a Politoed lead like this ) then you've met this guy.",
      },
      {
        ability: "Damp",
        item: "Leftovers",
        nature: "Adamant",
        evs: "128 Atk / 128 Def / 252 SpD",
        moves: [
          "Attract",
          "Defense Curl",
          "Ice Ball",
          "Earthquake / Waterfall",
        ],
        votes: 8,
        summary:
          "Poli here uses her attractive self to immobilize her opponents, then she curls up, and pounds e'm like..",
      },
      {
        ability: "Drizzle",
        item: "Life Orb",
        nature: "Modest",
        evs: "4 HP / 252 SpA / 252 SpD",
        moves: ["Hydro Pump", "Hypnosis", "Focus Blast", "Ice Beam"],
        votes: 7,
        summary:
          "Drizzle is for the rain lead aspect, this just takes a bit of a cool twist for Poli.",
      },
    ],
  },
  Ludicolo: {
    pokedexUrl: "https://pokemondb.net/pokedex/ludicolo",
    movesetUrl:
      "https://pokemondb.net/pokebase/5071/what-is-a-good-moveset-for-ludicolo",
    builds: [
      {
        ability: "Swift Swim",
        item: "Absorb Bulb / Life Orb",
        nature: "Rash / Modest",
        evs: "entually",
        moves: [
          "Hydro Pump / Surf",
          "Giga Drain",
          "Ice Beam / Focus Blast",
          "Fake Out / Rain Dance / Protect",
        ],
        votes: 9,
        summary:
          "Absorb Bulb is an interesting item that boosts the holder's special attack one stage if it is hit with a water move.",
      },
      {
        ability: "Swift Swim / Rain Dish",
        item: "Choice Specs/Life Orb/Lefties",
        nature: "Modest",
        evs: "252 HP / 252 SpA / 4 Spe",
        moves: [
          "Hydro Pump",
          "Giga Drain",
          "Ice Beam",
          "Focus Blast/Rain Dance",
        ],
        votes: 6,
        summary:
          "Hydro Pump is good STAB.\n\nGiga Drain provides healing and is STAB as well.\n\nIce Beam gives great coverage along the dual STAB moves.\n\nFocus Blast hits Ferrothorn.\n\nIf you're not pl",
      },
      {
        ability: "Rain Dish",
        item: "Leftovers",
        nature: "Bold",
        evs: "252 HP / 228 Def / 28 SpA",
        moves: ["Scald", "Giga Drain", "Leech Seed", "Protect"],
        votes: 6,
        summary:
          "I made this set for a RMT answer, and I tested it out, and it’s really fun to use.",
      },
    ],
  },
  Blaziken: {
    pokedexUrl: "https://pokemondb.net/pokedex/blaziken",
    movesetUrl:
      "https://pokemondb.net/pokebase/17545/what-is-a-good-moveset-for-blaziken",
    builds: [
      {
        ability: "Speed Boost",
        item: "Air Balloon / Focus Sash / Leftovers",
        nature: "Adamant",
        evs: "252 Atk / 252 Spe / 4 HP",
        moves: [
          "Hone Claws",
          "Blaze Kick",
          "Hi Jump Kick",
          "Stone Edge / Earthquake",
        ],
        votes: 9,
        summary:
          "Blaziken @ Air Balloon / Focus Sash / Leftovers\n\nAbility: Speed Boost\n\nEVs: 252 Atk / 252 Spe / 4 HP\n\nAdamant Nature\n\n- Hone Claws\n\n- Blaze Kick\n\n- Hi Jump Kick\n\n- Stone Edge / Earthquake",
      },
      {
        ability: "Speed Boost",
        item: "Leftovers",
        nature: "Jolly",
        evs: "252 Atk / 4 Def / 252 Spe",
        moves: [
          "Protect",
          "Swords Dance",
          "High Jump Kick / Baton Pass",
          "Stone Edge / Brave Bird / Shadow Claw",
        ],
        votes: 6,
        summary:
          "Protect is a speed boost. Swords Dance brings up Atk to insane levels if your opponent can't take him down fast enough. High Jump Kick / Baton Pass will give STAB, or a +6 Spe / At",
      },
      {
        ability: "Speed Boost",
        item: "Life Orb",
        nature: "Adamant",
        evs: "4 HP / 252 Atk / 252 Spe",
        moves: ["Blaze Kick", "Close Combat", "Protect", "Thunder Punch"],
        votes: 5,
        summary: "Life Orb- To utilize Blaziken's good Attack stat.",
      },
    ],
  },
  Gothitelle: {
    pokedexUrl: "https://pokemondb.net/pokedex/gothitelle",
    movesetUrl:
      "https://pokemondb.net/pokebase/13287/what-is-a-good-moveset-for-gothitelle",
    builds: [
      {
        ability: "Shadow Tag",
        item: "Choice Specs",
        nature: "Timid",
        evs: "er have. Capable of eliminating much of OU's threats and walls, Gothitelle must be taken seriously, before you happen to lose your Skarmory or Ferrothorn.",
        moves: [
          "Psyshock",
          "Thunderbolt",
          "Hidden Power [Fire] / Hidden Power [Fighting] / Hidden Power [Ground]",
          "Trick",
        ],
        votes: 8,
        summary:
          "Gothitelle is undoubtedly one of the best back up mons you can ever have.",
      },
      {
        ability: "Shadow Tag",
        item: "Choice Scarf",
        nature: "Calm",
        evs: "252 HP / 252 Def / 4 SpD",
        moves: ["Cosmic Power", "Trick", "Taunt", "Rest"],
        votes: 2,
        summary:
          "NatDex AG trapper\n\n\n\nGothitelle @ Choice Scarf\n\nAbility: Shadow Tag\n\nEVs: 252 HP / 252 Def / 4 SpD\n\nCalm Nature\n\nIVs: 0 Atk\n\n- Cosmic Power\n\n- Trick\n\n- Taunt\n\n- Rest\n\nAn amazing teammate to Zacian-Crowned, as it can e...",
      },
      {
        item: "Leftovers",
        evs: "252 Def / 128 SAtk / 128 SDef",
        moves: ["Calm Mind", "Psyshock", "Thunderbolt", "Shadow Ball"],
        votes: 1,
      },
    ],
  },
  Raichu: {
    pokedexUrl: "https://pokemondb.net/pokedex/raichu",
    movesetUrl:
      "https://pokemondb.net/pokebase/10108/what-is-a-good-moveset-for-raichu",
    builds: [
      {
        ability: "Lightning Rod",
        item: "Life Orb",
        nature: "Timid",
        evs: "252 SpA / 4 SpD / 252 Spe",
        moves: ["Discharge", "Grass Knot", "Focus Blast", "Hidden Power [Ice]"],
        votes: 4,
        summary: "Switch in on an Electric type attack and start sweeping.",
      },
      {
        ability: "Static",
        item: "Life Orb",
        nature: "Lax",
        evs: "92 HP / 128 Atk / 128 SpA / 160 Spe",
        moves: [
          "Thunder Punch",
          "Brick Break",
          "Hidden Power [Ice]",
          "Quick Attack",
        ],
        votes: 3,
        summary: "Well, Mixed isn't a popular choice on this guy.",
      },
      {
        ability: "Lightning Rod",
        item: "Assault Vest",
        nature: "Timid",
        evs: "168 HP / 152 SpD / 188 Spe",
        moves: [
          "Nuzzle",
          "Fake Out",
          "Volt Switch",
          "Electroweb",
          "Thunderbolt",
          "Grass Knot",
          "Volt Switch",
          "Surf",
        ],
        votes: 3,
        summary: "Here is a support Raichu I use a lot in VGC:",
      },
    ],
  },
  Cloyster: {
    pokedexUrl: "https://pokemondb.net/pokedex/cloyster",
    movesetUrl:
      "https://pokemondb.net/pokebase/10113/what-is-a-good-moveset-for-cloyster",
    builds: [
      {
        ability: "Skill Link",
        item: "Focus Sash",
        nature: "Jolly",
        evs: "4 HP / 252 Atk / 252 Spe",
        moves: ["Icicle Spear", "Rock Blast", "Shell Smash", "Razor Shell"],
        votes: 8,
        summary: "Okay then, Focus Sash allows you to get up Shell Smash.",
      },
      {
        ability: "Overcoat",
        item: "Focus Sash / White Herb",
        nature: "Modest",
        evs: "252 SpA / 4 Def / 252 Spe",
        moves: [
          "Shell Smash",
          "Hydro Pump",
          "Ice Beam",
          "Hidden Power [Electric] / Hidden Power [Grass] / Hidden Power [Fire]",
        ],
        votes: 5,
        summary:
          "This clam is famous in OU for its bulk and Shell Smash sweeping capabilities, and although Cloyster is kind of a nub Pokemon, that is no reason for me to not realize it is always used as a Physical Attacker, and try t...",
      },
      {
        ability: "Skill Link",
        item: "Waterium Z",
        nature: "Naive",
        evs: "4 Atk / 252 SpA / 252 Spe",
        moves: [
          "Shell Smash",
          "Hydro Pump",
          "Hidden Power [Fire]",
          "Icicle Spear",
        ],
        votes: 2,
        summary:
          "A Mixed Shell Smash set Cloyster can use on Ice teams in Gen 9 National Dex Monotype.",
      },
    ],
  },
  "Meowstic (M)": {
    pokedexUrl: "https://pokemondb.net/pokedex/meowstic",
    movesetUrl:
      "https://pokemondb.net/pokebase/169405/what-is-a-good-moveset-for-meowstic",
    builds: [
      {
        ability: "Prankster",
        item: "Light Clay / Leftovers",
        nature: "Bold",
        evs: "252 HP / 252 Def / 4 SpD",
        moves: [
          "Light Screen",
          "Reflect",
          "Thunder Wave / Yawn",
          "Psychic / Psyshock",
        ],
        votes: 3,
        summary:
          "Standard Dual Screens Prankster set. Prankster Light Screen and Reflect allows Meowstic (Male) to enable hyper offense teams that appreciate the safety to setup more easily. Pranks",
      },
      {
        ability: "Infiltrator",
        item: "Choice Specs",
        nature: "Timid",
        evs: "4 HP / 252 SpA / 252 Spe",
        moves: [
          "Psychic / Psyshock",
          "Shadow Ball / Dark Pulse",
          "Thunderbolt",
          "Energy Ball",
        ],
        votes: 2,
        summary: "The 2 first moves are STABs: Psychic and Psyshock.",
      },
      {
        ability: "Competitive",
        item: "Leftovers",
        nature: "Serious",
        evs: "252 HP / 252 Def / 4 SpD",
        moves: [
          "Thunder Wave",
          "Calm Mind",
          "Substitute / Shadow Ball",
          "Psychic / Psyshock",
        ],
        votes: 1,
        summary:
          "I use my Meowstic both support and sweeper for support I use:\n\nThunder Wave\n\nSwitch to Smeargle\n\nBelly Drum\n\nBaton Pass to Absol\n\nThen Sweep\n\nIf used for sweeping:\n\nThunder Wave\n\nSubstitute\n\nCalm Mind until the Subsit...",
      },
    ],
  },
  Abomasnow: {
    pokedexUrl: "https://pokemondb.net/pokedex/abomasnow",
    movesetUrl:
      "https://pokemondb.net/pokebase/7232/what-is-a-good-moveset-for-abomasnow",
    builds: [
      {
        ability: "Snow Warning",
        item: "Leftovers",
        nature: "Modest",
        evs: "128 Def / 252 SpA / 128 SpD",
        moves: ["Blizzard", "Giga Drain", "Leech Seed", "Water Pulse"],
        votes: 5,
        summary: "Water pulse you have to tm then transfer or use PO",
      },
      {
        ability: "Snow Warning",
        item: "Leftovers",
        nature: "Lonely",
        evs: "252 HP / 132 Atk / 126 SpA",
        moves: ["Leech Seed", "Blizzard", "Ice Shard", "Protect / Wood Hammer"],
        votes: 2,
        summary:
          "Okay, lets get straight to the point, Abomasnow is a very fragile Pokemon and can be easily KO'ed with a 4x Fire weakness.",
      },
      {
        ability: "Snow Warning",
        item: "Choice Scarf",
        nature: "Lonely",
        moves: [
          "Blizzard",
          "Ice Shard",
          "Wood Hammer",
          "Earthquake / Brick Break",
        ],
        votes: 1,
        summary:
          "Blizzard is your stab and though your offence is not focused on SAtk it will still do a decent amount with 180 base power after stab.",
      },
    ],
  },
  Chandelure: {
    pokedexUrl: "https://pokemondb.net/pokedex/chandelure",
    movesetUrl:
      "https://pokemondb.net/pokebase/13075/what-is-a-good-moveset-for-chandelure",
    builds: [
      {
        item: "Charcoal",
        nature: "Modest",
        evs: "ance in later seasons. This set is for the real-time battle system and not intended for turn-based formats!",
        moves: [
          "Heat Wave",
          "Shadow Ball",
          "Fire Spin / Overheat",
          "Protect / Calm Mind",
        ],
        votes: 4,
        summary:
          "Format: Legends Z-A Battle Club\n\nThis set was created specifically for Ranked Battle's Season 2, but I'm confident that it will retain relevance in later seasons.",
      },
      {
        ability: "Infiltrator",
        item: "Eviolite",
        nature: "Quiet",
        evs: "iolite",
        moves: ["Shadow Ball", "Flamethrower", "Calm Mind", "Trick Room"],
        votes: 3,
        summary:
          "With Lampent's base speed of 55, it can outspeed some Pokémon in Trick Room.",
      },
      {
        ability: "Flash Fire",
        item: "Life Orb",
        nature: "Timid",
        evs: "4 HP / 252 SpA / 252 Spe",
        moves: [
          "Flamethrower / Heat Wave",
          "Hex",
          "Will-O-Wisp",
          "Energy Ball",
        ],
        votes: 2,
        summary:
          "Flash Fire: adds another immunity, increases power of fire moves, and works as a great switch-in",
      },
    ],
  },
  Milotic: {
    pokedexUrl: "https://pokemondb.net/pokedex/milotic",
    movesetUrl:
      "https://pokemondb.net/pokebase/4040/what-is-a-good-moveset-for-milotic",
    builds: [
      {
        ability: "Marvel Scale",
        item: "Leftovers",
        nature: "Bold",
        evs: "252 HP / 200 Def / 58 SpA",
        moves: ["Toxic", "Scald", "Recover", "Protect / Ice Beam"],
        votes: 5,
        summary:
          "Milotic @ Leftovers\n\nAbility: Marvel Scale\n\nEVs: 252 HP / 200 Def / 58 SpA\n\nBold Nature\n\n- Toxic\n\n- Scald\n\n- Recover\n\n- Protect / Ice Beam",
      },
      {
        ability: "Marvel Scale",
        item: "Flame Orb",
        nature: "Bold",
        evs: "252 HP / 252 Def / 4 SpD",
        moves: ["Protect", "Scald", "Skitter Smack", "Recover"],
        votes: 3,
        summary:
          "So, this is a version of the Flame Orb + Marvel Scale Milotic set.",
      },
      {
        ability: "Marvel Scale",
        item: "Leftovers",
        nature: "Modest",
        evs: "96 HP / 160 SpA / 252 SpD",
        moves: ["Surf", "Ice Beam", "Mirror Coat", "Recover"],
        votes: 2,
        summary:
          "Modest nature is for sweeping but Milotic can wall special hits also.",
      },
    ],
  },
  "Alolan Muk": {
    pokedexUrl: "https://pokemondb.net/pokedex/muk",
    movesetUrl:
      "https://pokemondb.net/pokebase/276536/what-is-a-good-moveset-for-alolan-muk",
    builds: [
      {
        ability: "Poison Touch",
        item: "Black Sludge",
        nature: "Adamant / Brave",
        evs: "4 HP / 252 Atk / 252 SpD",
        moves: [
          "Poison Jab",
          "Knock Off",
          "Pursuit",
          "Shadow Sneak / Fire Blast",
        ],
        votes: 3,
        summary:
          "Pretty self-explanatory. Poison Jab + Knock Off is a good combination for STAB. Pursuit allows you to pursuit trap Psychic and Ghost-types. So, Muk-Alola can switch into threats li",
      },
      {
        ability: "Poison Touch",
        item: "Black Sludge",
        nature: "Sassy",
        evs: "252 HP / 4 Def / 252 SpD",
        moves: ["Payback", "Curse", "Rest", "Sleep Talk"],
        votes: 2,
        summary: "I've found Alolan Muk very capable of the Rest-Talk method.",
      },
      {
        ability: "Gluttony",
        item: "Aguav Berry",
        nature: "Careful",
        evs: "252 HP / 68 Def / 188 SpD",
        moves: [
          "Recycle",
          "Curse",
          "Poison Jab / Ice Punch / Fire Punch",
          "Knock Off",
        ],
        votes: 2,
        summary: "Another Curse Set.\n\nCredit to my friend for this set.",
      },
    ],
  },
  Talonflame: {
    pokedexUrl: "https://pokemondb.net/pokedex/talonflame",
    movesetUrl:
      "https://pokemondb.net/pokebase/168576/what-is-a-good-moveset-for-talonflame",
    builds: [
      {
        ability: "Gale Wings",
        item: "Leftovers",
        nature: "Jolly",
        evs: "8 HP / 252 Atk / 248 Spe",
        moves: ["Swords Dance", "Brave Bird", "Flare Blitz", "Roost"],
        votes: 6,
        summary:
          "Roost for reliable healing, Flare Blitz as secondary STAB to hit Steel Types and stuff, Swords Dance to setup.",
      },
      {
        ability: "Gale Wings",
        item: "Choice Band",
        nature: "Adamant",
        evs: "6 HP / 252 Atk / 252 Spe",
        moves: ["Flare Blitz", "Brave Bird", "U-turn", "Steel Wing"],
        votes: 4,
        summary:
          "Flare Blitz and Brave Bird are STAB, Brave Bird getting +1 Priority thanks to Gale Wings.",
      },
      {
        ability: "Gale Wings",
        item: "Leftovers",
        nature: "Adamant",
        evs: "4 HP / 252 Atk / 252 Spe",
        moves: ["Brave Bird", "Flare Blitz", "Roost", "Will-O-Wisp"],
        votes: 3,
        summary:
          "I see there are plenty of Talonflame sets that are either boosting sweepers or support sets but not a median.",
      },
    ],
  },
  Mamoswine: {
    pokedexUrl: "https://pokemondb.net/pokedex/mamoswine",
    movesetUrl:
      "https://pokemondb.net/pokebase/7551/what-is-a-good-moveset-for-mamoswine",
    builds: [
      {
        item: "Choice Band",
        evs: "er since the release of the Therian formes of Tornadus, Thundurus, and Landorus.",
        moves: ["Ice Shard", "Stone Edge", "Earthquake", "Icicle Spear/Crash"],
        votes: 4,
        summary:
          "This guy has seen a TREMENDOUS use ever since the release of the Therian formes of Tornadus, Thundurus, and Landorus.",
      },
      {
        ability: "Thick Fat",
        item: "Assault Vest",
        nature: "Jolly",
        evs: "252 Spd, 252 Atk, 4 Sp.D",
        moves: [
          "Knock Off (Powerful move, wrecks item obusers, like Hydreigon)",
        ],
        votes: 2,
        summary:
          "Knock Off (Powerful move, wrecks item obusers, like Hydreigon)",
      },
      {
        ability: "Thick Fat",
        item: "Choice Band",
        nature: "Jolly",
        evs: "252 Atk / 4 SpD / 252 Spe",
        moves: [
          "Ice Shard",
          "Earthquake",
          "Superpower",
          "Stone Edge / Icicle Crash",
        ],
        votes: 2,
        summary:
          "Ice Shard quickly revenge kills common threats like Salamence, Garchomp, Dragonite, and Hydreigon.",
      },
    ],
  },
  Weavile: {
    pokedexUrl: "https://pokemondb.net/pokedex/weavile",
    movesetUrl:
      "https://pokemondb.net/pokebase/7239/what-is-a-good-moveset-for-weavile",
    builds: [
      {
        ability: "Pickpocket",
        item: "Iron Ball",
        nature: "Adamant",
        evs: "eryone's sets look pretty well the same with only a move varying between... Here's something a little different:",
        moves: [
          "Ice Shard",
          "Brick Break",
          "Fling",
          "Fake Out / Taunt / Thief",
        ],
        votes: 13,
        summary:
          "Geez, everyone's sets look pretty well the same with only a move varying between...",
      },
      {
        ability: "Pressure",
        item: "Choice Scarf",
        nature: "Jolly",
        evs: "252 Atk / 4 SpD / 252 Spe",
        moves: ["Ice Punch", "Night Slash", "Low Kick", "Pursuit"],
        votes: 5,
        summary: "One more I am back to make use of a UU Pokemon in OU.",
      },
      {
        ability: "Inner Focus",
        item: "Choice Band",
        nature: "Jolly",
        evs: "252 Atk / 4 SpD / 252 Spe",
        moves: [
          "Knock Off",
          "Icicle Crash",
          "Ice Shard",
          "Psycho Cut / Low Kick / Poison Jab",
        ],
        votes: 2,
        summary: "Knock Off is STAB and removes the opponent's held item.",
      },
    ],
  },
  "Rotom (W)": {
    pokedexUrl: "https://pokemondb.net/pokedex/rotom",
    movesetUrl:
      "https://pokemondb.net/pokebase/9759/what-is-a-good-moveset-for-rotom",
    builds: [
      {
        item: "Life Orb",
        evs: "itate",
        moves: [
          "Shadow Ball",
          "Thunderbolt",
          "Hidden Power [Fighting]",
          "Volt Switch",
        ],
        votes: 1,
        summary:
          "Rotom with STAB Shadow Ball , F**** YES!!\n\nThunderbolt for staying in and attacking.",
      },
      {
        ability: "Levitate",
        item: "King's Rock / Scope Lens",
        nature: "Timid",
        evs: "itate",
        moves: ["Thunderbolt", "Will-O-Wisp", "Light Screen", "Shadow Ball"],
        votes: 1,
        summary:
          "This is a gimmicky set I made up on the spot that I am going to be testing out very soon.",
      },
      {
        ability: "Levitate",
        item: "Life Orb / Choice Scarf",
        nature: "Modest",
        evs: "itate",
        moves: [
          "Electro Ball (STAB+works well with high Speed)",
          "Volt Switch (Pivot)",
          "Shadow Ball (STAB+Ghost coverage)",
          "Signal Beam (Dark coverage)",
        ],
        votes: 0,
        summary: "Or, here is another moveset for a different strategy:",
      },
    ],
  },
  Hydreigon: {
    pokedexUrl: "https://pokemondb.net/pokedex/hydreigon",
    movesetUrl:
      "https://pokemondb.net/pokebase/13040/what-is-a-good-moveset-for-hydreigon",
    builds: [
      {
        ability: "Levitate",
        item: "Leftovers",
        evs: "er, if falls into the balanced pile of dragons. It has less bulk than Dragonite, but more than Flygon. It lacks the raw power of Salamence, but is still stronger than Altaria.",
        moves: [
          "Thunder Wave",
          "Dragon Tail / Dragon Pulse",
          "U-Turn",
          "Dark Pulse / Crunch",
        ],
        votes: 6,
        summary:
          "It's got pretty good attack stats, and 92/90/90 Defenses are extremely solid.",
      },
      {
        ability: "Levitate",
        item: "Leftovers / Expert Belt",
        nature: "Timid",
        evs: "itate",
        moves: ["Dragon Pulse", "Charge Beam", "Flamethrower", "Surf"],
        votes: 3,
        summary: "So this is a moveset for Hydreigon I find every useful.",
      },
      {
        ability: "Levitate",
        item: "Liechi Berry",
        nature: "Jolly",
        evs: "itate",
        moves: ["Head Smash", "Crunch", "Outrage", "Earthquake"],
        votes: 3,
        summary: "Crunch and Outrage for STAB.\n\nEarthquake for Coverage.",
      },
    ],
  },
  Pelipper: {
    pokedexUrl: "https://pokemondb.net/pokedex/pelipper",
    movesetUrl:
      "https://pokemondb.net/pokebase/4951/what-is-a-good-moveset-for-pelipper",
    builds: [
      {
        ability: "Drizzle",
        item: "Damp Rock",
        nature: "Bold",
        evs: "248 HP / 232 Def / 28 SpA",
        moves: ["Scald", "Defog", "U-turn", "Hurricane"],
        votes: 7,
        summary:
          "This is the set that ~MegaCharizardY~ recommended for my team.",
      },
      {
        ability: "Rain Dish",
        item: "Leftovers",
        nature: "Calm",
        evs: "252 Def / 252 SpD / 6 SpA",
        moves: ["Roost", "Stockpile", "Scald", "Toxic / Ice Beam"],
        votes: 1,
        summary:
          "Roost is healing. Stockpile is boosting. Scald is STAB and sometimes status. Toxic is Stalling, while Ice Beam is coverage.",
      },
      {
        ability: "Rain Dish",
        item: "Leftovers / Life Orb",
        nature: "Modest",
        evs: "248 HP / 8 Def / 252 SpA",
        moves: [
          "Hydro Pump / Surf / Scald",
          "Ice Beam",
          "Hidden Power [Grass]",
          "Roost",
        ],
        votes: 1,
        summary:
          "Tank.\n\nThe EVs allow Pelipper to switch in 4 times without fainting while SR is up.\n\nHydro Pump is a bit more powerful than Surf, but has 80 accuracy and lower PP, so Surf is a sol",
      },
    ],
  },
  Kingdra: {
    pokedexUrl: "https://pokemondb.net/pokedex/kingdra",
    movesetUrl:
      "https://pokemondb.net/pokebase/7681/what-is-a-good-moveset-for-kingdra",
    builds: [
      {
        ability: "Swift Swim",
        item: "Choice Band",
        nature: "Adamant",
        evs: "252 Atk / 80 Def / 176 Spe",
        moves: ["Waterfall", "Outrage", "Flail", "Iron Head"],
        votes: 4,
        summary:
          "The scariest Pokemon you'll ever face is Kingdra used on one of J98's Rain teams (or TorTran).",
      },
      {
        ability: "Swift Swim",
        item: "Life Orb",
        nature: "Modest",
        evs: "160 HP / 252 SpA / 96 Spe",
        moves: ["Rain Dance", "Hydro Pump", "Ice Beam", "Dragon Pulse"],
        votes: 3,
        summary:
          "Ah.. I have this thing saved in my PO box, but I think I can list it off of the top of my head.",
      },
      {
        ability: "Sniper",
        nature: "Modest",
        evs: "ail.",
        moves: ["Focus Energy", "Agility", "Draco Meteor", "Surf/Ice Beam"],
        votes: 3,
        summary:
          "I got destroyed by this set. Now I'm off to destroy others with it, hax will prevail.",
      },
    ],
  },
  Lapras: {
    pokedexUrl: "https://pokemondb.net/pokedex/lapras",
    movesetUrl:
      "https://pokemondb.net/pokebase/8761/what-is-a-good-moveset-for-lapras",
    builds: [
      {
        ability: "Hydration",
        item: "Damp Rock",
        nature: "Calm",
        evs: "32 HP / 252 Def / 216 SpD / 8 Spe",
        moves: ["Rain Dance", "Rest", "Whirlpool", "Perish Song"],
        votes: 4,
        summary:
          "I don't think this Lapras is common. Damp Rock is here to extend the duration of Rain Dance. Rain Dance is here so with Hydration, she awakes faster from Rest. Whirlpool traps the",
      },
      {
        ability: "Hydration",
        item: "Leftovers",
        nature: "Adamant",
        evs: "108 HP / 200 Def / 200 SpD",
        moves: ["Rest", "Dragon Dance", "Waterfall", "Body Slam"],
        votes: 2,
        summary:
          'A Beasty Gamer named Trachy once said to me, " Water and Normal Makes for Great neutral coverage".',
      },
      {
        ability: "Hydration",
        item: "Leftovers",
        nature: "Careful",
        evs: "248 HP / 8 Def / 252 SpD",
        moves: ["Rest", "Curse", "Waterfall", "Avalanche / Ice Shard"],
        votes: 2,
        summary: "Don't use this set in gen VI, as it won't get far.",
      },
    ],
  },
  Magnezone: {
    pokedexUrl: "https://pokemondb.net/pokedex/magnezone",
    movesetUrl:
      "https://pokemondb.net/pokebase/7246/what-is-a-good-moveset-for-magnezone",
    builds: [
      {
        ability: "Analytic",
        item: "Air Balloon",
        nature: "Quiet",
        evs: "128 Def / 252 SpA / 128 SpD",
        moves: [
          "Flash Cannon",
          "Thunderbolt",
          "Hidden Power [Ice]",
          "Tri Attack / Volt Switch",
        ],
        votes: 4,
        summary:
          "This set is amazing. Air Balloon gives the needed Ground immunity while Analytic allows you to hit harder with Magnezones relatively bad Speed.",
      },
      {
        ability: "Magnet Pull",
        item: "Light Clay/Leftovers/Air Balloon",
        nature: "Modest",
        evs: "248 HP / 252 SpA / 8 SpD",
        moves: [
          "Thunderbolt",
          "Hidden Power [Fire]",
          "Light Screen",
          "Reflect",
        ],
        votes: 3,
        summary:
          "Dragons are a nearly unstoppable force. The only things that seem to be able to stop them:",
      },
      {
        ability: "Magnet Pull",
        item: "Leftovers",
        nature: "Calm",
        evs: "252 HP / 96 Def / 160 SpD",
        moves: [
          "Substitute",
          "Thunder Wave",
          "Thunderbolt",
          "Hidden Power [Fire]",
        ],
        votes: 2,
        summary: "Yay, my favorite troll Pokemon that isn't (that) cheap!",
      },
    ],
  },
  Lucario: {
    pokedexUrl: "https://pokemondb.net/pokedex/lucario",
    movesetUrl:
      "https://pokemondb.net/pokebase/3284/what-is-a-good-moveset-for-lucario",
    builds: [
      {
        ability: "Inner Focus",
        item: "Air Balloon",
        nature: "Jolly",
        evs: "4 HP / 252 Atk / 252 Spe",
        moves: ["Swords Dance", "High Jump Kick", "Shadow Claw", "Ice Punch"],
        votes: 9,
        summary:
          "Jolly + 252 Spe lets him out speed what he needs to, tons of threats.",
      },
      {
        ability: "Inner Focus",
        item: "Lucarionite",
        nature: "Timid",
        evs: "4 HP / 252 SpA / 252 Spe",
        moves: ["Nasty Plot", "Flash Cannon", "Aura Sphere", "Dark Pulse"],
        votes: 6,
        summary:
          "Alright lemme explain.\n\nPeople like to start off with a stally Pokemon such as Giratina so that gives you free time to set up Nasty Plot because they think it will be the standard",
      },
      {
        ability: "Inner Focus",
        item: "Choice Scarf",
        nature: "Adamant",
        evs: "4 HP / 252 Atk / 252 Spe",
        moves: ["High Jump Kick", "Earthquake", "Extreme Speed", "Ice Punch"],
        votes: 5,
        summary: "High Jump Kick is outstanding on Lucario.",
      },
    ],
  },
  Swampert: {
    pokedexUrl: "https://pokemondb.net/pokedex/swampert",
    movesetUrl:
      "https://pokemondb.net/pokebase/4988/what-is-a-good-moveset-for-swampert",
    builds: [
      {
        item: "Leftovers",
        nature: "Adamant",
        evs: "252 Atk / 176 HP / 80 Def",
        moves: ["Stealth Rock", "Waterfall", "Earthquake", "Stone Edge"],
        votes: 6,
        summary:
          "Well, let's see what we have here... Bulky Water type with only one weakness, amazing Attack stat, and can set up Rocks... Let's begin, shall we?",
      },
      {
        ability: "Swift Swim",
        item: "Swampertite",
        nature: "Adamant",
        evs: "252 Atk / 4 SpD / 252 Spe",
        moves: ["Power-Up Punch", "Earthquake", "Waterfall", "Ice Punch"],
        votes: 4,
        summary:
          "Swampert-Mega @ Swampertite\n\nAbility: Swift Swim\n\nEVs: 252 Atk / 4 SpD / 252 Spe\n\nAdamant Nature\n\n- Power-Up Punch\n\n- Earthquake\n\n- Waterfall\n\n- Ice Punch",
      },
      {
        ability: "Torrent",
        item: "Leftovers",
        nature: "Careful",
        evs: "252 HP / 172 Def / 84 SpD",
        moves: ["Flip Turn", "Earthquake", "Stealth Rock", "Waterfall/Roar"],
        votes: 3,
        summary:
          "Swampert @ Leftovers\n\nAbility: Torrent\n\nEVs: 252 HP / 172 Def / 84 SpD\n\nCareful Nature\n\n- Flip Turn\n\n- Earthquake\n\n- Stealth Rock\n\n- Waterfall/Roar\n\nA stealth rocks lead.",
      },
    ],
  },
  Porygon2: {
    pokedexUrl: "https://pokemondb.net/pokedex/porygon2",
    movesetUrl:
      "https://pokemondb.net/pokebase/33351/what-is-a-good-moveset-for-porygon2",
    builds: [
      {
        ability: "Download",
        item: "Choice Specs",
        nature: "Modest",
        evs: "252 SpA / 4 SpD / 252 Spe",
        moves: ["Tri Attack", "Thunderbolt", "Ice Beam", "Shadow Ball"],
        votes: 4,
        summary:
          "(Please note that BDSP is a challenge only format) Porygon2 is a phenomenal Choice Specs user in BDSP PU.",
      },
      {
        ability: "Trace",
        item: "Eviolite",
        nature: "Calm",
        evs: "iolite",
        moves: [
          "Shadow Ball / Foul Play",
          "Ice Beam / Tri Attack",
          "Thunder Wave",
          "Recover",
        ],
        votes: 4,
        summary:
          "Porygon2 has been getting used in NU lately thanks to its bulk with Eviolite as well as having a lot of mileage with Trace.",
      },
      {
        ability: "Download / Trace",
        item: "Eviolite",
        nature: "Bold",
        evs: "iolite",
        moves: [
          "Substitute / Hidden Power [Fire]",
          "Discharge",
          "Ice Beam",
          "Recover",
        ],
        votes: 3,
        summary:
          "This is a physically defensive set Porygon2 can use in Gen 8 Monotype / National Dex Monotype.",
      },
    ],
  },
  Arcanine: {
    pokedexUrl: "https://pokemondb.net/pokedex/arcanine",
    movesetUrl:
      "https://pokemondb.net/pokebase/17110/what-is-a-good-moveset-for-arcanine",
    builds: [
      {
        ability: "Intimidate",
        item: "Life Orb",
        evs: "248 Atk / 8 Def / 252 Spe",
        moves: [
          "Close Combat",
          "Flare Blitz",
          "Wild Charge / Crunch",
          "Extreme Speed",
        ],
        votes: 5,
        summary:
          "Again, your standard sweeper. Although Intimidate gives it some bulk. Life Orb makes it more powerful. Flare Blitz is STAB. Close Combat and Crunch provide you with type coverage.",
      },
      {
        ability: "Intimidate / Flash Fire",
        item: "Life Orb",
        evs: "252 Atk / 4 Def / 252 Spe",
        moves: [
          "Helping Hand",
          "ExtremeSpeed",
          "Flare Blitz",
          "Bulldoze / Close Combat",
        ],
        votes: 2,
        summary: "Helping Hand provides you with team support.",
      },
      {
        ability: "Flash Fire",
        item: "Choice Band",
        nature: "Jolly",
        evs: "252 Atk / 252 Spe / 4 Def",
        moves: ["Close Combat", "Flare Blitz", "Wild Charge", "Extreme Speed"],
        votes: 2,
        summary: "Back for another UU Pokemon to be used in OU.",
      },
    ],
  },
  Kangaskhan: {
    pokedexUrl: "https://pokemondb.net/pokedex/kangaskhan",
    movesetUrl:
      "https://pokemondb.net/pokebase/10196/what-is-a-good-moveset-for-kangaskhan",
    builds: [
      {
        item: "Life Orb",
        evs: "252 HP / 252 Atk / 4 Spd",
        moves: ["Double-Edge", "Drain Punch", "Fake Out", "Sucker Punch"],
        votes: 2,
        summary:
          "Fake Out is just a nice move, free damage, and it gets STAB with Kangaskhan.",
      },
      {
        ability: "Scrappy",
        item: "Choice Band",
        nature: "Jolly / Adamant",
        evs: "252 Atk / 4 Def / 252 Spe",
        moves: [
          "Double-Edge",
          "Earthquake",
          "Fire Punch",
          "Drain Punch / Body Slam",
        ],
        votes: 2,
        summary:
          "Double-Edge is powerful STAB with no immunities because of Scrappy.",
      },
      {
        ability: "Scrappy ---> Parental Bond",
        item: "Kangaskhanite",
        nature: "Jolly",
        evs: "76 HP / 180 Atk / 252 Spe",
        moves: ["Seismic Toss", "Fake Out", "Rock Slide", "Body Slam"],
        votes: 2,
        summary:
          "Seismic Toss is the move you should be using the most, since it does 200 damage each time it is used thanks to Parental Bond, which is pretty good and bypasses Mega Kang's low offenses when compared to the other Ubers.",
      },
    ],
  },
  Gardevoir: {
    pokedexUrl: "https://pokemondb.net/pokedex/gardevoir",
    movesetUrl:
      "https://pokemondb.net/pokebase/4896/what-is-a-good-moveset-for-gardevoir",
    builds: [
      {
        ability: "Trace",
        item: "Choice Scarf",
        nature: "Modest",
        evs: "oir @ Choice Scarf",
        moves: ["Psychic", "Thunderbolt", "Shadow Ball", "Destiny Bond"],
        votes: 8,
        summary: "Psychic is good STAB and hits Poison-types.",
      },
      {
        ability: "Synchronize",
        item: "Leftovers",
        nature: "Timid",
        evs: "oir here.",
        moves: ["Mean Look", "Encore", "Torment/ Disable", "Psychic"],
        votes: 3,
        summary:
          "First, use Mean Look. The opponent won't be able to escape anymore. Use Encore then the next turn, if you manage to survive, use Torment or Disable. The foe will now use Struggle a",
      },
      {
        ability: "Trace",
        item: "Gardevoirite",
        nature: "Timid",
        evs: "oir to Psychic/Fairy is fantastic, now it is no longer Pursuit weak and is immune to Dragon-type attacks. Its Mega-Evolution is also excellent, so it is now much more powerful than Life Orb Gardevoir!",
        moves: ["Hyper Voice", "Focus Blast", "Calm Mind", "Shadow Ball"],
        votes: 2,
        summary:
          "That new retyping of Gardevoir to Psychic/Fairy is fantastic, now it is no longer Pursuit weak and is immune to Dragon-type attacks.",
      },
    ],
  },
  Sableye: {
    pokedexUrl: "https://pokemondb.net/pokedex/sableye",
    movesetUrl:
      "https://pokemondb.net/pokebase/5163/what-is-a-good-moveset-for-sableye",
    builds: [
      {
        ability: "Prankster",
        item: "Focus Sash",
        nature: "Adamant",
        evs: "252 Atk",
        moves: [
          "Fake Out",
          "Swagger",
          "Punishment / Foul Play",
          "Shadow Sneak",
        ],
        votes: 7,
        summary:
          "Fake Out, just some free extra damage but don't do this on Pokemon that has an ability that pevents flinching like a crobat, it might have Inner Focus, neither on Pokemon with rough skin or iron barbs, this just ruins...",
      },
      {
        ability: "Prankster",
        item: "Sablenite",
        nature: "Calm",
        evs: "252 HP / 44 Def / 212 SpD",
        moves: ["Calm Mind", "Recover", "Will-O-Wisp", "Hex"],
        votes: 4,
        summary: "Strange, I know, but you can catch something off guard.",
      },
      {
        ability: "Prankster",
        item: "Leftovers",
        nature: "Bold",
        evs: "6 HP / 252 Def / 252 SpD",
        moves: ["Will-O-Wisp", "Substitute", "Recover", "Night Shade"],
        votes: 3,
        summary:
          "Sableye @ Leftovers\n\nAbility: Prankster\n\nEVs: 6 HP / 252 Def / 252 SpD\n\nBold Nature\n\n- Will-O-Wisp\n\n- Substitute\n\n- Recover\n\n- Night Shade",
      },
    ],
  },
  Gyarados: {
    pokedexUrl: "https://pokemondb.net/pokedex/gyarados",
    movesetUrl:
      "https://pokemondb.net/pokebase/4635/what-is-a-good-moveset-for-gyarados",
    builds: [
      {
        ability: "Moxie",
        item: "Leftovers",
        nature: "Jolly",
        evs: "252 Atk / 4 SpD / 252 Spe",
        moves: ["Waterfall", "Dragon Dance", "Earthquake", "Ice Fang"],
        votes: 11,
        summary: "You've probably been swept by this before.",
      },
      {
        ability: "Intimidate",
        item: "Leftovers",
        nature: "Impish",
        evs: "248 HP / 252 Def / 8 SpD",
        moves: ["Rest", "Sleep Talk", "Thunder Wave", "Dragon Tail"],
        votes: 7,
        summary:
          "Okay, I needed to inform you guys of a Gyarados Moveset I battled today, and is one of the most annoying Gyarados I faced.",
      },
      {
        ability: "Intimidate",
        item: "Leftovers",
        nature: "Adamant",
        evs: "152 HP / 176 Atk / 36 Def / 144 Spe",
        moves: ["Earthquake", "Waterfall", "Taunt", "Dragon Dance"],
        votes: 6,
        summary:
          "Sets up with D-Dance, Taunts other leads trying to stealth rock, etc.",
      },
    ],
  },
  Breloom: {
    pokedexUrl: "https://pokemondb.net/pokedex/breloom",
    movesetUrl:
      "https://pokemondb.net/pokebase/5139/what-is-a-good-moveset-for-breloom",
    builds: [
      {
        ability: "Technician",
        item: "Leftovers",
        nature: "Jolly",
        evs: "252 Atk / 4 Def / 252 Spe",
        moves: ["Mach Punch", "Spore", "Bullet Seed", "Swords Dance"],
        votes: 9,
        summary:
          "With Technician, a high base attack stat, and Swords Dance, Breloom can dish out powerful attacks with Bullet Seed and a priority move in Mach Punch.",
      },
      {
        ability: "Poison Heal",
        item: "Toxic Orb",
        nature: "Jolly",
        evs: "252 HP / 56 Atk / 200 Spe",
        moves: ["Spore", "Leech Seed", "Focus Punch", "Substitute"],
        votes: 5,
        summary:
          "This set utilizes Breloom's ability Toxic Heal and utility moves Spore, Leech Seed, and Substitute to pull off a bulky set.",
      },
      {
        ability: "Poison Heal",
        item: "Toxic Orb",
        nature: "Adamant",
        evs: "252 HP / 252 Atk / 4 Spe",
        moves: ["Spore", "Swords Dance", "Seed Bomb", "Drain Punch"],
        votes: 4,
        summary:
          "Spore is the best sleep-inducing move.\n\nSwords Dance boosts attack to nice levels.\n\nSeed Bomb is good STAB and takes care of Water types.\n\nDrain Punch is STAB and healing and works",
      },
    ],
  },
};
