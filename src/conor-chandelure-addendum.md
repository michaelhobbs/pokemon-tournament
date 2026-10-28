# Michael vs Conor — Tera Fighting Chandelure Addendum

This addendum supplements `src/conor-counter-plan.md` and `src/conor.md`. It does not replace them.

## Key correction: Tera Fighting Chandelure can be burned

The existing notes say Chandelure is immune to Will-O-Wisp. That is only true **before** it Terastallizes.

In current-gen mechanics, Tera Fighting makes Chandelure mono-Fighting, so it loses Fire's burn immunity. Verified in `@pkmn/sim`: Fire's `brn` immunity applies to its current type, and a Terastallized Pokémon's current type is its Tera type.

Timing matters:

- On the turn Chandelure Teras, Sableye's Prankster WoW resolves first while Chandelure is still Fire-type, so WoW fails.
- On the next turn, Chandelure is Fighting-type, so WoW works.
- Safeguard still blocks WoW for its duration.
- Burn only chips Chandelure; it does not reduce Fire Blast because Chandelure is a special attacker.
- With sand up, burn + sand is 1/8 per turn. Chandelure has Choice Scarf, not Leftovers, so that chip is real.

## Best Michael answers

### 1. Knock Off the Scarf first

Sableye's Knock Off is the priority play.

- Before Tera, Knock Off is 2x and removes Scarf.
- After Tera Fighting, Knock Off is resisted but still removes Scarf.
- Without Scarf, Chandelure is slow and can be forced out by Excadrill, Greninja, or Tyranitar.
- Taunt Chandelure to stop Trick. If Chandelure Tricks Scarf onto Tyranitar, Tyranitar loses Assault Vest.
- Knock Off can trigger Flame Body and burn Sableye. That is acceptable; Sableye can still Taunt/WoW/Recover.

### 2. Use sand + Excadrill as the cleanest non-Tera answer

In sand, Excadrill outspeeds Scarf Chandelure. Neutral Life Orb High Horsepower or Iron Head is enough to KO or force it out.

Keep Tyranitar alive to maintain sand. Do not let Conor remove Excadrill before sand is up.

### 3. Tera Fairy Tyranitar is the defensive wall, not the breaker

Tera Fairy Tyranitar:

- Resists Tera Blast Fighting.
- Takes neutral damage from Fire Blast and Shadow Ball.
- Keeps sand up.
- Tanks Chandelure with Assault Vest.

Do not waste turns on Crunch or Rock Slide into Tera Fighting Chandelure; both are resisted. Use High Horsepower or Thunder Punch for neutral chip, or pivot.

### 4. Gardevoir is the only real type answer, but conditional

Gardevoir's Moonblast and Psyshock are 2x into Tera Fighting Chandelure. But Gardevoir is slower than Scarf Chandelure and must Tera Fairy to:

- Avoid Shadow Ball being 2x.
- Resist Tera Blast Fighting.
- Keep Moonblast's 2x damage.

Do not switch Gardevoir in blind. Bring it after a KO, on a predicted Tera Blast Fighting, or after Knock Off removes Scarf. If Tera is already spent on Tyranitar, this line is gone.

### 5. Do not use Greninja or Scizor as the answer

- Scarf Chandelure outspeeds Greninja.
- Tera Blast Fighting is 2x on Greninja even through Tera Dark.
- Scizor Tera Water can emergency-survive Fire Blast, but Bullet Punch is neutral into Tera Fighting and does not break it.

### 6. Use Sableye as a Fighting pivot

Sableye is immune to Tera Blast Fighting while it is still Ghost-type. If Chandelure is Scarf-locked into Fighting, Sableye can come in freely and Knock Off/Taunt.

Do not Tera Sableye Fairy while Chandelure is active unless you have a specific reason; Tera is usually better spent on Tyranitar.

## Practical turn sequence vs Meowstic + Chandelure

1. Expect Tera Fighting on turn 1.
2. Tera Fairy Tyranitar is the safe default.
3. Sableye should Knock Off Chandelure, not WoW.
4. Turn 2, once Chandelure is Fighting-type, WoW it unless Meowstic has Safeguard up.
5. Get sand up and bring Excadrill in.
6. Force Chandelure out with neutral Life Orb damage.
7. If Meowstic sets Safeguard, kill Meowstic or Taunt it after Safeguard expires.

## Strategic point

Tera Fighting Chandelure is strong into Michael's default 4 because it removes the Dark/Rock weaknesses. But it also:

- Consumes Conor's Tera.
- Loses Fire's burn immunity.
- Remains vulnerable to Scarf removal.
- Takes sand chip.
- Folds to Gardevoir's Fairy/Psychic moves if Gardevoir can enter safely.

Michael should force that sequence rather than trying to out-type Chandelure with the default 4.

## Existing-doc corrections, not applied here

These lines are only true before Chandelure Terastallizes:

- `src/conor.md`: "Do not WoW Chandelure—Fire-types cannot be burned."
- `src/conor-turn-plan.md`: the same WoW rule.
- `src/conor-counter-plan.md`: "Chandelure is immune to WoW."

After Tera Fighting, Chandelure can be burned.
