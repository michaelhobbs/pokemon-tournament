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

| Pokemon              | Likely variants                                                                                                                                                                                                                | What it threatens                                                                                                                                                                                                                                                                                                                | How to answer                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Alolan Ninetales** | Snow Warning + Aurora Veil is the standard; Snow Cloak is possible. Light Clay, Focus Sash, or Icy Rock. Blizzard, Moonblast, Encore, Hypnosis, Protect.                                                                       | Aurora Veil halves damage; Blizzard is accurate in snow; Encore can lock a support move; Hypnosis bypasses Safety Goggles.                                                                                                                                                                                                       | If Snow Warning: lead Tyranitar. Sand Stream is slower than Snow Warning on a simultaneous switch-in, so it overwrites snow and denies turn-1 Veil. If Ninetales comes in later, Taunt it or Knock Off Light Clay before it sets Veil. If Snow Cloak: no Veil, so pressure it. Sand chip breaks Focus Sash. Safety Goggles do **not** block Hypnosis.                                                                                     |
| **Galarian Weezing** | Levitate, Neutralizing Gas, or Misty Surge. Black Sludge, Sitrus Berry, Rocky Helmet, or Safety Goggles. Strange Steam, Sludge Bomb, Will-O-Wisp, Pain Split, Toxic Spikes, Haze, Protect.                                     | **Neutralizing Gas suppresses Prankster, Technician, Sand Stream, Mold Breaker, Trace, and Truant while it is on the field, so Slaking attacks every turn unless it holds Ability Shield.** Levitate blocks Ground. Misty Surge blocks burn/poison/paralysis/sleep on grounded Pokemon. Toxic Spikes poison grounded switch-ins. | Scout the ability immediately. If Gas: KO Weezing before relying on Sableye, Scizor's Technician, or the sand core. Gardevoir Psychic, Scizor Bullet Punch, and Excadrill High Horsepower all hit it. If Levitate: Excadrill's Mold Breaker High Horsepower still hits. If Misty Surge: do not waste turns trying to burn Slaking; use Taunt, Knock Off, and attacks. Taunt Toxic Spikes or Rapid Spin them away.                         |
| **Amoonguss**        | Regenerator or Effect Spore. Rocky Helmet, Black Sludge, or Sitrus Berry. Spore, Rage Powder, Giga Drain, Sludge Bomb, Clear Smog, Protect, Foul Play.                                                                         | Spore, redirection, contact punishment, and Regenerator chip.                                                                                                                                                                                                                                                                    | Sableye's Safety Goggles blank Spore and Rage Powder for Sableye only; the partner can still be put to sleep. Taunt it before Spore/Rage Powder. Gardevoir Psychic threatens an OHKO on common spreads. Prefer non-contact damage if Rocky Helmet or Effect Spore is revealed. Safety Goggles do **not** block Effect Spore.                                                                                                              |
| **Blissey**          | Natural Cure, Serene Grace, or Healer. Leftovers or Sitrus Berry. Soft-Boiled, Seismic Toss, Toxic, Thunder Wave, Calm Mind, Ice Beam, Flamethrower, Shadow Ball, Counter, Heal Bell.                                          | Passive healing and status, or Calm Mind snowballing. Counter punishes careless physical hits.                                                                                                                                                                                                                                   | Taunt first. Scizor Close Combat is the fastest way to remove it if Flamethrower/Counter is not revealed. Gardevoir Psyshock/Focus Blast is the safer breaker if Counter is possible. Tyranitar Superpower also works.                                                                                                                                                                                                                    |
| **Shuckle**          | Sturdy, Gluttony, or Contrary. Mental Herb, Leftovers, or Sitrus Berry. Sticky Web, Stealth Rock, Toxic, Encore, Knock Off, Protect, Power Split, Shell Smash.                                                                 | Hazards and Encore can ruin positioning. Mental Herb blanks the first Taunt. Sturdy blocks a one-hit KO from attackers without Mold Breaker; Mold Breaker ignores it, but Shuckle's bulk still makes a KO unlikely.                                                                                                              | Do not lead Excadrill into Shuckle; Excadrill is faster and spins before hazards exist. Knock Off first, then Taunt. Bring Excadrill to Rapid Spin the turn after hazards go up. Mold Breaker Excadrill ignores Sturdy, but Shuckle's bulk still makes a one-hit KO unlikely; other attackers must break Sturdy first. If Contrary is revealed, Taunt it rather than feeding it stat drops.                                               |
| **Slaking**          | Truant is fixed unless Neutralizing Gas is up; Ability Shield keeps Truant active. Choice Band, Choice Scarf, or Life Orb. Double-Edge, Earthquake, Knock Off, Fire Punch, Ice Punch, Thunder Punch, Sucker Punch, Play Rough. | Enormous physical damage every other turn, or every turn under Neutralizing Gas. Fire Punch removes Scizor; Earthquake removes Tyranitar/Excadrill; Choice Band Play Rough OHKOs Sableye, while Life Orb leaves it at 8 HP.                                                                                                      | Sableye is the primary answer, but it has **no Protect**. Burn Slaking if terrain allows and Gas is not up; if Gas is up, remove Weezing first. At full HP Sableye survives one common neutral hit except Play Rough, then Recovers. If Misty Terrain blocks WoW, pivot Sableye into Double-Edge (immune), use the partner's Protect and Sableye's Recover on attack turns, and attack on Truant turns. Keep Scizor away from Fire Punch. |

