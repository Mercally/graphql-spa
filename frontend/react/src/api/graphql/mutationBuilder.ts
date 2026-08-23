/**
 * Generic mutation-document builder shared by every entity's GraphQL
 * mutations. It exists because the two backends' Mutation types are shaped
 * differently even though they do the same thing:
 *   .NET (HotChocolate): flat scalar arguments, e.g. updateCustomer(id, name, email)
 *   Node (graphql-js):   an input object,        e.g. updateCustomer(id, input: { name, email })
 * All values are inlined as literals (see support.ts) rather than passed as
 * typed $variables, which avoids needing a different variable-type
 * declaration (String vs ID, string vs enum) per backend.
 */
import { gql } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import type { BackendKey } from '../../config/env';
import { enumLiteral, gqlString, idLiteral, idListLiteral } from './support';

export type MutationField =
  | { name: string; kind: 'string'; value: string | null | undefined }
  | { name: string; kind: 'enum'; value: string | null | undefined }
  | { name: string; kind: 'id'; value: string | null | undefined }
  | { name: string; kind: 'idList'; value: string[] | null | undefined };

function renderField(backend: BackendKey, field: MutationField): string | null {
  if (field.value === undefined || field.value === null) return null;
  switch (field.kind) {
    case 'string':
      return `${field.name}: ${gqlString(field.value)}`;
    case 'enum':
      return `${field.name}: ${enumLiteral(backend, field.value)}`;
    case 'id':
      return `${field.name}: ${idLiteral(field.value)}`;
    case 'idList':
      return `${field.name}: ${idListLiteral(field.value)}`;
  }
}

function renderArgs(backend: BackendKey, fields: MutationField[]): string {
  return fields
    .map((f) => renderField(backend, f))
    .filter((s): s is string => s !== null)
    .join(', ');
}

export function buildCreateMutation(
  backend: BackendKey,
  mutationName: string,
  fields: MutationField[],
  selection: string
): DocumentNode {
  const args = renderArgs(backend, fields);
  const call = backend === 'node' ? `${mutationName}(input: { ${args} })` : `${mutationName}(${args})`;
  return gql(`mutation { ${call} { ${selection} } }`);
}

export function buildUpdateMutation(
  backend: BackendKey,
  mutationName: string,
  id: string,
  fields: MutationField[],
  selection: string
): DocumentNode {
  const idArg = `id: ${idLiteral(id)}`;
  const args = renderArgs(backend, fields);
  const call =
    backend === 'node' ? `${mutationName}(${idArg}, input: { ${args} })` : `${mutationName}(${idArg}, ${args})`;
  return gql(`mutation { ${call} { ${selection} } }`);
}

export function buildDeleteMutation(_backend: BackendKey, mutationName: string, id: string): DocumentNode {
  return gql(`mutation { ${mutationName}(id: ${idLiteral(id)}) }`);
}
