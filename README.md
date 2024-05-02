# Generate DTO for Rest APIs

Generate DTO for REST APIs for typesafe communication between backend and frontend.

- Supported primitive types: _int_, _float_, _double_, _string_
- Enum types are supported via string arrays
- Anonymous types are supported where we can define the fields of an entity as an json object
- Arrays are supported with the keyword _list_
- Maps of primitive key types are supported with the keyword _map_

The following languages are supported

- Typescript
- Java
- Golang

# CLI examples

- Typescript: `npx ts-node index.ts --file=test/contract.json --output=typescript --typescript_out=output/typescript`
- Java: `npx ts-node index.ts --file=test/contract.json --output=java --java_out=output/java`
- Golang: `npx ts-node index.ts --file=test/contract.json --output=go --go_out=output/golang`
