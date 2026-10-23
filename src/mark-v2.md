# Game plan: Michael (7) vs Mark (2) — Second Half (v2, set-agnostic)

This supersedes `mark.md` and `mark-detail.md`.

**Important:** `src/data/pokemon-sets.ts` is only for the website's gym battles. It is **not** tournament scouting. Mark's exact abilities, items, moves, EVs, natures, and Tera types are unknown. Michael's six sets are locked for all three games, so the plan has to survive several possible Mark builds.

## 1. Hard facts vs assumptions

Hard facts:

- Michael's roster: Scizor, Greninja, Excadrill, Tyranitar, Gardevoir, Sableye.
- Mark's roster: Alolan Ninetales, Galarian Weezing, Amoonguss, Blissey, Shuckle, Slaking.
- Format: level 100 Doubles Custom Game, pick 4 from 6, all three games played.
- Configuration is fixed for the set of three games. You can choose a different four and different leads each game, but not different moves/EVs/items.
- One Tera per battle per team.
- Taunt lasts 3 turns.
- Same-type Tera still becomes mono-type defensively. Tera Rock Tyranitar is Rock only; Tera Steel Scizor is Steel only. Original-type STAB is retained.

Unknown until scouted:

- Whether Ninetales has Snow Warning or Snow Cloak.
- Whether Weezing has Levitate, Neutralizing Gas, or Misty Surge.
- Whether Amoonguss has Regenerator or Effect Spore, and whether it has Spore / Rage Powder / Rocky Helmet.
- Whether Blissey is the passive Soft-Boiled set, Calm Mind, Counter, or special coverage.
- Whether Shuckle is hazards/Encore, Mental Herb, or something stranger.
- Slaking's item and coverage. Truant is fixed, but Choice Band, Choice Scarf, and Life Orb all change the maths.
- Everyone's Tera types.

## 2. Michael's six-set configuration

These replace the registered sets. All six items are unique.

```plaintext
Scizor @ Choice Band
Ability: Technician
Tera Type: Steel
EVs: 252 HP / 252 Atk / 4 Def
Adamant Nature
- Bullet Punch
- U-turn
- Knock Off
- Close Combat

Tyranitar @ Assault Vest
Ability: Sand Stream
Tera Type: Rock
EVs: 252 HP / 252 Atk / 4 SpD
Adamant Nature
- Rock Slide
- Crunch
- Fire Punch
- Superpower

Excadrill @ Leftovers
Ability: Mold Breaker
Tera Type: Ground
EVs: 252 HP / 252 Atk / 4 Def
Adamant Nature
- High Horsepower
- Iron Head
- Rapid Spin
- Protect

Gardevoir @ Choice Specs
Ability: Trace
Tera Type: Fairy
EVs: 4 HP / 252 SpA / 252 Spe
Timid Nature
- Psychic
- Psyshock
- Moonblast
- Focus Blast

Greninja @ Life Orb
Ability: Protean
Tera Type: Water
EVs: 4 HP / 252 SpA / 252 Spe
Timid Nature
- Hydro Pump
- Ice Beam
- Dark Pulse
- U-turn

Sableye @ Safety Goggles
Ability: Prankster
Tera Type: Ghost
EVs: 252 HP / 252 Def / 4 SpD
Impish Nature
- Taunt
- Will-O-Wisp
- Knock Off
- Recover
```

These six are deliberately general: weather control, hazard removal, priority, special breaking, and Prankster disruption. Do not overfit them to one guessed Mark set.

## 3. Mark's likely branches

Treat everything below as a branch to scout, not a known set.

