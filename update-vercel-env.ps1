# PowerShell script to update Vercel environment variables using API
# Run this if Vercel CLI doesn't work

# You'll need your Vercel API token from: https://vercel.com/account/tokens

$VERCEL_TOKEN = "YOUR_VERCEL_TOKEN_HERE"
$API_URL = "https://welcoming-nourishment-production.up.railway.app/api"

# Admin Dashboard Project ID
$ADMIN_PROJECT_ID = "virtualmall-admin"

# Vendor Dashboard Project ID  
$VENDOR_PROJECT_ID = "virtualmall-vendor"

# Function to add environment variable
function Add-VercelEnv {
    param($ProjectId, $Key, $Value, $Target)
    
    $headers = @{
        "Authorization" = "Bearer $VERCEL_TOKEN"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        "key" = $Key
        "value" = $Value
        "type" = "encrypted"
        "target" = @($Target)
    } | ConvertTo-Json
    
    $url = "https://api.vercel.com/v9/projects/$ProjectId/env"
    
    try {
        Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
        Write-Host "✅ Added $Key to $ProjectId ($Target)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to add $Key to $ProjectId ($Target): $_" -ForegroundColor Red
    }
}

Write-Host "🔧 Updating Vercel Environment Variables..." -ForegroundColor Cyan

# Update Admin Dashboard
Write-Host "`n📊 Admin Dashboard:" -ForegroundColor Yellow
Add-VercelEnv -ProjectId $ADMIN_PROJECT_ID -Key "VITE_API_URL" -Value $API_URL -Target "production"
Add-VercelEnv -ProjectId $ADMIN_PROJECT_ID -Key "VITE_API_URL" -Value $API_URL -Target "preview"
Add-VercelEnv -ProjectId $ADMIN_PROJECT_ID -Key "VITE_API_URL" -Value $API_URL -Target "development"

# Update Vendor Dashboard
Write-Host "`n📊 Vendor Dashboard:" -ForegroundColor Yellow
Add-VercelEnv -ProjectId $VENDOR_PROJECT_ID -Key "VITE_API_URL" -Value $API_URL -Target "production"
Add-VercelEnv -ProjectId $VENDOR_PROJECT_ID -Key "VITE_API_URL" -Value $API_URL -Target "preview"
Add-VercelEnv -ProjectId $VENDOR_PROJECT_ID -Key "VITE_API_URL" -Value $API_URL -Target "development"

Write-Host "`n✅ Environment variables updated!" -ForegroundColor Green
Write-Host "⏳ Now redeploy both projects from Vercel dashboard" -ForegroundColor Yellow