Mark's Tera types are also unknown. If he Teras, re-check the type matchup instead of blindly clicking the base-type answer. For example, Tera Steel Weezing blanks Psychic and Bullet Punch, so switch to High Horsepower or Fire Punch.

## 4. Pick 4

Core rules:

- **Ninetales in Mark's four → bring Tyranitar.** Even if Ninetales turns out to be Snow Cloak, sand chip and Focus Sash breaking are useful.
- **Shuckle in Mark's four → bring Excadrill.** Assume hazards until proven otherwise.
- **Slaking in Mark's four → bring Sableye.** Burn it if possible; if Gas is up, remove Weezing first. Only stall Truant after Gas is gone. Sableye has no Protect.
- **Weezing in Mark's four → make sure you have a reliable way to remove it.** Gardevoir, Scizor, and Excadrill all qualify. This matters most if it reveals Neutralizing Gas.
- Fill with **Scizor + Gardevoir** by default. Greninja is the usual odd one out.

| Mark's four                               | Default bring                                                                              | Notes                                                   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| Ninetales / Weezing / Amoonguss / Blissey | Tyranitar, Sableye, Scizor, Gardevoir                                                      | Best balance into the stall core.                       |
| Ninetales / Weezing / Amoonguss / Shuckle | Tyranitar, Sableye, Scizor, Excadrill                                                      | Drop Gardevoir for hazard removal.                      |
| Weezing / Amoonguss / Blissey / Shuckle   | Sableye, Scizor, Gardevoir, Excadrill                                                      | Drop Tyranitar once Ninetales is absent.                |
| Any four with Slaking                     | Sableye mandatory; add Tyranitar if Ninetales, Excadrill if Shuckle, then Scizor/Gardevoir | Do not leave Scizor or Sableye alone with its coverage. |

If Mark has no Ninetales and no Shuckle, Tyranitar is optional. Gardevoir is usually the better fourth piece.

If you can only see Mark's six, use the blind four unless Shuckle is in the six and you expect hazards. Do not assume Shuckle is absent just because you cannot see his chosen four.

## 5. Speed analysis

All stats are level 100. Our speeds with the locked sets:

