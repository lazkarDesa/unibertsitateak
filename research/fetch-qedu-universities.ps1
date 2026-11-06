$ErrorActionPreference='Stop'
$jobs=Get-Content research/qedu-university-jobs.json -Raw -Encoding UTF8 | ConvertFrom-Json
New-Item research/qedu-universities -ItemType Directory -Force | Out-Null
$i=0;foreach($j in $jobs){$path='research/qedu-universities/'+$j.id+'.html';try{Invoke-WebRequest -Uri $j.url -OutFile $path -UseBasicParsing -TimeoutSec 25}catch{Write-Output ('Failed '+$j.id)};$i++;if($i % 20 -eq 0){Write-Output "University pages $i / $($jobs.Count)"}}
