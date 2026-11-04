# Alex vs Michael: rematch guide

> Second-half round robin. Alex beat Michael **2–1** in the first half. Alex swapped **Gothitelle → Klefki** at midseason. This plan uses the current post-swap rosters; Alex's exact moves, items, EVs, and Tera types are unknown.

## The short version

1. Bring **Tyranitar, Sableye, Excadrill, Greninja**.
2. Lead **Tyranitar + Sableye**.
3. Win the weather war with **Sand Stream**; Tera Poison Tyranitar when rain or Blaziken would otherwise KO it.
4. **Taunt/Knock Off Blaziken**, Taunt the support Pokémon, Fire Punch Ferrothorn/Klefki, and High Horsepower Blaziken/Klefki with Excadrill.
5. Do not let Ludicolo sit in rain. Do not leave Sableye in on Ludicolo/Clefable. Do not bring Scizor into Blaziken.

## Format and assumptions

- Level 100 Doubles Custom Game; pick 4 from 6; all three games played.
- Configuration is fixed for the three-game set; one Tera per battle.
- Michael's roster: Scizor, Greninja, Excadrill, Tyranitar, Gardevoir, Sableye.
- Alex's post-swap roster: Ferrothorn, Clefable, Politoed, Ludicolo, Blaziken, Klefki.
- Alex's exact sets are unknown. Treat the registered gym sets in `src/data/pokemon-sets.ts` as hints only, not scouting.
- Likely Alex shape: **Politoed Drizzle + Ludicolo Swift Swim** rain core, **Blaziken Speed Boost** breaker, and one of **Klefki** screens, **Clefable** redirection, or **Ferrothorn** hazards/contact punishment.

## What Alex is likely to do

Alex's core is almost certainly:

| Alex           | Likely role                 | What matters                                                                                                    |
| -------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Politoed**   | Drizzle + Damp Rock         | Starts long rain. Tyranitar's Sand Stream overrides it when Tyranitar enters after Politoed.                    |
| **Ludicolo**   | Swift Swim + Life Orb       | Biggest immediate threat. Rain Hydro Pump OHKOs un-Teraed Tyranitar and most of the team.                       |
| **Blaziken**   | Speed Boost + Life Orb      | Snowballs with Protect/Swords Dance. Close Combat OHKOs un-Teraed Tyranitar. Fire-type, so it cannot be burned. |
| **Klefki**     | Prankster + Light Clay      | Screens and Thunder Wave. Faster Prankster than Sableye, so its first screen beats Taunt.                       |
| **Clefable**   | Magic Guard/Unaware support | Follow Me redirection, Encore, Wish/Soft-Boiled. Taunt it. Magic Guard ignores sand and hazards.                |
| **Ferrothorn** | Iron Barbs + hazards        | Stealth Rock/Spikes/Leech Seed, Gyro Ball, Power Whip. Punishes contact with Iron Barbs and Rocky Helmet.       |

Most likely four:

1. **Politoed + Ludicolo + Blaziken + Klefki**
2. **Politoed + Ludicolo + Blaziken + Clefable**
3. **Politoed + Ludicolo + Blaziken + Ferrothorn**

His game plan is rain offense: set rain, protect Ludicolo/Blaziken with screens or Follow Me, wear down Tyranitar, then clean up with +Speed Blaziken.

## Michael's six: use these sets