| Pokémon   | Speed | Notes                                                                 |
| --------- | ----: | --------------------------------------------------------------------- |
| Greninja  |   377 | Timid, 252 Spe. Fastest on our side.                                  |
| Gardevoir |   284 | Timid, 252 Spe.                                                       |
| Excadrill |   212 | Adamant, 0 Spe.                                                       |
| Scizor    |   166 | Adamant, 0 Spe.                                                       |
| Tyranitar |   158 | Adamant, 0 Spe.                                                       |
| Sableye   |   136 | Impish, 0 Spe. Prankster covers Taunt/WoW/Recover when Gas is absent. |

Mark's likely speeds, with common fast variants. These are not confirmed:

| Pokémon   | Common | Faster variants                                           |
| --------- | -----: | --------------------------------------------------------- |
| Ninetales |    348 | 317 neutral max; 522 Choice Scarf; doubles under Tailwind |
| Slaking   |    299 | 328 Jolly; 448 Scarf Adamant; 492 Scarf Jolly             |
| Weezing   |    156 | 219 neutral max; 240 Timid; 328 Scarf                     |
| Blissey   |    146 | 209 neutral max; 229 Timid; 313 Scarf                     |
| Amoonguss |     96 | 65 with 0 Speed IVs; 58 with 0 IVs and a hindering nature |
| Shuckle   |     46 | 15 with 0 Speed IVs; 13 with 0 IVs and a hindering nature |

Key speed interactions:

- **Greninja 377** outspeeds Ninetales 348 and unboosted Slaking 299. It does not outspeed Scarf Slaking 448/492 or Tailwind Ninetales. Do not lead Greninja just for speed if Tyranitar + Sableye is the better weather lead. After Ice Beam, Protean makes Greninja Ice-type and weak to Fire Punch; do not leave it in on Slaking.
- **Gardevoir 284** outspeeds the whole defensive core (Weezing/Blissey/Amoonguss/Shuckle) but not Ninetales 348 or max-Speed Slaking 299. Do not treat Gardevoir as a Slaking revenge killer.
- **Excadrill 212** outspeeds the defensive core but not Ninetales or Slaking. Rapid Spin gives +1 Speed, raising it to ~318, which beats unboosted Slaking but still not Ninetales.
- **Scizor 166** and **Tyranitar 158** are only 10 and 2 points above 0-Speed Weezing 156. If Weezing invests Speed, it can move first. Scizor's Bullet Punch ignores this; Tyranitar's Rock Slide does not.
- **Sableye 136** is slower than Blissey 146 and Weezing 156. Prankster makes that irrelevant for Taunt/WoW/Recover, but Neutralizing Gas removes the priority layer and lets Blissey/Weezing move first. This is another reason to KO Weezing immediately.
- **Tyranitar is intentionally slower than Ninetales.** On a simultaneous switch-in, Snow Warning resolves first and Sand Stream resolves last, so sand clears snow. Keep Tyranitar slow and bulky; do not give it Speed investment or a Speed item.
- **Choice Scarf Slaking** outspeeds everything at 448 (Adamant) or 492 (Jolly), but it gives up Choice Band power. Sableye still survives one neutral hit at full HP—except Choice Band Play Rough; Life Orb leaves it at 8 HP—and can burn it if terrain allows and Gas is not up. Do not try to outspeed Scarf Slaking; tank it.
- **Tailwind** doubles Mark's side: Ninetales 696, Slaking 598, Weezing 312, Blissey 292, Amoonguss 192. Then only Greninja 377 stays ahead of the defensive core, and it still loses to Ninetales/Slaking. Use Bullet Punch, Prankster, Taunt the setter, or stall the turns.
- **Trick Room** reverses order. Their Shuckle/Amoonguss become fastest; your Tyranitar/Excadrill/Scizor/Sableye become fast; Greninja/Gardevoir become liabilities. Priority (Bullet Punch, Prankster) still works. If Trick Room appears, bring the slow core and leave Greninja/Gardevoir.
- **Sticky Web** drops every grounded Pokémon we have by one stage: Greninja 251, Gardevoir 189, Excadrill 141, Scizor 110, Tyranitar 105, Sableye 90. Rapid Spin removes it and gives Excadrill +1 to ~318. This is why Excadrill is mandatory vs Shuckle and why you do not lead it into Shuckle.
- **Icy Wind** (-1 Speed to both foes) and **Thunder Wave** (halves Speed) can erase the Greninja/Gardevoir advantage. Taunt the users. Ninetales' Icy Wind is the main risk; Blissey's Thunder Wave is the other.
- **Weather does not change our speed.** We use Mold Breaker Excadrill, not Sand Rush. Snow boosts Ice-type Defense, not Speed. Except for the speed-control moves above, the order is raw stats.
- **Tera does not change Speed.** If you need a speed panic button, Scizor's Bullet Punch and Sableye's Prankster are the real ones; raw speed alone will not bail you out of Scarf or Tailwind.

