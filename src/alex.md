# Alex rematch: Michael's game plan

> Second-half round robin. Alex beat Michael **2–1** in the first half. Alex swapped **Gothitelle → Klefki** at midseason. This plan assumes Michael's roster is locked and Alex's six is known; Alex's exact tournament sets are not.

## The short version

1. Bring **Tyranitar, Sableye, Excadrill, Greninja**.
2. Lead **Tyranitar + Sableye**.
3. Keep **sand** up. Tera Poison Tyranitar when rain or Blaziken would otherwise KO it.
4. **Taunt Blaziken** to stop setup, **Knock Off** its Life Orb, and **Foul Play** for damage. **Taunt** the support mon, **Fire Punch** Ferrothorn/Klefki, **High Horsepower** Blaziken/Klefki with Excadrill.
5. Do not let Ludicolo sit in rain. Do not leave Sableye in on Ludicolo/Clefable. Do not lead Scizor into Blaziken.

## Format and assumptions

- Level 100 Doubles Custom Game; pick 4 from 6; all three games played.
- Configuration is fixed for the three-game set; one Tera per battle.
- Michael's roster: Scizor, Greninja, Excadrill, Tyranitar, Gardevoir, Sableye.
- Alex's post-swap roster: Ferrothorn, Clefable, Politoed, Ludicolo, Blaziken, Klefki.
- Alex's exact moves, items, EVs and Tera types are unknown. Treat the registered gym sets in `src/data/pokemon-sets.ts` as hints only, not scouting.
- Likely Alex shape: **Politoed Drizzle + Ludicolo Swift Swim** rain core, **Blaziken Speed Boost** breaker, **Ferrothorn** hazards/contact punishment, **Clefable** redirection/support, **Klefki** Prankster screens.

## Alex's six: what matters

| Alex           | Likely role                 | What matters                                                                                                                                            |
| -------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Politoed**   | Drizzle + Damp Rock         | Starts 8-turn rain. Slower than Tyranitar, so sand wins on a simultaneous lead.                                                                         |
| **Ludicolo**   | Swift Swim + Life Orb       | Biggest immediate threat. Rain Hydro Pump OHKOs un-Teraed Tyranitar and most of the team.                                                               |
| **Blaziken**   | Speed Boost + Life Orb      | Snowballs with Protect/Swords Dance. Close Combat OHKOs un-Teraed Tyranitar. It is Fire-type, so **it cannot be burned**. Taunt/Knock Off/Foul Play it. |
| **Ferrothorn** | Iron Barbs + hazards        | Stealth Rock/Spikes/Leech Seed, Gyro Ball, Power Whip. Punishes contact.                                                                                |
| **Clefable**   | Magic Guard/Unaware support | Follow Me redirection, Thunder Wave, Encore, Wish/Soft-Boiled, Calm Mind. Taunt it.                                                                     |
| **Klefki**     | Prankster + Light Clay      | Screens, Thunder Wave, Foul Play. Faster Prankster than Sableye, so its first screen beats Taunt.                                                       |

## Michael's six: use these sets

```plaintext
Tyranitar @ Assault Vest
Ability: Sand Stream
Tera Type: Poison
Adamant Nature
EVs: 252 HP / 252 Atk / 4 SpD
- Rock Slide
- Crunch
- Fire Punch
- Superpower

Excadrill @ Life Orb
Ability: Sand Rush
Tera Type: Steel
Adamant Nature
EVs: 252 Atk / 4 Def / 252 Spe
- High Horsepower
- Iron Head
- Rapid Spin
- Protect

Scizor @ Choice Band
Ability: Technician
Tera Type: Steel
Adamant Nature
EVs: 252 HP / 252 Atk / 4 Def
- Bullet Punch
- U-turn
- Knock Off
- Close Combat

Gardevoir @ Choice Specs
Ability: Trace
Tera Type: Fairy
Timid Nature
EVs: 4 HP / 252 SpA / 252 Spe
- Psychic
- Psyshock
- Moonblast
- Focus Blast

Greninja @ Expert Belt
Ability: Protean
Tera Type: Water
Timid Nature
EVs: 4 HP / 252 SpA / 252 Spe
- Hydro Pump
- Ice Beam
- Dark Pulse
- U-turn

Sableye @ Leftovers
Ability: Prankster
Tera Type: Poison
Impish Nature
EVs: 252 HP / 252 Def / 4 SpD
- Taunt
- Foul Play
- Knock Off
- Recover
```