```plaintext
Tyranitar @ Assault Vest
Ability: Sand Stream
Level: 100
Tera Type: Poison
Adamant Nature
EVs: 252 HP / 252 Atk / 4 SpD
IVs: 0 Spe
- Rock Slide
- Fire Punch
- Superpower
- Tera Blast

Sableye @ Leftovers
Ability: Prankster
Level: 100
Tera Type: Poison
Impish Nature
EVs: 252 HP / 252 Def / 4 SpD
- Taunt
- Foul Play
- Knock Off
- Recover

Excadrill @ Life Orb
Ability: Sand Rush
Level: 100
Tera Type: Steel
Adamant Nature
EVs: 252 Atk / 4 Def / 252 Spe
- High Horsepower
- Iron Head
- Rapid Spin
- Protect

Greninja @ Expert Belt
Ability: Protean
Level: 100
Tera Type: Water
Timid Nature
EVs: 4 HP / 252 SpA / 252 Spe
- Hydro Pump
- Ice Beam
- Dark Pulse
- U-turn

Scizor @ Choice Band
Ability: Technician
Level: 100
Tera Type: Steel
Adamant Nature
EVs: 252 HP / 252 Atk / 4 Def
- Bullet Punch
- U-turn
- Knock Off
- Close Combat

Gardevoir @ Choice Specs
Ability: Trace
Level: 100
Tera Type: Fairy
Timid Nature
EVs: 4 HP / 252 SpA / 252 Spe
IVs: 0 Atk
- Psychic
- Psyshock
- Moonblast
- Focus Blast
```

All six items are unique: Assault Vest / Leftovers / Life Orb / Expert Belt / Choice Band / Choice Specs.

### Why this six

- **Tyranitar is mandatory.** Sand Stream is the only thing that stops rain from running over the team. It also gives Excadrill Sand Rush.
- **Sableye is mandatory.** Prankster Taunt/Knock Off/Recover is the team's glue. Foul Play gives it actual pressure. It has no Protect; do not treat it as a tank.
- **Excadrill is the default fourth.** In sand it outspeeds rain Ludicolo and +1 Adamant Blaziken, and threatens Blaziken/Klefki/Clefable.
- **Greninja is the default fourth attacker.** Fast, hits Blaziken/Ludicolo, and gives a Water resist. It is frail.
- **Scizor is the bench anti-Fairy/anti-Ferrothorn pick.** Good when Blaziken is absent; unplayable into Blaziken.
- **Gardevoir is the bench breaker.** Good into Ferrothorn/Blaziken; bad into Ferrothorn's Gyro Ball and Politoed's Drizzle.

## Pick 4

Default: **Tyranitar / Sableye / Excadrill / Greninja**.

| Alex's four                                 | Bring                                                | Why                                                                                      |
| ------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Politoed + Ludicolo + Blaziken              | Tyranitar / Sableye / Excadrill / Greninja           | Default. Sand + Tera Poison Tyranitar; Greninja for Ludicolo/Blaziken.                   |
| Politoed + Ludicolo + Blaziken + Klefki     | Tyranitar / Sableye / Excadrill / Greninja           | Taunt Klefki after the first screen; keep Excadrill away from Foul Play chip.            |
| Politoed + Ludicolo + Blaziken + Clefable   | Tyranitar / Sableye / Excadrill / Greninja           | Taunt Clefable; Rock Slide through Follow Me.                                            |
| Politoed + Ludicolo + Blaziken + Ferrothorn | Tyranitar / Sableye / Excadrill / Greninja           | Fire Punch Ferrothorn; accept contact chip.                                              |
| No Blaziken, Ludicolo present               | Tyranitar / Sableye / Excadrill / **Scizor**         | Scizor walls Ludicolo's Water/Ice/Grass and threatens Clefable/Ferrothorn.               |
| No Blaziken, no Ludicolo                    | Tyranitar / Sableye / Excadrill / **Scizor**         | Scizor is the safer breaker. Gardevoir only if Ferrothorn/Clefable are the main problem. |
| Blaziken present, no Ludicolo               | Tyranitar / Sableye / Excadrill / Greninja           | Greninja still checks Blaziken. Never Scizor.                                            |
| No Politoed                                 | Tyranitar / Sableye / Excadrill / Greninja or Scizor | Without rain, Tyranitar is safer; Scizor only if no Blaziken.                            |

**Keep Tyranitar, Sableye, and Excadrill in almost every game.** The fourth slot is Greninja by default; Scizor only when Blaziken is absent.

## Lead and turn 1

Default lead: **Tyranitar + Sableye**.

### vs Politoed + Ludicolo