## 6. Game 1 scouting, games 2–3 adjustment

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

- If Weezing has **Neutralizing Gas**, lead or switch in a Pokemon that can immediately KO it. Do not rely on Sableye's priority, Scizor's Technician, Sand Stream, or Truant while it is active.
- If Weezing has **Misty Surge**, stop planning around WoW on Slaking. Use the partner's Protect and Sableye's Recover on attack turns, and attack on Truant turns.
- If Ninetales has **Snow Cloak**, Tyranitar is less mandatory. You can bring Gardevoir or Greninja for more pressure.
- If Blissey has **Counter**, use Gardevoir Psyshock/Focus Blast instead of Scizor Close Combat.
- If Amoonguss has **Rage Powder**, favour spread Rock Slide, Taunt, and Safety Goggles Sableye.
- If Shuckle has **Mental Herb**, Knock Off first, then Taunt.
- If Slaking is **Choice-locked**, exploit the lock. If it is **Life Orb**, respect the coverage switch.

## 7. Lead and sequencing

### Default lead

- **Tyranitar + Sableye** when Ninetales is possible.
- Tyranitar is slower than Ninetales, so Sand Stream activates after Snow Warning and overwrites snow. This denies turn-1 Aurora Veil.
- If Ninetales switches in later, sand does **not** automatically reassert. Taunt it, Knock Off Light Clay before it sets Veil, or pivot Tyranitar out and back in to reset sand.

### If Weezing is likely to lead

- If you expect Neutralizing Gas and Slaking is not in the four, consider **Tyranitar + Gardevoir** instead, so you can immediately threaten Weezing with Psychic.
- If Slaking is in the four, keep Sableye accessible. Lead Tyranitar + Sableye by default, then bring Gardevoir/Scizor in to remove Weezing once you know its ability.
- If you expect **Gas + Slaking on the lead**, consider **Tyranitar + Gardevoir** instead; if Tyranitar is not in the four, use **Scizor + Gardevoir**. Sableye can be OHKOed by Play Rough before it moves; bring Sableye after Weezing is removed.
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
- Mold Breaker Excadrill ignores Sturdy, but Shuckle's bulk still makes a one-hit KO unlikely; other attackers must break Sturdy first.
- If it has Contrary, Taunt it rather than giving it free stat drops.

### Slaking

- Burn it with Sableye as soon as possible, but not if Gas is up and Slaking may click Play Rough. Choice Band Play Rough OHKOs Sableye; Life Orb leaves it at 8 HP.
- At full HP Sableye survives one common neutral hit—Earthquake around 60–70%, Fire Punch around 45–53%, Knock Off around 39–46%—but **not** Choice Band Play Rough. Life Orb Play Rough leaves it at 8 HP. Double-Edge is immune.
- If Misty Terrain is up, WoW fails on grounded Slaking. Pivot Sableye into Double-Edge, use the partner's Protect and Sableye's Recover on attack turns, and attack on Truant turns.
- After burn, Tyranitar and Excadrill can take one hit and retaliate, but they are not safe switch-ins to Choice Band Earthquake. Scizor still should not stay in on Fire Punch.
- Use Truant turns to attack or reposition, but only while Gas is absent.
- Do not Tera Sableye into Ghost against Slaking if it has Knock Off or Sucker Punch. Ghost becomes weak to Dark.
- Sableye has **no Protect**; when it needs to stall an attack turn, switch it out or let its partner Protect.

