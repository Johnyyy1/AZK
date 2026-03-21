$screens = Get-Content -Raw -Path .\screens.json | ConvertFrom-Json
$baseDir = ".\stitch_project"
New-Item -ItemType Directory -Force -Path $baseDir | Out-Null

foreach ($screen in $screens) {
    # Sanitize title for filename
    $safeTitle = $screen.title -replace '[<>:"/\\|?*]', '-'
    
    if (![string]::IsNullOrEmpty($screen.htmlCodeUrl)) {
        $outFile = Join-Path $baseDir ($safeTitle + $screen.extension)
        Write-Host "Downloading HTML/Code for $($screen.title) to $outFile..."
        try {
            Invoke-WebRequest -Uri $screen.htmlCodeUrl -OutFile $outFile -UseBasicParsing
        } catch {
            Write-Host "Failed to download $($screen.title): $_"
        }
    }
    
    if (![string]::IsNullOrEmpty($screen.screenshotUrl)) {
        $imgDir = Join-Path $baseDir "images"
        New-Item -ItemType Directory -Force -Path $imgDir | Out-Null
        $imgFile = Join-Path $imgDir ($safeTitle + ".png")
        Write-Host "Downloading Screenshot for $($screen.title) to $imgFile..."
        try {
            Invoke-WebRequest -Uri $screen.screenshotUrl -OutFile $imgFile -UseBasicParsing
        } catch {
            Write-Host "Failed to download screenshot for $($screen.title): $_"
        }
    }
}
Write-Host "Download complete!"
