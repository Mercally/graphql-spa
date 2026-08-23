import { ApolloLink, Observable } from '@apollo/client/core';
import { RequestCounterService } from '../counters/request-counter.service';

/** Apollo terminating-adjacent link that counts every GraphQL operation actually sent. */
export function createGraphqlCountLink(counter: RequestCounterService): ApolloLink {
  return new ApolloLink((operation, forward) => {
    counter.recordGraphql(operation.operationName || 'anonymous');
    return forward(operation) as unknown as Observable<any>;
  });
}
