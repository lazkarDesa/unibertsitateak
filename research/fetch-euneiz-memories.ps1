$ErrorActionPreference='Stop'
$jobs=Get-Content research/qedu-euneiz-memory-jobs.json -Raw -Encoding UTF8 | ConvertFrom-Json
foreach($j in $jobs){try{Invoke-WebRequest $j.url -OutFile $j.file -UseBasicParsing -TimeoutSec 45;Write-Output $j.id}catch{Write-Output ('Failed '+$j.id)}}
