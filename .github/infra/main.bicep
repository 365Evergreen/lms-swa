param staticWebAppName string
param location string = resourceGroup().location

resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    repositoryUrl: 'https://dev.azure.com/365evergreen/_git/365-lms'
    branch: 'Azure-SWA'
    buildProperties: {
      appLocation: '/'
      apiLocation: 'api'
      outputLocation: 'build'
    }
  }
}

output staticWebAppEndpoint string = staticWebApp.properties.defaultHostname