- Tyranitar: **Rock Slide**
- Sableye: **Taunt Ludicolo** if you fear Rain Dance, otherwise **Knock Off Politoed**
- If Ludicolo stays in rain and threatens a KO, **Tera Poison + Tera Blast** removes it

Ludicolo's Fake Out will flinch Sableye; Tyranitar's Rock Slide still goes off. Next turn, Taunt/Knock Off the bigger threat.

### vs Politoed + Blaziken

- Tyranitar: **Rock Slide**
- Sableye: **Taunt Blaziken** or **Knock Off Life Orb**
- If Blaziken aims Close Combat at Tyranitar, **Tera Poison**

Tera Blast is neutral into Blaziken; keep clicking Rock Slide or Superpower for damage. If Blaziken Protects, Taunt it next turn to stop Protect/Swords Dance.

### vs Politoed + Klefki

- Tyranitar: **Fire Punch Klefki**
- Sableye: **Taunt Klefki**

Klefki's first screen still lands because it is faster, but Taunt stops the second screen. Klefki's Thunder Wave is dead against your default four: Tyranitar/Sableye/Greninja are Dark, and Excadrill is Ground. It becomes live if you Tera away from Dark/Ground. Do not click Tera Blast into Klefki (0× into Steel).

### vs Politoed + Clefable

- Tyranitar: **Rock Slide**
- Sableye: **Taunt Clefable**

Rock Slide hits both through Follow Me. If Clefable is Magic Guard, do not rely on sand chip to finish it. If you are forced to Tera anyway, **Tera Blast** 2HKOs Clefable.

### vs Politoed + Ferrothorn

- Tyranitar: **Fire Punch Ferrothorn**
- Sableye: **Taunt Ferrothorn**

In rain, Fire Punch is halved. If rain is up, consider Superpower/High Horsepower or Tera Poison Tyranitar to tank Power Whip. Tera Poison here is fine because it also covers Blaziken later. Do not click Tera Blast into Ferrothorn (0× into Steel).

### vs no Politoed

Still lead Tyranitar + Sableye, set sand, Taunt the support, and pressure the Blaziken/Ludicolo.

## Midgame priorities

1. **Remove or neutralize Politoed/Ludicolo.** Keep sand up; Tera Blast Ludicolo if it forces the Tera.
2. **Taunt/Knock Off Blaziken before it snowballs.** Foul Play if it boosts.
3. **Taunt Klefki after the first screen.** Do not let it set both screens.
4. **Taunt Clefable to stop Follow Me.** Use Rock Slide while Follow Me is active.
5. **Fire Punch Ferrothorn/Klefki**, but respect Iron Barbs + Rocky Helmet chip.
6. **Rapid Spin hazards** and keep Excadrill healthy.
7. **Preserve Tyranitar** for Blaziken and the weather war.
8. **Use U-turn** to pivot Greninja out of Klefki/Clefable/Ferrothorn.
9. **Do not over-predict.** Safe plays win this matchup.

## Tera plan

### Primary: Tera Poison Tyranitar

Use when:

- Blaziken threatens Close Combat/Flare Blitz
- rain Hydro Pump would OHKO
- you need to tank Fighting, Water, Fire, or Grass
- you are forced to Tera by Ludicolo/rain and can KO back with Tera Blast

Tera Poison:

- keeps Rock/Dark STAB
- Tera Blast becomes Poison STAB: **OHKOs offensive Ludicolo**, **2HKOs Clefable**, but is **0× into Ferrothorn/Klefki**
- loses Dark's Psychic and Prankster immunities
- loses Rock's sand Special Defense boost, sand immunity, and Fire resistance
- becomes weak to Ground and Psychic
- becomes vulnerable to Klefki's Thunder Wave

Do not Tera early just for damage. Tera when it saves Tyranitar or blanks Blaziken.

### Secondary: Tera Water Greninja

Use if Greninja must survive a Fighting/Fairy hit or remove its Dark weaknesses. It becomes weak to Grass/Electric and loses Dark's Prankster immunity.

### Emergency: Tera Steel Excadrill

