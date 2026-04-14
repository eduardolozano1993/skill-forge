param(
  [string]$GrafanaUrl = "http://localhost:3001",
  [string]$User = "",
  [string]$Password = "",
  [switch]$SetAsHome
)

$ErrorActionPreference = "Stop"

if (-not $User) {
  $User = $env:PGWATCH_GRAFANA_USER
}

if (-not $Password) {
  $Password = $env:PGWATCH_GRAFANA_PASSWORD
}

if (-not $User -or -not $Password) {
  throw "Grafana credentials are required. Set PGWATCH_GRAFANA_USER and PGWATCH_GRAFANA_PASSWORD or pass -User/-Password."
}

$sourceUid = "health-check"
$targetUid = "skillforge-performance-health"
$targetTitle = "Skill Forge Performance & Health"

$desiredTitles = @(
  "Query runtime (avg.)",
  "Longest query runtime",
  "QPS (avg.)",
  "TPS (avg.)",
  "Active connections",
  "Blocked sessions",
  '"Idle in TX" count',
  "Shared Buffers hit pct.",
  "Temp. bytes per second (avg.)",
  "Seq. scans on >100 MB tables per minute (avg.)",
  "Autovacuum issues",
  "Approx. table bloat"
)

$panelWidth = 6
$panelHeight = 2
$panelsPerRow = 4

$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${User}:${Password}"))
$headers = @{
  Authorization = "Basic $base64Auth"
}

$source = Invoke-RestMethod -Method Get -Headers $headers -Uri "$GrafanaUrl/api/dashboards/uid/$sourceUid"
$dashboard = $source.dashboard

$selectedPanels = foreach ($title in $desiredTitles) {
  $panel = $dashboard.panels | Where-Object { $_.title -eq $title } | Select-Object -First 1
  if ($null -eq $panel) {
    throw "Could not find source panel '$title' in dashboard '$sourceUid'."
  }

  $clone = $panel | ConvertTo-Json -Depth 100 | ConvertFrom-Json
  $clone
}

for ($i = 0; $i -lt $selectedPanels.Count; $i++) {
  $panel = $selectedPanels[$i]
  $panel.id = $i + 1
  $panel.gridPos.x = ($i % $panelsPerRow) * $panelWidth
  $panel.gridPos.y = [Math]::Floor($i / $panelsPerRow) * $panelHeight
  $panel.gridPos.w = $panelWidth
  $panel.gridPos.h = $panelHeight
}

$dashboard.id = $null
$dashboard.uid = $targetUid
$dashboard.title = $targetTitle
$dashboard.version = 0
$dashboard.tags = @("pgwatch2", "skill-forge", "performance", "health")
$dashboard.panels = $selectedPanels

$payload = @{
  dashboard = $dashboard
  folderId = 0
  overwrite = $true
} | ConvertTo-Json -Depth 100

$result = Invoke-RestMethod -Method Post -Headers ($headers + @{ "Content-Type" = "application/json" }) -Uri "$GrafanaUrl/api/dashboards/db" -Body $payload

if ($SetAsHome) {
  $search = Invoke-RestMethod -Method Get -Headers $headers -Uri "$GrafanaUrl/api/search?query=$([uri]::EscapeDataString($targetTitle))"
  $dash = $search | Where-Object { $_.uid -eq $targetUid } | Select-Object -First 1
  if ($null -ne $dash) {
    $prefPayload = @{
      homeDashboardUID = $targetUid
      theme = ""
      timezone = ""
    } | ConvertTo-Json
    Invoke-RestMethod -Method Put -Headers ($headers + @{ "Content-Type" = "application/json" }) -Uri "$GrafanaUrl/api/org/preferences" -Body $prefPayload | Out-Null
  }
}

$result | ConvertTo-Json -Depth 10
