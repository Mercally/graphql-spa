/**
 * The .NET (HotChocolate) and Node (graphql-js) GraphQL schemas genuinely
 * differ in shape: id-like arguments are declared as String on .NET but ID
 * on Node, and enum-valued arguments (status/role) are plain String on .NET
 * but real GraphQL enums on Node. Declaring a typed `$variable` for an id
 * would need a different declared type per backend to satisfy validation.
 *
 * Simplest fix: embed id/enum values as inline literals in the query text
 * instead of variables. Per the GraphQL spec, a quoted string literal is
 * valid input for both String and ID argument types, and (for Node) a bare
 * enum literal or a quoted string coerce the same way for enum arguments'
 * variable form - so literals sidestep the whole mismatch. These helpers
 * just do that escaping safely.
 */

/** Escape a value for embedding inside a double-quoted GraphQL string literal. */
export function gqlString(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

/** A quoted-string literal, valid wherever a String or ID argument is expected. */
export function idLiteral(value: string): string {
  return gqlString(value);
}

/** A list of quoted-string literals, valid wherever [String] or [ID] is expected. */
export function idListLiteral(values: string[]): string {
  return `[${values.map(gqlString).join(', ')}]`;
}

/**
 * status/role-style fields are a plain StringType argument on .NET but a
 * real GraphQL enum on Node - enums must be given as a bare (unquoted)
 * identifier literal, so the two backends need different literal syntax
 * for the exact same logical value.
 */
export function enumLiteral(backend: 'dotnet' | 'node', value: string): string {
  return backend === 'node' ? value : gqlString(value);
}
