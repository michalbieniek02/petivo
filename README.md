# Petivo

Next.js storefront deployed to `petivo.shop` through GitHub Actions.

## VPS bootstrap

Run once from Windows PowerShell:

```powershell
.\bootstrap-vps.ps1
```

Then add these GitHub repository secrets:

- `VPS_HOST`: `51.83.235.161`
- `VPS_USER`: `ubuntu`
- `VPS_SSH_KEY_B64`: output copied by the command below
- `VPS_KNOWN_HOSTS`: contents of `vps-known-hosts`

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path .\deploy-key))) | Set-Clipboard
```

Every push to `main` builds the standalone Next.js server and deploys it to the VPS.
