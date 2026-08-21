import { Teams, Dex } from '@pkmn/sim';
// Check what Teams.pack produces
const packed = Teams.pack([{
  name: 'Pikachu', species: 'Pikachu', item: 'Leftovers', ability: 'Static',
  nature: 'Hardy', gender: '', evs: {hp:252,atk:252}, level: 50, moves: ['Tackle']
}]);
console.log('Packed:', packed);

// Check what Teams.unpack produces
const unpacked = Teams.unpack(packed);
console.log('Unpacked:', JSON.stringify(unpacked, null, 2));

// Now test with gen9ou format
import { BattleStreams, RandomPlayerAI, PRNG } from '@pkmn/sim';
function buildTeam(s){return Teams.pack(s.map(n=>({name:n,species:n,item:'Leftovers',ability:'Huge Power',nature:'Hardy',gender:'',evs:{hp:252,atk:252,def:0,spa:0,spd:4,spe:0},ivs:{hp:31,atk:31,def:31,spa:31,spd:31,spe:31},level:50,moves:['Tackle','Tackle','Tackle','Tackle']})));}
const prng=new PRNG('gen5,42,42,42,42');
const stream=new BattleStreams.BattleStream();
const ps=BattleStreams.getPlayerStreams(stream);
const ai1=new RandomPlayerAI(ps.p1,{seed:prng}),ai2=new RandomPlayerAI(ps.p2,{seed:prng});
void ai1.start();void ai2.start();
// Try gen9ou with items
void ps.omniscient.write('>start '+JSON.stringify({formatid:'gen9ou',seed:prng.getSeed()})+'\n>player p1 '+JSON.stringify({name:'HUMON',team:buildTeam(['Pikachu','Charizard','Blastoise'])})+'\n>player p2 '+JSON.stringify({name:'GYM',team:buildTeam(['Garchomp','Tyranitar','Gengar'])}));
const raw=await ps.omniscient.readAll();
for(const chunk of raw){for(const line of chunk.split('\n')){const t=line.trim();if(t.includes('poke|'))console.log(t);}}
