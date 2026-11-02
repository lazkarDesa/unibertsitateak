const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/profile.js'),'utf8');
const p={version:1,track:'science',core:'Matemáticas II',modality:['Biología','Química'],elective:'Otra optativa sin ponderación',language:'Inglés',history:'Historia de España',basque:true};
function load(value=null,blocked=false){
 const storage=new Map(value?[['uni-explorer.profile.v1',value]]:[]);
 const element=()=>({classList:{toggle(){}},setAttribute(){},addEventListener(){}});
 const ctx={window:{addEventListener(){},dispatchEvent(){}},document:{getElementById:element,createElement:element,body:{append(){}}},localStorage:{getItem(k){if(blocked)throw Error('blocked');return storage.get(k)||null;}},Event:class{}};
 vm.runInNewContext(source,ctx);return ctx.window.UniProfile;
}
const api=load(),r=(materia,coeficiente,fase)=>({materia,coeficiente,fase});
const score=(rows,profile=p,uni='ehu')=>api.assess([{items:rows}],profile,uni);
test('colores y máximos: dos 0,2; 0,2 + 0,1; dos 0,1; una; ninguna',()=>{
 for(const [rows,color,max] of [
  [[r('Biología',.2),r('Química',.2)],'green',14],
  [[r('Biología',.2),r('Química',.1)],'blue',13],
  [[r('Biología',.1),r('Química',.1)],'blue',12],
  [[r('Biología',.1)],'blue',11],[[r('Biología',.2)],'blue',12],
  [[r('Latín II',.2)],'red',10]
 ]){const actual=score(rows);assert.equal(actual.color,color);assert.equal(actual.max,max);}
});
test('sin perfil no hay indicador; sin tabla es verde sin atribuir 14',()=>{
 assert.equal(api.assess([],null),null);assert.equal(api.assess([],p).color,'green');assert.equal(api.assess([],p).max,null);
});
test('comunes, específica obligatoria y optativa cuentan',()=>{
 assert.equal(score([r('Lengua Vasca y Literatura II',.2),r('Matemáticas II',.2)]).max,14);
 assert.equal(score([r('Física',.2)],{...p,elective:'Física'}).max,12);
 assert.equal(score([r('Lengua Vasca y Literatura II',.2)],{...p,basque:false}).max,10);
});
test('no duplica una lengua bajo nombres equivalentes',()=>{
 assert.equal(score([r('Primera Lengua Extranjera II',.2),r('Inglés',.2)]).max,12);
 assert.equal(score([r('Primera Lengua Extranjera II',.2),r('Segunda Lengua Extranjera II',.2)],{...p,elective:'Segunda Lengua Extranjera II · Francés'}).max,14);
});
test('UPNA respeta la fase vasca y cuenta cada materia una vez',()=>{
 const rows=[r('Historia de España (PAU)',.1,'PAU'),r('Historia de España (fase voluntaria)',.2,'Fase voluntaria'),r('Historia de la Filosofía (fase voluntaria)',.2,'Fase voluntaria')];
 assert.equal(score(rows,p,'upna').max,13);
 assert.equal(score([r('Lengua Castellana y Literatura II (fase voluntaria)',.2,'Fase voluntaria')],p,'upna').max,10);
 assert.equal(score([r('Inglés (PAU)',.1,'PAU'),r('Lengua Extranjera II (fase voluntaria)',.2,'Fase voluntaria')],p,'upna').max,11);
 assert.equal(score([r('Inglés (PAU)',.1,'PAU'),r('Lengua Extranjera II (fase voluntaria)',.2,'Fase voluntaria')],{...p,elective:'Segunda Lengua Extranjera II · Francés'},'upna').max,13);
});
test('dobles grados: no mezcla materias de tablas distintas',()=>{
 assert.equal(api.assess([{items:[r('Biología',.2)]},{items:[r('Química',.2)]}],p).max,12);
});
test('variantes ortográficas no pierden coincidencias',()=>{
 assert.equal(api.subjectKey('Técnicas de Expresión Gráfico-Plásticas'),api.subjectKey('Técnicas de Expresión Gráfico-Plástica'));
 assert.equal(api.subjectKey('Artes Escénicas'),api.subjectKey('Artes Escénicas II'));
});
test('almacenamiento ausente, corrupto, bloqueado o inválido no rompe la app',()=>{
 for(const raw of [null,'{','null',JSON.stringify({...p,modality:['Biología','Biología']})])assert.equal(load(raw).get(),null);
 assert.equal(load(null,true).get(),null);assert.equal(load(JSON.stringify(p)).get().track,'science');
 assert.equal(api.valid({...p,core:'Latín II'}),false);
});
test('los perfiles anteriores se adaptan a Inglés y Euskera obligatorios',()=>{
 const old={...p,language:'Francés',basque:false,elective:'Segunda Lengua Extranjera II · Inglés'};
 const migrated=load(JSON.stringify(old)).get();assert.equal(migrated.language,'Inglés');assert.equal(migrated.basque,true);assert.equal(migrated.elective,'Otra optativa sin ponderación');
});
