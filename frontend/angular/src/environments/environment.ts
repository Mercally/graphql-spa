// Default backend base URLs. Both backends share one MongoDB (see docs/mongodb-model.md).
// The in-app settings dropdown (SettingsService) lets the user switch at runtime
// without rebuilding — these are just the starting defaults.
export const environment = {
  production: false,
  backends: {
    dotnet: {
      label: '.NET',
      restBaseUrl: 'http://localhost:5000/api',
      graphqlUrl: 'http://localhost:5000/graphql'
    },
    node: {
      label: 'Node.js',
      restBaseUrl: 'http://localhost:4000/api',
      graphqlUrl: 'http://localhost:4000/graphql'
    }
  }
};
