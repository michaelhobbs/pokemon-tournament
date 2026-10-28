# Michael vs Conor — Tera Fighting Chandelure Addendum

This addendum supplements `src/conor-counter-plan.md` and `src/conor.md`. It does not replace them.

## Key correction: Tera Fighting Chandelure can be burned

The existing notes say Chandelure is immune to Will-O-Wisp. That is only true **before** it Terastallizes.

In current-gen mechanics, Tera Fighting makes Chandelure mono-Fighting, so it loses Fire's burn immunity. Verified in `@pkmn/sim`: Fire's `brn` immunity applies to its current type, and a Terastallized Pokémon's current type is its Tera type.

Timing matters:

- Tera resolves before moves, so if Chandelure Terastallizes, it is Fighting-type before Sableye's WoW resolves; WoW works on that same turn.
- If Chandelure does not Terastallize, it is still Fire-type, so WoW fails.
- Fake Out cannot stop Terastallization; the Tera action happens before Fake Out and all other moves.
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
2. Tera Fairy Tyranitar is the safe default; Fake Out cannot stop it.
3. Sableye should Knock Off Chandelure; it works before and after Tera and removes Scarf.
4. If Chandelure has Terastallized and Safeguard is not up, WoW is live on that same turn; if it has not Terastallized, WoW fails.
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

## Existing-doc corrections

These lines are only true before Chandelure Terastallizes:

- `src/conor-turn-plan.md`: the WoW override is now qualified.
- `src/conor-counter-plan.md`: the WoW matchup notes are now qualified.
- `src/conor-final-tips.md`: the switch-in WoW note is now qualified.

After Tera Fighting, Chandelure can be burned.