All six items are unique: Assault Vest / Life Orb / Choice Band / Choice Specs / Expert Belt / Leftovers.

### Why this six

- **Tyranitar is mandatory.** Sand Stream is the only thing that stops rain from running over the team. It also gives Excadrill Sand Rush.
- **Sableye is mandatory.** Prankster Taunt/Foul Play/Knock Off/Recover is the team's glue. It has no Protect; do not treat it as a tank.
- **Excadrill is the default fourth.** In sand it outspeeds rain Ludicolo and +1 Adamant Blaziken, and threatens Blaziken/Klefki/Clefable.
- **Greninja is the default fourth attacker.** Fast, hits Blaziken/Ludicolo, and gives a Water resist. It is frail.
- **Scizor is the bench anti-Fairy/anti-Ferrothorn pick.** Good when Blaziken is absent; unplayable into Blaziken.
- **Gardevoir is the bench breaker.** Good into Ferrothorn/Blaziken; bad into Ferrothorn's Gyro Ball and Politoed's Drizzle.

## Pick 4

Default: **Tyranitar / Sableye / Excadrill / Greninja**.

| Alex's four                    | Bring                                                | Why                                                           |
| ------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------- |
| Rain core: Politoed + Ludicolo | Tyranitar / Sableye / Excadrill / Greninja           | Sand + Tera Poison Tyranitar; Greninja for Ludicolo/Blaziken. |
| Blaziken in the four           | Tyranitar / Sableye / Excadrill / Greninja           | Never bring Scizor into Blaziken.                             |
| No Blaziken, no Ludicolo       | Tyranitar / Sableye / Excadrill / Scizor             | Scizor is safe and checks Clefable/Klefki/Ferrothorn.         |
| No Blaziken, Ludicolo present  | Tyranitar / Sableye / Excadrill / Greninja           | Ludicolo still demands Greninja/sand pressure.                |
| No Politoed                    | Tyranitar / Sableye / Excadrill / Greninja or Scizor | Without rain, Tyranitar is safer; Scizor if no Blaziken.      |
| No Ludicolo                    | Tyranitar / Sableye / Excadrill / Scizor or Greninja | Greninja less necessary; Scizor if no Blaziken.               |
| No Ferrothorn/Klefki           | Tyranitar / Sableye / Excadrill / Greninja           | Keep the faster default; Gardevoir is not needed.             |

Hard rules:

- **Tyranitar and Sableye are in every game.**
- **Scizor only if Blaziken is not in Alex's four.**
- **Gardevoir only as a breaker**, not as a Blaziken answer and not as a Ferrothorn answer.
- If Alex's four is unknown, use the default four.

## Leads

Default lead: **Tyranitar + Sableye**.

| Alex's lead           | Michael's lead      | Turn 1 priority                                                                                                            |
| --------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Politoed + Ludicolo   | Tyranitar + Sableye | Tyranitar Rock Slide; Sableye Taunt Ludicolo (Rain Dance) or Knock Off Politoed.                                           |
| Politoed + Blaziken   | Tyranitar + Sableye | Sableye Taunt Blaziken to stop setup, or Knock Off Life Orb; Tyranitar Tera Poison + Rock Slide if Close Combat is likely. |
| Politoed + Ferrothorn | Tyranitar + Sableye | Sableye Taunt Ferrothorn; Tyranitar Fire Punch Ferrothorn.                                                                 |
| Politoed + Klefki     | Tyranitar + Sableye | Sableye Taunt Klefki (its first screen still lands); Tyranitar Fire Punch Klefki.                                          |
| Politoed + Clefable   | Tyranitar + Sableye | Sableye Taunt Clefable; Tyranitar Rock Slide.                                                                              |
| Ludicolo + Blaziken   | Tyranitar + Sableye | Sableye Taunt Blaziken unless Rain Dance is the bigger threat; Tyranitar Rock Slide.                                       |
| Ferrothorn + Klefki   | Tyranitar + Sableye | Sableye Taunt Klefki or Ferrothorn; Tyranitar Fire Punch the other.                                                        |
| Clefable + Blaziken   | Tyranitar + Sableye | Sableye Taunt Clefable; Tyranitar Tera Poison Rock Slide; Taunt/Knock Off Blaziken next turn.                              |
| Klefki + Blaziken     | Tyranitar + Sableye | Sableye Taunt Blaziken or Knock Off Life Orb; Tyranitar Fire Punch Klefki; Tera Poison if needed.                          |
| Ferrothorn + Clefable | Tyranitar + Sableye | Sableye Taunt Clefable; Tyranitar Rock Slide, not Fire Punch into Follow Me.                                               |