### Aurora Veil

- If Veil goes up, do not force KOs through it.
- Taunt Ninetales, chip with sand, and stall it out.
- Knock Off Light Clay only matters before the next Veil; it does not shorten an already-active one.
- If Ninetales is Snow Cloak, ignore this section.

## 8. Matchup cheat sheet

| Mark's Pokemon       | Your priority                                                                                                                                                                                                                                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Alolan Ninetales** | Tyranitar lead if Snow Warning. Rock Slide. Taunt or Knock Off if it tries to set Veil later. Excadrill Iron Head and Scizor Bullet Punch are the main damage. Gardevoir Tera Fairy Moonblast finishes it after chip. Safety Goggles do not stop Hypnosis.                                                                    |
| **Galarian Weezing** | Scout ability. If Gas, remove it first—Gas turns off Truant, so Slaking attacks every turn. Use Gardevoir Psychic, Scizor Bullet Punch, or Excadrill High Horsepower. If Levitate, High Horsepower still hits through Mold Breaker. If Misty Surge, stop relying on WoW. Knock Off its item; Taunt or spin away Toxic Spikes. |
| **Amoonguss**        | Sableye Safety Goggles blanks Spore/Rage Powder for Sableye only. Taunt it. Gardevoir Psychic is the cleanest KO. Avoid contact if Rocky Helmet or Effect Spore is revealed.                                                                                                                                                  |
| **Blissey**          | Taunt first. Scizor Close Combat if safe; Gardevoir Psyshock/Focus Blast if Counter is possible. Tyranitar Superpower is a backup.                                                                                                                                                                                            |
| **Shuckle**          | Knock Off, then Taunt. Bring Excadrill to Rapid Spin after hazards. Do not lead Excadrill. Mold Breaker ignores Sturdy, but Shuckle is still bulky enough that a one-hit KO is not guaranteed.                                                                                                                                |
| **Slaking**          | Sableye WoW if terrain allows and Gas is not up. Under Gas, kill Weezing first; Slaking has no Truant and Play Rough OHKOs Sableye. Sableye has no Protect. Keep Scizor away from Fire Punch. Respect Choice lock vs Life Orb.                                                                                                |

## 9. Tera priorities

| Tera                     | Use when                                                 | Notes                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tyranitar → Rock**     | When it flips a specific KO or prevents a loss           | Commonly used against Ninetales, but do not Tera turn 1 by default. Keeps the sand SpD boost if sand is up, makes Rock Slide 2x STAB, and turns Fairy from 2x to neutral. Tera Rock does **not** make Rock Slide super effective on Weezing. Loses Dark's resistances and Psychic immunity. If Neutralizing Gas is active, do not count on the sand SpD boost. |
| **Gardevoir → Fairy**    | You have a clean turn to KO Ninetales or Slaking         | Moonblast gets 2x STAB. Same-type Tera keeps Psychic STAB; it changes Gardevoir to mono-Fairy defensively. Good on a Truant turn when Gas is absent or Slaking has Ability Shield, or after Ninetales is chipped. Avoid switching Gardevoir in blind while Trace could copy Snow Warning, Misty Surge, or Truant.                                              |
| **Sableye → Ghost**      | Only when Slaking is absent or its Dark coverage is gone | Removes the Fairy weakness, resists Poison, and keeps the Normal/Fighting immunities. Becomes weak to Dark.                                                                                                                                                                                                                                                    |
| **Scizor → Steel**       | Only if Fire coverage is gone                            | Reduces Fire from 4x to 2x and powers up Bullet Punch, but adds Ground and Fighting weaknesses. Do not use it while Slaking can click Fire Punch.                                                                                                                                                                                                              |
| **Excadrill / Greninja** | Emergency only                                           | Do not burn the team's only Tera on these unless it wins the game immediately.                                                                                                                                                                                                                                                                                 |

