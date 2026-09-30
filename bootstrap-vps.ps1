$ErrorActionPreference = 'Stop'

$server = '51.83.235.161'
$user = 'ubuntu'
$repo = $PSScriptRoot
$privateKey = Join-Path $repo 'deploy-key'

if (-not (Test-Path -LiteralPath $privateKey)) {
    ssh-keygen -q -t ed25519 -f $privateKey -N '""' -C 'github-actions@petivo.shop'
}

$publicKey = (Get-Content -LiteralPath "$privateKey.pub" -Raw).Trim()

Write-Host 'Podaj aktualne haslo uzytkownika ubuntu.'
ssh "$user@$server" "umask 077; mkdir -p ~/.ssh; touch ~/.ssh/authorized_keys; grep -qxF '$publicKey' ~/.ssh/authorized_keys || echo '$publicKey' >> ~/.ssh/authorized_keys"
scp -i $privateKey -r (Join-Path $repo 'deploy') "$user@${server}:~/"
ssh -t -i $privateKey "$user@$server" 'chmod +x ~/deploy/setup-vps.sh && ~/deploy/setup-vps.sh'

$knownHosts = cmd.exe /d /c "ssh-keyscan -H $server 2>NUL"
if (-not $knownHosts) {
    throw 'Nie udalo sie pobrac klucza hosta SSH.'
}
$knownHosts | Set-Content -LiteralPath (Join-Path $repo 'vps-known-hosts') -Encoding ascii

Write-Host ''
Write-Host 'VPS jest gotowy.'
Write-Host "VPS_SSH_KEY:     $privateKey"
Write-Host "VPS_KNOWN_HOSTS: $(Join-Path $repo 'vps-known-hosts')"
