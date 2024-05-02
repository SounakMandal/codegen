import { TypedFlags } from 'meow';
import { Schema, SupportedLanguages } from '../interface/schema';
import { validateCommand } from './cmd/validator';
import { validateSchema } from './file/validator';

export function validate(flags: TypedFlags<any>, schema: Schema) {
  const { error: flagError, logMessage: commandLogs } = validateCommand(flags);
  const { error: schemaError, logMessage: schemaLogs } = validateSchema(
    flags.output as SupportedLanguages,
    schema,
  );
  return {
    error: flagError || schemaError,
    logMessage: `${ commandLogs }\n${ schemaLogs }`,
  };
}
