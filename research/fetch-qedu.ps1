$ErrorActionPreference='Stop'
$endpoint='https://www.ciencia.gob.es/home/qedu/main/zona02/0'
$all=Invoke-RestMethod $endpoint -Method Post -Body @{action='tarjeta';offset=0;consulta='';niveles="'GRADO','GRADOD'";ambitos=''} -TimeoutSec 60
$q=@($all | Where-Object {$_.codUniv -in @('020','035')})
$q | ConvertTo-Json -Depth 15 | Set-Content research/qedu-catalogue.json -Encoding utf8
$out=@(); $i=0
foreach($x in $q){
$b=@{action='detalle';codTit=$x.codTitula;codCentro=$x.codCentro;codUniv=$x.codUniv}
$d=Invoke-RestMethod $endpoint -Method Post -Body $b -TimeoutSec 45
$b.action='detalleIn';$b.nivel=$d.nivel;$b.ambito=$d.ambito
$e=Invoke-RestMethod $endpoint -Method Post -Body $b -TimeoutSec 45
$out+=@{card=$x;detail=$d;employment=$e}
$i++; if($i % 15 -eq 0){Write-Output "Downloaded $i / $($q.Count)"}
$out | ConvertTo-Json -Depth 20 | Set-Content research/qedu-details.json -Encoding utf8
}
@{checked=(Get-Date).ToUniversalTime().ToString('yyyy-MM-dd');complete=$true;count=$out.Count} | ConvertTo-Json | Set-Content research/qedu-fetch-meta.json -Encoding utf8
Write-Output 'DONE'
