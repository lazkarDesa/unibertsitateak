$ErrorActionPreference='Stop'
$jobs=Get-Content research/qedu-private-page-jobs.json -Raw -Encoding UTF8 | ConvertFrom-Json
New-Item research/qedu-private-pages -ItemType Directory -Force | Out-Null
$i=0;$result=@();foreach($j in ($jobs | Group-Object url | ForEach-Object {$_.Group[0]})){
try{$r=Invoke-WebRequest -Uri $j.url -OutFile $j.file -UseBasicParsing -TimeoutSec 30 -PassThru;$result+=@{url=$j.url;file=$j.file;status=[int]$r.StatusCode;checked=(Get-Date).ToUniversalTime().ToString('yyyy-MM-dd')}}catch{$result+=@{url=$j.url;file=$j.file;error=$_.Exception.Message}}
$i++;if($i % 20 -eq 0){Write-Output "Pages $i"};$result | ConvertTo-Json -Depth 10 | Set-Content research/qedu-private-page-results.json -Encoding utf8
}
