# Conor vs Michael — Counter-Plan

Level 100 Doubles Custom Game, pick 4 from 6, all three games played. One Tera per battle. Michael's six sets are locked for all three games; he can change his 4 and leads each game, but not the sets.

This is a counter-plan for Conor, not confirmed scouting. Conor's exact items/EVs/Tera are still unknown, so the sets below are recommendations. Michael's side is taken from `src/conor.md`.

**Rules interactions that matter:** Tera is in play, so use current-gen mechanics. Fake Out is a Normal move and cannot hit Sableye (Ghost). Prankster status moves that target a Dark-type fail, so Meowstic cannot Taunt Sableye, Tyranitar, or Greninja. Fire-types cannot be burned, so do not try to WoW Chandelure.

## Recommendation

**Default 4:** Gyarados, Chandelure, Raichu, Meowstic.
**Bench:** Milotic and Cloyster.

Milotic and Cloyster are too passive into Sableye's Taunt/WoW and Excadrill's pressure. Bring them only if Michael benches Sableye or if you need a specific adaptation.

**Default lead:** Meowstic + Chandelure against Michael's most likely Sableye + Tyranitar lead. Meowstic sets Safeguard, Chandelure Teras Fighting and pressures Tyranitar. Gyarados comes in after Sableye is weakened or removed.

Do **not** default to leading Gyarados into Sableye. Sableye's Prankster Taunt stops Dragon Dance, and its WoW forces Conor to burn Lum Berry immediately.

## Importable four

```text
Gyarados @ Lum Berry
Ability: Intimidate
Tera Type: Dark
EVs: 252 Atk / 4 SpD / 252 Spe
Adamant Nature
- Dragon Dance
- Waterfall
- Crunch
- Protect

Chandelure @ Choice Scarf
Ability: Flame Body
Tera Type: Fighting
EVs: 4 HP / 252 SpA / 252 Spe
Timid Nature
- Fire Blast
- Shadow Ball
- Tera Blast
- Trick

Raichu @ Life Orb
Ability: Lightning Rod
Tera Type: Fairy
EVs: 4 HP / 252 SpA / 252 Spe
Timid Nature
- Fake Out
- Thunderbolt
- Volt Switch
- Focus Blast

Meowstic @ Sitrus Berry
Ability: Prankster
Tera Type: Fairy
EVs: 252 HP / 252 Def / 4 SpD
Bold Nature
- Fake Out
- Taunt
- Safeguard
- Dazzling Gleam
```

## Why these sets

- **Gyarados:** Lum Berry absorbs one WoW, Intimidate softens Tyranitar/Excadrill, and Dragon Dance is the win condition once Sableye is gone or neutralized. Waterfall is the safe attack into Tyranitar; Crunch pressures Sableye/Gardevoir; Protect buys a turn for Safeguard or sand to expire.
- **Chandelure:** Choice Scarf outspeeds Greninja and non-sand Excadrill. Tera Fighting is the key: it resists Sableye's Knock Off, Tyranitar's Crunch/Rock Slide, and Greninja's Dark Pulse. Fire Blast removes Excadrill and Scizor; Shadow Ball hits Sableye and Gardevoir; Tera Blast Fighting forces Tyranitar to Tera or die; Trick can cripple Sableye or Tyranitar if you no longer need the Scarf.
- **Raichu:** Lightning Rod redirects Tyranitar's Thunder Punch away from Gyarados/Chandelure and gives Raichu +1 SpA. Fake Out is for Tyranitar, Excadrill, or Greninja—not Sableye. Focus Blast pressures Tyranitar/Excadrill; Thunderbolt hits Greninja; Volt Switch keeps momentum.
- **Meowstic:** Safeguard is the reliable way to block Sableye's WoW. Dazzling Gleam is Conor's best Sableye damage. Fake Out should target Tyranitar, Excadrill, or Greninja—never Sableye. Taunt works on Excadrill but not on Sableye/Tyranitar/Greninja because they are Dark-types.

## Lead decision tree

- **Sableye + Tyranitar (most likely):** Meowstic + Chandelure. Meowstic uses Safeguard; Chandelure Teras Fighting and uses Tera Blast on Tyranitar. If Tyranitar Teras Fairy, switch to Fire Blast/Shadow Ball and bring Gyarados.
- **Sableye + Excadrill:** Meowstic + Chandelure. Meowstic uses Safeguard; Chandelure Fire Blasts Excadrill before sand goes up. If Excadrill Protects, Tera Fighting and attack the next turn.
- **Sableye + Greninja:** Meowstic + Chandelure. Meowstic uses Safeguard; Chandelure Teras Fighting and uses Tera Blast on Greninja. Dark Pulse is resisted after Tera.
- **Tyranitar + Greninja (no Sableye):** Meowstic + Chandelure. Meowstic Fake Outs Greninja; Chandelure Teras Fighting and pressures Tyranitar.
- **No Sableye:** Meowstic + Gyarados is safe. Meowstic supports with Fake Out/Taunt, and Gyarados can Dragon Dance.
- **Sableye + Gardevoir/Scizor:** Meowstic + Chandelure, but do **not** Tera Fighting while Gardevoir is on the field. Use Scarf Shadow Ball/Fire Blast and keep Tera for Raichu Fairy or Gyarados Dark.

## Turn 1 by Michael's lead