| Pokemon              | Likely variants                                                                                                                                                                            | What it threatens                                                                                                                                                                                                 | How to answer                                                                                                                                                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Alolan Ninetales** | Snow Warning + Aurora Veil is the standard; Snow Cloak is possible. Light Clay, Focus Sash, or Icy Rock. Blizzard, Moonblast, Encore, Hypnosis, Protect.                                   | Aurora Veil halves damage; Blizzard is accurate in snow; Encore can lock a support move.                                                                                                                          | If Snow Warning: lead Tyranitar. Sand Stream is slower than Snow Warning on a simultaneous switch-in, so it overwrites snow and denies turn-1 Veil. If Ninetales comes in later, Taunt it or Knock Off Light Clay before it sets Veil. If Snow Cloak: no Veil, so pressure it. Sand chip breaks Focus Sash.                                           |
| **Galarian Weezing** | Levitate, Neutralizing Gas, or Misty Surge. Black Sludge, Sitrus Berry, Rocky Helmet, or Safety Goggles. Strange Steam, Sludge Bomb, Will-O-Wisp, Pain Split, Toxic Spikes, Haze, Protect. | **Neutralizing Gas suppresses Prankster, Technician, Sand Stream, Mold Breaker, and Trace while it is on the field.** Levitate blocks Ground. Misty Surge blocks burn/poison/paralysis/sleep on grounded Pokemon. | Scout the ability immediately. If Gas: KO Weezing before relying on Sableye or Scizor's Technician. Gardevoir Psychic, Scizor Bullet Punch, and Excadrill High Horsepower all hit it. If Levitate: Excadrill's Mold Breaker High Horsepower still hits. If Misty Surge: do not waste turns trying to burn Slaking; use Taunt, Knock Off, and attacks. |
| **Amoonguss**        | Regenerator or Effect Spore. Rocky Helmet, Black Sludge, or Sitrus Berry. Spore, Rage Powder, Giga Drain, Sludge Bomb, Clear Smog, Protect, Foul Play.                                     | Spore, redirection, contact punishment, and Regenerator chip.                                                                                                                                                     | Sableye's Safety Goggles blank Spore and Rage Powder. Taunt it before Spore/Rage Powder. Gardevoir Psychic threatens an OHKO on common spreads. Prefer non-contact damage if Rocky Helmet or Effect Spore is revealed.                                                                                                                                |
| **Blissey**          | Natural Cure, Serene Grace, or Healer. Leftovers or Sitrus Berry. Soft-Boiled, Seismic Toss, Toxic, Thunder Wave, Calm Mind, Ice Beam, Flamethrower, Shadow Ball, Counter, Heal Bell.      | Passive healing and status, or Calm Mind snowballing. Counter punishes careless physical hits.                                                                                                                    | Taunt first. Scizor Close Combat is the fastest way to remove it if Flamethrower/Counter is not revealed. Gardevoir Psyshock/Focus Blast is the safer breaker if Counter is possible. Tyranitar Superpower also works.                                                                                                                                |
| **Shuckle**          | Sturdy, Gluttony, or Contrary. Mental Herb, Leftovers, or Sitrus Berry. Sticky Web, Stealth Rock, Toxic, Encore, Knock Off, Protect, Power Split, Shell Smash.                             | Hazards and Encore can ruin positioning. Mental Herb blanks the first Taunt. Sturdy guarantees it survives one hit.                                                                                               | Do not lead Excadrill into Shuckle; Excadrill is faster and spins before hazards exist. Knock Off first, then Taunt. Bring Excadrill to Rapid Spin the turn after hazards go up. Do not waste a big attack expecting a KO through Sturdy. If Contrary is revealed, Taunt it rather than feeding it stat drops.                                        |
| **Slaking**          | Truant is fixed. Choice Band, Choice Scarf, or Life Orb. Double-Edge, Earthquake, Knock Off, Fire Punch, Ice Punch, Thunder Punch, Sucker Punch.                                           | Enormous physical damage every other turn. Fire Punch removes Scizor; Earthquake removes Tyranitar/Excadrill.                                                                                                     | Sableye is the primary answer. Burn it if terrain allows. At full HP Sableye survives one common neutral hit, then Recovers. If Misty Terrain blocks WoW, pivot Sableye into Double-Edge (immune), use Protect/Recover on attack turns, attack on Truant turns, and remove Weezing. Keep Scizor away from Fire Punch.                                 |

Mark's Tera types are also unknown. If he Teras, re-check the type matchup instead of blindly clicking the base-type answer. For example, Tera Steel Weezing blanks Psychic and Bullet Punch, so switch to High Horsepower or Fire Punch.

## 4. Pick 4

Core rules:

- **Ninetales in Mark's four → bring Tyranitar.** Even if Ninetales turns out to be Snow Cloak, sand chip and Focus Sash breaking are useful.
- **Shuckle in Mark's four → bring Excadrill.** Assume hazards until proven otherwise.
- **Slaking in Mark's four → bring Sableye.** Burn it if possible; otherwise pivot and stall Truant.
- **Weezing in Mark's four → make sure you have a reliable way to remove it.** Gardevoir, Scizor, and Excadrill all qualify. This matters most if it reveals Neutralizing Gas.
- Fill with **Scizor + Gardevoir** by default. Greninja is the usual odd one out.

