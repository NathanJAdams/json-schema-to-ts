# TODO

1. Support additionalProperties on "object" types using `& Record<string, V>`
2. Support string patterns and/or formats
3. Allow more than 8 types to be used in a [OneOf](src/types/OneOf.ts) type, by:
  * Auto-splitting large schemas into smaller private types and combining them into an exported master type
  * Auto-generating specific `OneOf_n` types on the fly
  * Creating a variadic `OneOf` type
4. Allow defining a specific json-schema version to generate from
5. Allow generating `index.ts` files which export everything in their folder, allowing importing from just the folder rather than the file