- **Sableye + Tyranitar:** Meowstic Safeguard. Chandelure Tera Fighting + Tera Blast Tyranitar. If Tyranitar Teras Fairy, pivot to Fire Blast/Shadow Ball and bring Gyarados in behind.
- **Sableye + Excadrill:** Meowstic Safeguard. Chandelure Fire Blast Excadrill. If Excadrill Protects, Tera Fighting and attack next turn; do not waste Fake Out on Sableye.
- **Sableye + Greninja:** Meowstic Safeguard. Chandelure Tera Fighting + Tera Blast Greninja. If Greninja Teras Water, switch to Shadow Ball/Fire Blast and let Gyarados handle it.
- **Tyranitar + Greninja:** Meowstic Fake Out Greninja. Chandelure Tera Fighting + Tera Blast Tyranitar.
- **Sableye + Scizor/Gardevoir:** Meowstic Safeguard. Chandelure Fire Blast Scizor or Shadow Ball Gardevoir. Against Gardevoir, do not Tera Fighting.
- **If you lead Meowstic + Gyarados into Sableye:** Meowstic Safeguard; Gyarados Waterfall Tyranitar. Do not Dragon Dance—Sableye Taunts Gyarados first.

## Tera plan

**Default: Chandelure → Fighting.** Against Michael's default 4 it has no exploitable weakness: Michael has no Fairy, Psychic, or Flying attacks. It resists Sableye's Knock Off, Tyranitar's Crunch/Rock Slide, and Greninja's Dark Pulse. Use it on turn 1 when Sableye or Greninja is on the field.

**Do not Tera Chandelure Fighting while Gardevoir is on the field.** Gardevoir's Fairy/Psychic coverage punishes it. In that case, use Scarf Shadow Ball to revenge kill Gardevoir, or Tera Raichu Fairy / Gyarados Dark if the game state demands it.

**If Tyranitar Teras Fairy:** Fighting moves become resisted. Stop clicking Tera Blast/Focus Blast into it; use Fire Blast, Shadow Ball, Waterfall, and Gyarados's Dragon Dance.

**If Sableye Teras Fairy:** it loses its Dark/Ghost typing. Fake Out and Prankster Taunt now work on it, but Fairy resists Fighting and is neutral to Dazzling Gleam. Damage it with Fire Blast/Shadow Ball/Waterfall and use Fake Out to buy turns.

**If Excadrill Teras Ground:** Fire Blast is no longer super effective. Use Gyarados Waterfall instead.

**If Scizor Teras Water:** Fire Blast is resisted. Use Raichu Thunderbolt or chip it with Gyarados.

**If Greninja Teras Dark:** Tera Blast Fighting is still super effective, and Meowstic's Dazzling Gleam is super effective.

## Win condition

1. Set Safeguard so Sableye cannot WoW Gyarados.
2. Remove or heavily chip Sableye with Dazzling Gleam, Fire Blast, and Shadow Ball. Do not rely on Fake Out or Taunt against it.
3. Force Tyranitar to Tera with Chandelure's Tera Blast Fighting, Gyarados's Waterfall, or Raichu's Focus Blast.
4. Remove Excadrill before sand lets it outspeed Chandelure, or revenge kill it with Fire Blast/Waterfall.
5. Once Sableye is gone, bring Gyarados in and Dragon Dance.
6. Preserve Chandelure for Scizor/Gardevoir if Michael brings them.

## Matchup cheat sheet

- **Sableye:** Fake Out and Prankster Taunt fail. Psychic and Fighting moves fail. Dazzling Gleam is 2x; Fire Blast/Shadow Ball are neutral. Chandelure is immune to WoW, and Tera Fighting Chandelure resists Knock Off. Safeguard blocks WoW. Kill it or force it to Tera.
- **Tyranitar:** Tera Blast Fighting is 4x before Tera and 0.5x after Tera Fairy. Waterfall is 2x before Tera and neutral after. Focus Blast follows the same pattern. Force the Tera, then chip with Gyarados.
- **Excadrill:** Fire Blast is 2x; Waterfall is 2x. Remove it before sand. Fake Out can flinch it; Taunt can stop Protect, but Sableye may Taunt Meowstic first.
- **Greninja:** Tera Fighting Chandelure resists Dark Pulse. Tera Blast Fighting is 2x. Meowstic's Dazzling Gleam is 2x. Fake Out can flinch it.
- **Scizor:** Chandelure Fire Blast is 4x. If it Teras Water, use Raichu Thunderbolt.
- **Gardevoir:** Scarf Chandelure's Shadow Ball is 2x before Tera. If Gardevoir Teras Fairy, Shadow Ball is only 1x, and Chandelure must not Tera Fighting. Chip it with Gyarados/Raichu and revenge kill it.

## Avoid list

- Do not Fake Out or Taunt Sableye. Fake Out is blocked by Ghost; Prankster Taunt is blocked by Dark.
- Do not use Psychic or Fighting moves into Sableye.
- Do not lead Gyarados and immediately Dragon Dance while Sableye is healthy; Taunt stops it.
- Do not switch Chandelure into Rock Slide before Tera.
- Do not Tera Chandelure Fighting while Gardevoir is on the field.
- Do not bring Milotic or Cloyster by default.
- Do not click Electric moves into Excadrill.
- Do not Tera Gyarados by default; it loses its Ground immunity while Excadrill is alive.

## Between-game adaptation

- Track Michael's 4, leads, Tera, items, and which moves he clicks. All three games are played, so Game 1 is information.
- If Michael benches Greninja, Chandelure is safer and Tera Fighting is less contested.
- If Michael brings Gardevoir, adjust the Tera plan; do not commit to Chandelure Fighting.
- If Michael benches Sableye, Gyarados can Dragon Dance freely and Cloyster/Milotic become better options.
- If Michael keeps leading Sableye + Tyranitar, keep Meowstic + Chandelure and lead Safeguard.
- If Michael leads Sableye + Excadrill, punish Excadrill with Chandelure before sand.
- If Michael Teras Sableye Fairy, exploit the typing change with Fake Out/Taunt and keep damaging it.
- If Michael changes leads, do not reuse a losing lead; adapt the decision tree rather than forcing the same four.