| Mark's four                               | Default bring                                                                              | Notes                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| Ninetales / Weezing / Amoonguss / Blissey | Tyranitar, Sableye, Scizor, Gardevoir                                                      | Best balance into the stall core.               |
| Ninetales / Weezing / Amoonguss / Shuckle | Tyranitar, Sableye, Scizor, Excadrill                                                      | Drop Gardevoir for hazard removal.              |
| Weezing / Amoonguss / Blissey / Shuckle   | Sableye, Scizor, Gardevoir, Excadrill                                                      | Tyranitar is optional once Ninetales is absent. |
| Any four with Slaking                     | Sableye mandatory; add Tyranitar if Ninetales, Excadrill if Shuckle, then Scizor/Gardevoir | Do not leave Scizor alone with Slaking.         |

If Mark has no Ninetales and no Shuckle, Tyranitar is optional. Gardevoir is usually the better fourth piece.

## 5. Game 1 scouting, games 2–3 adjustment

Game 1 is information. You cannot change your six sets afterwards, but you can change your four and leads.

Scout in this order:

1. **Ninetales ability.** Snow Warning means Aurora Veil is real. Snow Cloak means it is not.
2. **Weezing ability.** Gas changes everything; Levitate changes Ground; Misty Surge changes status.
3. **Amoonguss moves/item.** Does it have Spore, Rage Powder, Rocky Helmet, or Effect Spore?
4. **Blissey set.** Calm Mind? Counter? Flamethrower/Ice Beam? Heal Bell?
5. **Shuckle item.** Mental Herb changes the Taunt sequencing.
6. **Slaking item and coverage.** Choice lock is exploitable; Life Orb is not.
7. **Tera types.** Note what Mark Teras into and whether he saves it.

Games 2–3:

- If Weezing has **Neutralizing Gas**, lead or switch in a Pokemon that can immediately KO it. Do not rely on Sableye's priority, Scizor's Technician, or Sand Stream while it is active.
- If Weezing has **Misty Surge**, stop planning around WoW on Slaking. Use Protect/Recover on attack turns and attack on Truant turns.
- If Ninetales has **Snow Cloak**, Tyranitar is less mandatory. You can bring Gardevoir or Greninja for more pressure.
- If Blissey has **Counter**, use Gardevoir Psyshock/Focus Blast instead of Scizor Close Combat.
- If Amoonguss has **Rage Powder**, favour spread Rock Slide, Taunt, and Safety Goggles Sableye.
- If Shuckle has **Mental Herb**, Knock Off first, then Taunt.
- If Slaking is **Choice-locked**, exploit the lock. If it is **Life Orb**, respect the coverage switch.

## 6. Lead and sequencing

### Default lead

- **Tyranitar + Sableye** when Ninetales is possible.
- Tyranitar is slower than Ninetales, so Sand Stream activates after Snow Warning and overwrites snow. This denies turn-1 Aurora Veil.
- If Ninetales switches in later, sand does **not** automatically reassert. Taunt it, Knock Off Light Clay before it sets Veil, or pivot Tyranitar out and back in to reset sand.

### If Weezing is likely to lead

- If you expect Neutralizing Gas and Slaking is not in the four, consider **Tyranitar + Gardevoir** instead, so you can immediately threaten Weezing with Psychic.
- If Slaking is in the four, keep Sableye accessible. Lead Tyranitar + Sableye, then bring Gardevoir/Scizor in to remove Weezing once you know its ability.
- Do not spend the first turns relying on Prankster or Technician until Weezing is gone or its ability is confirmed not to be Gas.

### Taunt priority

Use Sableye's Prankster Taunt in this order, depending on what is on the field:

1. **Amoonguss** before Spore or Rage Powder.
2. **Blissey** before Soft-Boiled or Calm Mind.
3. **Weezing** before Will-O-Wisp, Toxic Spikes, or Pain Split, if Prankster is active.
4. **Shuckle** before hazards, after Knocking Off its item.
5. **Ninetales** if sand is not up and it can set Aurora Veil.

Reapply Taunt every 3 turns. If Weezing has Neutralizing Gas, Prankster is suppressed and Taunt is not priority—KO Weezing first.

### Knock Off

