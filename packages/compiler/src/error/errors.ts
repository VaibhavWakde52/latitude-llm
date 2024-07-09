import { CUSTOM_TAG_END, CUSTOM_TAG_START } from '$/constants'

function getKlassName(error: unknown): string {
  const errorKlass = error as Error
  return errorKlass.constructor ? errorKlass.constructor.name : 'Error'
}

export default {
  /* PARSER ERRORS */
  unexpectedEof: {
    code: 'unexpected-eof',
    message: 'Unexpected end of input',
  },
  unexpectedEofToken: (token: string) => ({
    code: 'unexpected-eof',
    message: `Unexpected '${token}'`,
  }),
  unexpectedToken: (token: string) => ({
    code: 'unexpected-token',
    message: `Expected '${token}'`,
  }),
  unexpectedBlockClose: {
    code: 'unexpected-block-close',
    message: 'Unexpected block closing tag',
  },
  invalidElseif: {
    code: 'invalid-elseif',
    message: "'elseif' should be 'else if'",
  },
  invalidElseifPlacementUnclosedBlock: (block: string) => ({
    code: 'invalid-elseif-placement',
    message: `Expected to close ${block} before seeing {:else if ...} block`,
  }),
  invalidElseifPlacementOutsideIf: {
    code: 'invalid-elseif-placement',
    message: 'Cannot have an {:else if ...} block outside an {#if ...} block',
  },
  invalidElsePlacementUnclosedBlock: (block: string) => ({
    code: 'invalid-else-placement',
    message: `Expected to close ${block} before seeing {:else} block`,
  }),
  invalidElsePlacementOutsideIf: {
    code: 'invalid-else-placement',
    message:
      'Cannot have an {:else} block outside an {#if ...} or {#each ...} block',
  },
  expectedBlockType: {
    code: 'expected-block-type',
    message: 'Expected if or each',
  },
  unexpectedTokenDestructure: {
    code: 'unexpected-token',
    message: 'Expected identifier or destructure pattern',
  },
  expectedName: {
    code: 'expected-name',
    message: 'Expected name',
  },
  unexpectedMustacheCloseTag: {
    code: 'unexpected-mustache-close-tag',
    message: 'Unexpected closing tag without matching opening tag',
  },
  unclosedComment: {
    code: 'unclosed-comment',
    message: 'Unclosed comment',
  },
  unexpectedEndOfComment: {
    code: 'unexpected-end-of-comment',
    message: 'Unexpected end of comment',
  },
  invalidTagName: {
    code: 'invalid-tag-name',
    message: 'Expected valid tag name',
  },
  duplicateAttribute: {
    code: 'duplicate-attribute',
    message: 'Attributes need to be unique',
  },
  unclosedAttributeValue: (token: string) => ({
    code: 'unclosed-attribute-value',
    message: `Expected to close the attribute value with ${token}`,
  }),
  missingAttributeValue: {
    code: 'missing-attribute-value',
    message: 'Expected value for the attribute',
  },
  invalidLogicBlockPlacement: (location: string, name: string) => ({
    code: 'invalid-logic-block-placement',
    message: `${CUSTOM_TAG_START}#${name}${CUSTOM_TAG_END} block cannot be ${location}`,
  }),
  invalidConfig: (message: string) => ({
    code: 'invalid-config',
    message: `Invalid config: ${message}`,
  }),
  unexpectedTagClose: (name: string) => ({
    code: 'unexpected-tag-close',
    message: `Unexpected closing tag for ${name}`,
  }),

  /* COMPILER ERRORS */
  unsupportedBaseNodeType: (type: string) => ({
    code: 'unsupported-base-node-type',
    message: `Unsupported base node type: ${type}`,
  }),
  variableAlreadyDeclared: (name: string) => ({
    code: 'variable-already-declared',
    message: `Variable '${name}' is already declared`,
  }),
  invalidObjectKey: {
    code: 'invalid-object-key',
    message: 'Invalid object key',
  },
  unsupportedOperator: (operator: string) => ({
    code: 'unsupported-operator',
    message: `Unsupported operator: ${operator}`,
  }),
  invalidAssignment: {
    code: 'invalid-assignment',
    message: 'Invalid assignment',
  },
  unknownTag: (name: string) => ({
    code: 'unknown-tag',
    message: `Unknown tag: '${name}'`,
  }),
  invalidToolCallPlacement: {
    code: 'invalid-tool-call-placement',
    message: 'All tool calls must be inside of an assistant message',
  },
  messageTagInsideMessage: {
    code: 'message-tag-inside-message',
    message: 'Message tags cannot be inside of another message',
  },
  contentTagInsideContent: {
    code: 'content-tag-inside-content',
    message: 'Content tags must be directly inside message tags',
  },
  toolCallTagInsideContent: {
    code: 'tool-call-tag-inside-content',
    message: 'Tool calls must be directly inside message tags',
  },
  toolCallTagWithoutId: {
    code: 'tool-call-tag-without-id',
    message: 'Tool call tags must have an id attribute',
  },
  toolMessageWithoutId: {
    code: 'tool-message-without-id',
    message: 'Tool messages must have an id attribute',
  },
  toolCallWithoutName: {
    code: 'tool-call-without-name',
    message: 'Tool calls must have a name attribute',
  },
  invalidToolCallArguments: {
    code: 'invalid-tool-call-arguments',
    message: 'Tool calls must contain a valid JSON object as arguments',
  },
  messageTagWithoutRole: {
    code: 'message-tag-without-role',
    message: 'Message tags must have a role attribute',
  },
  invalidReferencePromptPlacement: {
    code: 'invalid-reference-prompt-placement',
    message: 'Reference tags must not be inside of other tags',
  },
  referenceTagWithoutPrompt: {
    code: 'reference-tag-without-prompt',
    message: 'Reference tags must have a prompt attribute',
  },
  missingReferenceFunction: {
    code: 'missing-reference-function',
    message: 'A reference function was not provided',
  },
  referenceError: (err: unknown) => {
    const error = err as Error
    const errorKlassName = getKlassName(error)
    return {
      code: 'reference-error',
      message: `There was an error referencing the prompt: \n${errorKlassName} ${error.message}`,
    }
  },
  referenceTagHasContent: {
    code: 'reference-tag-has-content',
    message: 'Reference tags cannot have content',
  },
  invalidStaticAttribute: (name: string) => ({
    code: 'invalid-static-attribute',
    message: `The attribute '${name}' must only contain literal values`,
  }),

  /* Value resolution errors */
  invalidMessageRole: (name: string) => ({
    code: 'invalid-message-role',
    message: `Invalid message role: ${name}`,
  }),
  variableNotDeclared: (name: string) => ({
    code: 'variable-not-declared',
    message: `Variable '${name}' is not declared`,
  }),
  invalidSpreadInArray: (element: string) => ({
    code: 'invalid-spread-in-array',
    message: `Element '${element}' is not iterable`,
  }),
  invalidSpreadInObject: (property: string) => ({
    code: 'invalid-spread-in-object',
    message: `Property '${property}' is not valid for spreading`,
  }),
  invalidUpdate: (operation: string, type: string) => ({
    code: 'invalid-update',
    message: `Cannot use ${operation} operation on ${type}`,
  }),
  propertyNotExists: (property: string) => ({
    code: 'property-not-exists',
    message: `Property '${property}' does not exist on object`,
  }),
  notAFunction: (objectType: string) => ({
    code: 'not-a-function',
    message: `'${objectType}' is not a function`,
  }),
  functionCallError: (err: unknown) => {
    const error = err as Error
    const errorKlassName = getKlassName(error)
    return {
      code: 'function-call-error',
      message: `Error calling function: \n${errorKlassName} ${error.message}`,
    }
  },
}