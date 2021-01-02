# TODO

1. Allow more than 8 types to be used in a [OneOf](src/types/OneOf.ts) type, by:
  * Auto-splitting large schemas into smaller private types and combining them into an exported master type
  * Auto-generating specific `OneOf_n` types on the fly
  * Creating a variadic `OneOf` type
2. Support additionalProperties on "object" types using `& Record<string, V>`
3. Allow defining a specific json-schema version to generate from
4. Allow generating `index.ts` files which export everything in their folder, allowing importing from just the folder rather than the file