Knock Off is good even without exact set knowledge. Likely high-value targets:

- Ninetales: Light Clay, Focus Sash, or Icy Rock.
- Weezing: Black Sludge, Sitrus Berry, Rocky Helmet, or Safety Goggles.
- Amoonguss: Rocky Helmet, Black Sludge, or Sitrus Berry.
- Blissey: Leftovers or Sitrus Berry.
- Shuckle: Mental Herb, Leftovers, or Sitrus Berry.
- Slaking: Choice Band, Choice Scarf, or Life Orb.

If Aurora Veil is already up, Knocking Off Light Clay does not shorten the current Veil. Taunt/stall it out instead.

### Shuckle

- Do not lead Excadrill into Shuckle. Excadrill is faster, so Rapid Spin happens before Shuckle sets hazards.
- Lead Sableye. Knock Off first, then Taunt, or let Shuckle set hazards and bring Excadrill in next turn to Rapid Spin.
- Sturdy means it survives one hit. Do not waste a big attack expecting a KO.
- If it has Contrary, Taunt it rather than giving it free stat drops.

### Slaking

- Burn it with Sableye as soon as possible.
- At full HP Sableye survives one common neutral hit: Earthquake around 60–70%, Fire Punch around 45–53%, Knock Off around 39–46%. Double-Edge is immune.
- If Misty Terrain is up, WoW fails on grounded Slaking. Pivot Sableye into Double-Edge, use Protect/Recover on attack turns, attack on Truant turns, and remove Weezing.
- After burn, Tyranitar and Excadrill can tank its hits. Scizor still should not stay in on Fire Punch.
- Use Truant turns to attack or reposition.
- Do not Tera Sableye into Ghost against Slaking if it has Knock Off or Sucker Punch. Ghost becomes weak to Dark.

### Aurora Veil

- If Veil goes up, do not force KOs through it.
- Taunt Ninetales, chip with sand, and stall it out.
- Knock Off Light Clay only matters before the next Veil; it does not shorten an already-active one.
- If Ninetales is Snow Cloak, ignore this section.

## 7. Matchup cheat sheet

| Mark's Pokemon       | Your priority                                                                                                                                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Alolan Ninetales** | Tyranitar lead if Snow Warning. Rock Slide. Taunt or Knock Off if it tries to set Veil later. Excadrill Iron Head and Scizor Bullet Punch are the main damage. Gardevoir Tera Fairy Moonblast finishes it after chip.                    |
| **Galarian Weezing** | Scout ability. If Gas, remove it first with Gardevoir Psychic, Scizor Bullet Punch, or Excadrill High Horsepower. If Levitate, High Horsepower still hits through Mold Breaker. If Misty Surge, stop relying on WoW. Knock Off its item. |
| **Amoonguss**        | Sableye Safety Goggles blanks Spore/Rage Powder. Taunt it. Gardevoir Psychic is the cleanest KO. Avoid contact if Rocky Helmet or Effect Spore is revealed.                                                                              |
| **Blissey**          | Taunt first. Scizor Close Combat if safe; Gardevoir Psyshock/Focus Blast if Counter is possible. Tyranitar Superpower is a backup.                                                                                                       |
| **Shuckle**          | Knock Off, then Taunt. Bring Excadrill to Rapid Spin after hazards. Do not lead Excadrill. Do not expect a one-hit KO through Sturdy.                                                                                                    |
| **Slaking**          | Sableye WoW. If terrain blocks it, pivot and stall Truant. Keep Scizor away from Fire Punch. Respect Choice lock vs Life Orb.                                                                                                            |

## 8. Tera priorities

| Tera                     | Use when                                                 | Notes                                                                                                                                                                                                                   |
| ------------------------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tyranitar → Rock**     | Default against Ninetales/Weezing                        | Keeps the sand SpD boost if sand is up, makes Rock Slide 2x STAB, and turns Fairy from 2x to neutral. Loses Dark's resistances and Psychic immunity. If Neutralizing Gas is active, do not count on the sand SpD boost. |
| **Gardevoir → Fairy**    | You have a clean turn to KO Ninetales or Slaking         | Moonblast gets 2x STAB. Good on a Truant turn or after Ninetales is chipped. Avoid switching Gardevoir into Ninetales while Trace could copy Snow Warning.                                                              |
| **Sableye → Ghost**      | Only when Slaking is absent or its Dark coverage is gone | Removes the Fairy weakness, resists Poison, and keeps the Normal/Fighting immunities. Becomes weak to Dark.                                                                                                             |
| **Scizor → Steel**       | Only if Fire coverage is gone                            | Reduces Fire from 4x to 2x and powers up Bullet Punch, but adds Ground and Fighting weaknesses. Do not use it while Slaking can click Fire Punch.                                                                       |
| **Excadrill / Greninja** | Emergency only                                           | Do not burn the team's only Tera on these unless it wins the game immediately.                                                                                                                                          |

