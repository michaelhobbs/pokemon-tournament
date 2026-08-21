import { BattleStreams, RandomPlayerAI, Teams, PRNG } from '@pkmn/sim';
// Test with no AI - just raw protocol
const stream = new BattleStreams.BattleStream();
const ps = BattleStreams.getPlayerStreams(stream);

const team = Teams.pack([{
  name:'Pikachu', species:'Pikachu', item:'Leftovers', ability:'Static',
  nature:'Hardy', gender:'M', evs:{hp:252,atk:252,def:0,spa:0,spd:4,spe:0},
  ivs:{hp:31,atk:31,def:31,spa:31,spd:31,spe:31}, level:50,
  moves:['Thunderbolt','Surf','Iron Tail','Grass Knot']
}]);

// Write start directly to omniscient
ps.omniscient.write(
  '>start {"formatid":"gen9ou"}\n' +
  '>player p1 {"name":"P1","team":"' + team.replace(/"/g,'\\"') + '"}\n' +
  '>player p2 {"name":"P2","team":"' + team.replace(/"/g,'\\"') + '"}'
);

const buf = await ps.omniscient.readAll();
for (const chunk of buf) {
  for (const line of chunk.split('\n')) {
    if (line.trim().startsWith('|poke|')) console.log(JSON.stringify(line.trim()));
  }
}
