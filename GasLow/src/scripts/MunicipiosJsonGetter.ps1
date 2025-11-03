# Forzamos encoding para los acentos
chcp 65001 > $null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$JSON = @() ## crea array vacio
for ($i = 1; $i -le 52; $i++) {
    # formateamos para que los primeros del 1 al 9 sean 01 ... 09
    $IDPROVINCIA = "{0:D2}" -f $i
    #Write-Host "Holaaa ${IDPROVINCIA}"

    $resp = Invoke-RestMethod `
        -Method GET `
        -Uri "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/${IDPROVINCIA}" `
        -Headers @{ "Accept-Charset" = "ISO-8859-1" } #cortesía chatGPT por problemas con los acentos
    $JSON += $resp
    Start-Sleep -Seconds 2 #para que la api no nos de problemas con las peticiones
}
$JSON | ConvertTo-Json -Depth 5 | Out-File -FilePath municipios.json -Encoding utf8