If Alex leads something unexpected, default to **Tyranitar + Sableye**, get sand up, and use Taunt/Foul Play/Knock Off before attacking.

## Weather war

- Tyranitar's Sand Stream sets 5 turns of sand. Politoed's Drizzle sets 5 turns, or 8 with Damp Rock.
- **Politoed is faster than Tyranitar** (176 vs 158). If both enter on the same turn, Drizzle activates first and Sand Stream activates last, so **sand wins**.
- If Politoed switches in later, rain overwrites sand. Reset by switching Tyranitar out and back in, or KO Politoed.
- Knock Off a Damp Rock **before** the next Drizzle to cut future rain from 8 turns to 5. Removing Damp Rock after rain starts does not shorten the current rain.
- Sand chips Politoed, Ludicolo and Blaziken. It does not chip Ferrothorn, Klefki, or a Magic Guard Clefable.
- Tera Poison Tyranitar **loses Rock's sand Special Defense boost and sand immunity**. It takes sand chip while Terastallized.
- Without sand, Excadrill loses Sand Rush and drops from 550 Speed to 275. Keep sand up or preserve Excadrill for the endgame.

## Speed benchmarks

| Pokémon    | Speed | Relevant boost                                         |
| ---------- | ----: | ------------------------------------------------------ |
| Ferrothorn |    40 | —                                                      |
| Sableye    |   136 | Prankster makes speed irrelevant for status.           |
| Clefable   |   156 | —                                                      |
| Tyranitar  |   158 | Slower than Politoed; sand wins on simultaneous entry. |
| Scizor     |   166 | Bullet Punch has priority.                             |
| Politoed   |   176 | Faster than Tyranitar.                                 |
| Klefki     |   186 | Faster Prankster than Sableye.                         |
| Ludicolo   |   239 | 478 Swift Swim Modest / 524 Timid in rain.             |
| Blaziken   |   259 | 388 at +1 / 518 at +2 Adamant.                         |
| Excadrill  |   275 | 550 Sand Rush in sand.                                 |
| Gardevoir  |   284 | —                                                      |
| Greninja   |   377 | Slower than +1 Adamant Blaziken (388).                 |

Key points:

- Sand Rush Excadrill (550) outspeeds rain Ludicolo (478/524) and +1 Adamant Blaziken (388).
- Jolly +2 Blaziken (568) outspeeds Excadrill. Adamant +2 Blaziken (518) does not.
- Greninja (377) does **not** outspeed +1 Adamant Blaziken (388). Do not rely on Greninja to revenge a boosted Blaziken.
- Sableye's Prankster Taunt/Recover is its speed; Foul Play and Knock Off are normal priority. Klefki's faster Prankster is the exception.

## Matchup cheat sheet

| Alex           | Priority                                                                                                                                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Politoed**   | Taunt Encore/Toxic/Hypnosis; Knock Off Damp Rock; reset sand with Tyranitar.                                                                                                                                           |
| **Ludicolo**   | Do not let it sit in rain. Tera Poison Tyranitar or reset sand. Taunt Rain Dance. Ice Beam from Greninja is only a 2HKO.                                                                                               |
| **Blaziken**   | It cannot be burned. Taunt Swords Dance (Protect still beats Taunt that turn), Knock Off Life Orb, Foul Play for damage. Tera Poison Tyranitar if it may Close Combat. Excadrill High Horsepower. Do not bring Scizor. |
| **Ferrothorn** | Taunt Leech Seed/Stealth Rock/Spikes; Fire Punch in sand; it is contact, so accept Iron Barbs/Rocky Helmet chip; Rapid Spin.                                                                                           |
| **Clefable**   | Taunt Follow Me/Thunder Wave/Encore/Calm Mind; use Rock Slide spread; do not let it redirect Taunt/Knock Off/Foul Play for free.                                                                                       |
| **Klefki**     | Its first screen beats Taunt. Taunt after; Fire Punch/High Horsepower; Knock Off Light Clay only helps future screens.                                                                                                 |

## Tera plan

**Primary: Tera Poison Tyranitar.**