You only get one Tera per battle. Do not use it on turn 1 unless it prevents a loss.

## 10. Baseline damage checks

These are against common bulky spreads, not Mark's confirmed sets. Add or subtract chip after scouting. No crits, no Aurora Veil, no snow, and no Neutralizing Gas unless stated. Snow boosts Ninetales's Defense by 1.5x, so rolls against Ninetales are optimistic while snow is up; Gas removes Technician, Sand Stream, and Mold Breaker.

- **Scizor Choice Band Bullet Punch vs Ninetales:** about 59–69%. Tera Steel: about 79–93%. Through Veil: about 30–35%, or 40–47% with Tera Steel. It is a 2HKO, not a OHKO.
- **Scizor Choice Band Close Combat vs Blissey:** OHKO on standard Blissey.
- **Scizor Choice Band Close Combat vs Slaking:** about 86–101%, a roll to OHKO. Slaking is faster and can OHKO Scizor with Fire Punch, so only attempt this on a Truant turn with Gas absent.
- **Tyranitar Assault Vest Rock Slide vs Ninetales:** about 76–89%. Tera Rock: OHKO. Through Veil: about 38–44%, or 51–59% with Tera Rock.
- **Tyranitar Superpower vs Blissey:** about 75–88%, a 2HKO.
- **Tyranitar Superpower vs Slaking:** about 59–69%, a 2HKO. Only click this on a Truant turn with Gas absent.
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
- **Slaking Play Rough vs Sableye:** OHKO. Do not leave Sableye in on it.
- **Sableye vs Slaking at full HP:** immune to Double-Edge, takes about 60–70% from Earthquake, 45–53% from Fire Punch, and 39–46% from Knock Off. Survives one of those hits and burns it if terrain allows and Gas is not up; Play Rough is the exception and OHKOs.

If Mark's spreads are bulkier than these baselines, assume one extra turn of chip. Do not overcommit to exact rolls.

## 11. Quick checklist

- [ ] Treat `pokemon-sets.ts` as gym data only, not tournament scouting.
- [ ] Scout Ninetales and Weezing abilities before committing to a line.
- [ ] Bring Tyranitar if Ninetales is in Mark's four.
- [ ] Lead Tyranitar + Sableye against likely Snow Warning.
- [ ] Bring Excadrill if Shuckle is in Mark's four.
- [ ] Do not lead Excadrill into Shuckle.
- [ ] Knock Off Shuckle's item before Taunting it.
- [ ] Remove Weezing before relying on Prankster, Technician, Sand Stream, Mold Breaker, Trace, or Truant if it has Neutralizing Gas.
- [ ] Burn Slaking if terrain allows and Gas is not up; under Gas, kill Weezing first. Only stall Truant after Gas is gone.
- [ ] Taunt Blissey before it heals or sets up, Amoonguss before it Spores, and Weezing before it burns or sets Toxic Spikes.
- [ ] Keep Scizor away from Slaking's Fire Punch.
- [ ] Do not leave Sableye in on Play Rough; it has no Protect.
- [ ] Do not Tera Sableye into Ghost against Dark coverage.
- [ ] Save Tera for Tyranitar Rock, Gardevoir Fairy, or Sableye Ghost when it matters.
- [ ] Do not Tera Rock into Weezing expecting Rock Slide to become super effective.
- [ ] Use Safety Goggles Sableye to blank Spore and Rage Powder; they do not protect the partner.
- [ ] Re-check type matchups if Mark Teras.