Use against Ice/Water pressure. It keeps Steel/Ground STAB and boosts Steel to 2×, but loses Ground's Electric immunity and Thunder Wave immunity.

### Emergency: Tera Poison Sableye

Use only if Sableye must survive Fairy/Grass. It resists Fairy/Grass, but loses its Fighting immunity and Prankster immunity.

### Only one Tera per battle

Usually Tyranitar. Do not spend it on a bench Pokémon unless the matchup demands it.

### Alex's likely Tera

- **Blaziken:** expect Tera Fighting. It keeps Fire STAB, resists Rock/Dark, and boosts Close Combat. Tera Poison Tyranitar still walls it, and Excadrill still OHKOs with High Horsepower.
- **Ludicolo:** expect Tera Water. It is scary in rain, but even Tera Water Life Orb Hydro Pump cannot OHKO Tera Poison Assault Vest Tyranitar. Tera Water also cancels its Poison weakness, so Tera Blast is only neutral; into Tera Grass it stays 2×.
- **Klefki:** Tera Steel makes Fire Punch/High Horsepower best; Tera Fairy makes Iron Head/Bullet Punch best. Tera Blast is 0× either way.
- **Ferrothorn:** Tera Grass/Steel still loses to Fire Punch/High Horsepower. Tera Water would resist Fire Punch; scout before committing. Tera Blast is 0× into Steel and only neutral into Tera Water.

## Key damage benchmarks

- Rain Life Orb Ludicolo Hydro Pump vs un-Teraed AV Tyranitar: **OHKO**
- Same vs Tera Poison Tyranitar: **49–58%, 2HKO**
- Blaziken Close Combat vs un-Teraed Tyranitar: **OHKO**
- Same vs Tera Poison Tyranitar: **30–36%**; with Tera Fighting, about **40–48%**
- Blaziken Flare Blitz vs Tera Poison Tyranitar: **60–72%**
- Tyranitar Fire Punch in sand vs Ferrothorn: **62–74%**
- Tyranitar Fire Punch in sand vs Klefki: **45–53%**
- In rain, halve Fire Punch damage.
- Tyranitar Tera Blast (Poison) vs offensive Ludicolo: **OHKO** (131–154%)
- Tyranitar Tera Blast (Poison) vs max-Def Ludicolo: **74–87%, 2HKO**
- Tyranitar Tera Blast (Poison) vs Clefable: **66–78%, 2HKO**
- Tera Blast is **0× into Ferrothorn/Klefki** (Steel).
- Excadrill High Horsepower vs Blaziken: **OHKO**
- Excadrill High Horsepower vs Klefki: **OHKO**
- Sableye Foul Play vs +0 Blaziken: **32–38%**
- Sableye Foul Play vs +2 Blaziken: **71–83%**
- Greninja Hydro Pump vs Blaziken: **OHKO**
- Greninja Ice Beam vs Ludicolo: **2HKO**

## Move notes

### Foul Play

Foul Play is a 95 BP Dark-type physical attack that uses the **target's Attack stat and stat stages** instead of Sableye's. That is why Sableye can run zero Attack investment and still punish Blaziken, especially after Swords Dance. It is STAB for Sableye, but weak against low-Attack targets like Ludicolo, Clefable, Klefki, and Politoed. Prankster does not boost it; Foul Play is normal priority.

### Thunder vs Ludicolo

Do not slot an Electric move for Ludicolo. Ludicolo is **Water/Grass**, so Electric is neutral against it. Thunder/Thunderbolt would only hit Politoed super effectively.

### What is actually super effective vs Ludicolo

Only **Bug, Poison, and Flying**.

- Electric: neutral
- Fire: neutral normally, resisted in rain
- Ice: neutral
- Ground: resisted
- Grass: neutral

### Can you OHKO Ludicolo?

Yes, but only with specific tech:

- **Scizor Choice Band U-turn** — guaranteed OHKO even on max HP/Def Ludicolo. Best option, but only bring Scizor if Alex has no Blaziken.
- **Greninja Gunk Shot** — guaranteed OHKO on Ludicolo and 2× on Clefable, but 80% accuracy and costs a moveslot. It cannot hit Klefki/Ferrothorn because Poison is 0× vs Steel.
- **Excadrill Poison Jab** — guaranteed OHKO, but not worth replacing Protect/Rapid Spin/Iron Head.
- **Greninja U-turn** — OHKOs offensive Ludicolo only if it is Greninja's first move and Protean gives Bug STAB. Bulky Ludicolo survives.
- **Ice Beam** — reliable 2HKO, not an OHKO.
- **Tyranitar Tera Blast (Poison)** — guaranteed OHKO on offensive Ludicolo and 74–87% on max-Def, but it costs the Tera and a moveslot. It is 0× into Ferrothorn/Klefki.
- **Sableye** — no OHKO. Foul Play uses Ludicolo's low Attack.

We are slotting Tera Blast over Crunch: it gives Tyranitar a 100%-accurate OHKO on offensive Ludicolo and a 2HKO on Clefable, at the cost of the Tera and a moveslot. Greninja's Gunk Shot is the no-Tera alternative but is 80% accurate and useless into Steel. If Alex has no Blaziken and you want a guaranteed OHKO without spending the Tera, bring Scizor and click U-turn.

## Importable team

Register all six; pick four at Team Preview. One Tera per battle.

```text
Tyranitar @ Assault Vest
Ability: Sand Stream
Level: 100
Tera Type: Poison
Adamant Nature
EVs: 252 HP / 252 Atk / 4 SpD
IVs: 0 Spe
- Rock Slide
- Fire Punch
- Superpower
- Tera Blast

Sableye @ Leftovers
Ability: Prankster
Level: 100
Tera Type: Poison
Impish Nature
EVs: 252 HP / 252 Def / 4 SpD
- Taunt
- Foul Play
- Knock Off
- Recover

Excadrill @ Life Orb
Ability: Sand Rush
Level: 100
Tera Type: Steel
Adamant Nature
EVs: 252 Atk / 4 Def / 252 Spe
- High Horsepower
- Iron Head
- Rapid Spin
- Protect

Greninja @ Expert Belt
Ability: Protean
Level: 100
Tera Type: Water
Timid Nature
EVs: 4 HP / 252 SpA / 252 Spe
- Hydro Pump
- Ice Beam
- Dark Pulse
- U-turn

Scizor @ Choice Band
Ability: Technician
Level: 100
Tera Type: Steel
Adamant Nature
EVs: 252 HP / 252 Atk / 4 Def
- Bullet Punch
- U-turn
- Knock Off
- Close Combat

Gardevoir @ Choice Specs
Ability: Trace
Level: 100
Tera Type: Fairy
Timid Nature
EVs: 4 HP / 252 SpA / 252 Spe
IVs: 0 Atk
- Psychic
- Psyshock
- Moonblast
- Focus Blast
```

## Scouting checklist

Note these in game 1 and adjust for games 2–3:

- Politoed: Damp Rock? Encore/Hypnosis/Focus Blast?
- Ludicolo: Life Orb? Fake Out/Rain Dance/Weather Ball?
- Blaziken: Life Orb? Protect/Swords Dance/Knock Off?
- Klefki: Light Clay? Reflect/Light Screen/Thunder Wave/Play Rough/Foul Play?
- Clefable: Magic Guard or Unaware? Follow Me/Encore?
- Ferrothorn: Rocky Helmet or Leftovers? Stealth Rock/Spikes/Leech Seed/Power Whip/Gyro Ball?
- Which Pokémon does Alex Terastallize, and when?
- Does Alex lead Politoed + support, or Politoed + Ludicolo?

If Alex drops Blaziken, bring Scizor. If Blaziken is present, never bring Scizor.

## Win condition

Sand up, Tyranitar alive, Blaziken taunted or Knocked Off, Ludicolo/Politoed gone or neutralized, Excadrill at +0 with Sand Rush. That is the game.
