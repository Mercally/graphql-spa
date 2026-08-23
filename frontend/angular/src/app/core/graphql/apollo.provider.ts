import { EnvironmentProviders, inject, makeEnvironmentProviders } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { provideApollo } from 'apollo-angular';
import { SettingsService } from '../settings/settings.service';
import { RequestCounterService } from '../counters/request-counter.service';
import { createGraphqlCountLink } from './graphql-count.link';

/**
 * Wires Apollo Angular as the GraphQL client. The HTTP link's `uri` is a
 * function evaluated per-request so the active backend (.NET vs Node) can be
 * switched at runtime from the settings dropdown without re-creating the
 * Apollo client. A small counting link records every operation for the
 * dashboard's request-count panel.
 */
export function provideGraphql(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const settings = inject(SettingsService);
      const counter = inject(RequestCounterService);

      const link = createGraphqlCountLink(counter).concat(
        httpLink.create({ uri: () => settings.graphqlUrl() })
      );

      return {
        link,
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: { fetchPolicy: 'network-only' },
          query: { fetchPolicy: 'network-only' }
        }
      };
    })
  ]);
}
