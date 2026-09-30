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

$hostKey = ssh -i $privateKey "$user@$server" "cut -d' ' -f1,2 /etc/ssh/ssh_host_ed25519_key.pub"
if (-not $hostKey) {
    throw 'Nie udalo sie pobrac klucza hosta SSH.'
}
"$server $hostKey" | Set-Content -LiteralPath (Join-Path $repo 'vps-known-hosts') -Encoding ascii

Write-Host ''
Write-Host 'VPS jest gotowy.'
Write-Host "VPS_SSH_KEY:     $privateKey"
Write-Host "VPS_KNOWN_HOSTS: $(Join-Path $repo 'vps-known-hosts')"