- Resists Fighting, Fairy and Grass: Blaziken, Clefable, Klefki, Ludicolo.
- Neutral to Water, Fire, Steel and Dark: Politoed, Blaziken, Ferrothorn, Klefki.
- Only Ground and Psychic weaknesses; Alex's standard sets rarely have either.
- Turns rain Hydro Pump from a OHKO into a 2HKO and Blaziken Close Combat from a OHKO into a 3HKO.
- Cost: loses Rock STAB, Rock's sand Special Defense boost, sand immunity, and the Rock-type Fire resistance. Flare Blitz hits harder after Tera. Do not Tera early just for damage.

**Backup: Tera Fairy Tyranitar** if Alex reveals Psychic/Ground or leans on Knock Off/Foul Play.

**Backup: Tera Poison Sableye** if Tyranitar must stay un-Teraed. Tera Poison Sableye answers Fairy/Fighting pressure, but it turns Ghost's Close Combat immunity into a resistance, is still frail on the special side, and loses Dark STAB on Foul Play.

**Emergency only:** Tera Steel Excadrill (Fairy/Ice resistance), Tera Fairy Gardevoir (Dragon/Fighting), Tera Steel Scizor (Fairy/Ice). Do not spend Tera on the bench pieces unless it wins the game.

Tera reminders:

- Burn immunity follows the current typing: Fire-type Blaziken cannot be burned, but a non-Fire Tera Blaziken can.
- Tera happens before the move; a status move after Tera checks the new typing.
- Same-type Tera keeps original STAB; different-type Tera loses the original STAB.
- Tera Poison Tyranitar is neutral to Ferrothorn's Gyro Ball. Tera Fairy Tyranitar would be weak to it.
- Only one Tera per battle.

## Damage benchmarks

Numbers use representative bulky spreads, no crits, no screens, and no Tera unless stated. Spread moves are 0.75× in doubles. Foul Play uses the target's Attack, so it punishes Swords Dance Blaziken; Sableye cannot burn Blaziken because Blaziken is Fire-type. Fire Punch and Crunch are contact moves, so Ferrothorn's Iron Barbs/Rocky Helmet chip Tyranitar when it uses them; Fire Punch is still the best damage. High Horsepower is also contact, so Excadrill takes the same chip when it hits Ferrothorn.

### Alex hitting Michael

| Attack                            | Target                           |                      Damage |
| --------------------------------- | -------------------------------- | --------------------------: |
| Rain Life Orb Ludicolo Hydro Pump | un-Teraed Assault Vest Tyranitar |      **98.5–116.6%** (OHKO) |
| Rain Life Orb Ludicolo Hydro Pump | Tera Poison Tyranitar            |       **49.3–58.2%** (2HKO) |
| Sand Life Orb Ludicolo Hydro Pump | un-Teraed Tyranitar              |              **44.3–52.7%** |
| Sand Life Orb Ludicolo Hydro Pump | Tera Poison Tyranitar            |              **32.9–38.9%** |
| Rain Life Orb Ludicolo Hydro Pump | Excadrill                        |         **236–279%** (OHKO) |
| Rain Life Orb Ludicolo Hydro Pump | Scizor                           |         **106–124%** (OHKO) |
| Rain Life Orb Ludicolo Hydro Pump | Gardevoir                        |          **96–114%** (OHKO) |
| Rain Life Orb Ludicolo Hydro Pump | Greninja                         |                  **70–82%** |
| Rain Life Orb Ludicolo Hydro Pump | Sableye                          |         **139–164%** (OHKO) |
| Rain Politoed Scald               | Excadrill                        |     **94–110%** (OHKO roll) |
| Rain Politoed Scald               | Tyranitar                        |                  **40–48%** |
| Rain Politoed Scald               | Tera Poison Tyranitar            |                  **20–24%** |
| Blaziken Close Combat             | un-Teraed Tyranitar              |         **241–286%** (OHKO) |
| Blaziken Close Combat             | Tera Poison Tyranitar            |              **30.0–35.6%** |
| Blaziken Flare Blitz              | un-Teraed Tyranitar              |                  **30–36%** |
| Blaziken Flare Blitz              | Tera Poison Tyranitar            |              **60.1–71.5%** |
| Blaziken Knock Off                | Tera Poison Tyranitar            |              **32.9–38.6%** |
| Blaziken Flare Blitz              | Sableye                          |                  **76–89%** |
| Blaziken Knock Off                | Sableye                          |                  **41–48%** |
| Blaziken Flare Blitz              | Scizor                           |         **308–363%** (OHKO) |
| Ferrothorn Gyro Ball              | Gardevoir                        |     **157.6–185.6%** (OHKO) |
| Ferrothorn Power Whip             | Greninja                         |     **118.2–140.6%** (OHKO) |
| Ferrothorn Power Whip             | Tyranitar                        |                  **56–67%** |
| Ferrothorn Power Whip             | Tera Poison Tyranitar            |                  **14–17%** |
| Ferrothorn Gyro Ball              | Tera Poison Tyranitar            |                  **23–28%** |
| Clefable Moonblast                | Sableye                          | **90.8–107.2%** (OHKO roll) |
| Clefable Moonblast                | Greninja                         | **90.9–107.7%** (OHKO roll) |
| Klefki Play Rough                 | Sableye                          |                  **41–49%** |
| Klefki Dazzling Gleam             | Sableye                          |                  **50–59%** |
| Klefki Play Rough                 | Greninja                         |                  **71–84%** |