You only get one Tera per battle. Do not use it on turn 1 unless it prevents a loss.

## 9. Baseline damage checks

These are against common bulky spreads, not Mark's confirmed sets. Add or subtract chip after scouting. No crits, no Aurora Veil or snow unless stated.

- **Scizor Choice Band Bullet Punch vs Ninetales:** about 59–69%. Tera Steel: about 79–93%. Through Veil: about 30–35%, or 40–47% with Tera Steel. It is a 2HKO, not a OHKO.
- **Scizor Choice Band Close Combat vs Blissey:** OHKO on standard Blissey.
- **Scizor Choice Band Close Combat vs Slaking:** about 86–101%, a roll to OHKO. Slaking is faster and can OHKO Scizor with Fire Punch, so only attempt this on a Truant turn.
- **Tyranitar Assault Vest Rock Slide vs Ninetales:** about 76–89%. Tera Rock: OHKO. Through Veil: about 38–44%, or 51–59% with Tera Rock.
- **Tyranitar Superpower vs Blissey:** about 75–88%, a 2HKO.
- **Tyranitar Superpower vs Slaking:** about 59–69%, a 2HKO.
- **Gardevoir Choice Specs Psychic vs Weezing:** OHKO on common spreads.
- **Gardevoir Choice Specs Psychic vs Amoonguss:** OHKO on common spreads.
- **Gardevoir Choice Specs Psyshock vs Blissey:** about 49–57%, a 2HKO.
- **Gardevoir Tera Fairy Moonblast vs Ninetales:** about 87–102%, a roll to OHKO.
- **Gardevoir Tera Fairy Moonblast vs Slaking:** about 85–100%, a roll to OHKO.
- **Excadrill Iron Head vs Ninetales:** OHKO.
- **Excadrill High Horsepower vs Weezing:** about 62–73%, a 2HKO through Levitate thanks to Mold Breaker.
- **Greninja Life Orb Ice Beam vs Amoonguss:** about 91–107% without Veil, 46–54% through Veil.
- **Slaking Choice Band Fire Punch vs Scizor:** OHKO.
- **Slaking Choice Band Earthquake vs Tyranitar:** OHKO.
- **Slaking Choice Band Earthquake vs Excadrill:** OHKO.
- **Sableye vs Slaking at full HP:** immune to Double-Edge, takes about 60–70% from Earthquake, 45–53% from Fire Punch, and 39–46% from Knock Off. Survives one hit and burns it if terrain allows.

If Mark's spreads are bulkier than these baselines, assume one extra turn of chip. Do not overcommit to exact rolls.

## 10. Quick checklist

- [ ] Treat `pokemon-sets.ts` as gym data only, not tournament scouting.
- [ ] Scout Ninetales and Weezing abilities before committing to a line.
- [ ] Bring Tyranitar if Ninetales is in Mark's four.
- [ ] Lead Tyranitar + Sableye against likely Snow Warning.
- [ ] Bring Excadrill if Shuckle is in Mark's four.
- [ ] Do not lead Excadrill into Shuckle.
- [ ] Knock Off Shuckle's item before Taunting it.
- [ ] Remove Weezing before relying on Prankster, Technician, Sand Stream, Mold Breaker, or Trace if it has Neutralizing Gas.
- [ ] Burn Slaking if terrain allows; otherwise pivot and stall Truant.
- [ ] Taunt Blissey before it heals or sets up, Amoonguss before it Spores, and Weezing before it burns.
- [ ] Keep Scizor away from Slaking's Fire Punch.
- [ ] Do not Tera Sableye into Ghost against Dark coverage.
- [ ] Save Tera for Tyranitar Rock, Gardevoir Fairy, or Sableye Ghost when it matters.
- [ ] Use Safety Goggles Sableye to blank Spore and Rage Powder.
- [ ] Re-check type matchups if Mark Teras.