### Michael hitting Alex

| Attack                                  | Target     |                      Damage |
| --------------------------------------- | ---------- | --------------------------: |
| Tyranitar Fire Punch (sand)             | Ferrothorn |              **62.5–73.9%** |
| Tyranitar Fire Punch (rain)             | Ferrothorn |              **30.7–36.4%** |
| Tyranitar Fire Punch (sand)             | Klefki     |              **44.7–52.8%** |
| Tyranitar Fire Punch (rain)             | Klefki     |              **22.0–26.4%** |
| Tyranitar Crunch                        | Ludicolo   |              **64.9–76.8%** |
| Tyranitar Crunch                        | Politoed   |              **48.4–57.3%** |
| Tyranitar Rock Slide (spread)           | Ludicolo   |                  **46–54%** |
| Tyranitar Rock Slide (spread)           | Politoed   |                  **34–40%** |
| Tyranitar Rock Slide (spread)           | Blaziken   |                  **46–54%** |
| Tyranitar Superpower                    | Blaziken   |              **65.4–77.1%** |
| Tyranitar Superpower                    | Ferrothorn |              **50.0–59.1%** |
| Sand Life Orb Excadrill High Horsepower | Blaziken   |         **203–239%** (OHKO) |
| Sand Life Orb Excadrill High Horsepower | Klefki     |         **110–130%** (OHKO) |
| Sand Life Orb Excadrill High Horsepower | Ferrothorn |              **38.6–45.7%** |
| Sand Life Orb Excadrill Iron Head       | Clefable   | **85.8–101.5%** (OHKO roll) |
| Sableye Foul Play (target at +0)        | Blaziken   |                  **32–38%** |
| Sableye Foul Play (target at +2)        | Blaziken   |                  **71–83%** |
| Scizor Choice Band Bullet Punch         | Clefable   |              **72.1–85.3%** |
| Scizor Choice Band Bullet Punch         | Klefki     |              **39.0–46.2%** |
| Scizor Choice Band Close Combat         | Ferrothorn |              **73.3–86.4%** |
| Gardevoir Choice Specs Psychic          | Blaziken   |         **190–224%** (OHKO) |
| Gardevoir Choice Specs Focus Blast      | Ferrothorn | **94.9–111.9%** (OHKO roll) |
| Gardevoir Choice Specs Moonblast        | Clefable   |              **62.4–73.9%** |
| Gardevoir Choice Specs Moonblast        | Ludicolo   |              **74.8–88.4%** |
| Greninja Hydro Pump                     | Blaziken   |  **OHKO even without rain** |
| Greninja Ice Beam                       | Ludicolo   |                    **2HKO** |

## Scouting checklist

Track these during game 1:

- Does Politoed have Damp Rock? Is rain 8 turns?
- Does Ludicolo have Rain Dance, Fake Out, or Protect?
- Is Blaziken Life Orb, and does it have Protect/Swords Dance?
- Does Ferrothorn have Stealth Rock, Spikes, Leech Seed, or Body Press?
- Does Clefable have Follow Me, Wish/Soft-Boiled, Thunder Wave, Encore, or Calm Mind? Magic Guard or Unaware?
- Does Klefki have screens, Spikes, Thunder Wave, Foul Play, or Dazzling Gleam?
- What are Alex's Tera types and when does he use them?

## Win condition

Keep sand up, Tera Poison Tyranitar through the rain/Blaziken turn, Taunt/Knock Off Blaziken, Taunt the support mon, remove or neutralize Ludicolo/Politoed, then let Excadrill clean with High Horsepower and Iron Head.
