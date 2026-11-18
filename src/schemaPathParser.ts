/**
 * Parses dotted field paths used by schema guards into structured segments.
 *
 * Paths address fields on an event payload, e.g. `user.address.city` or `items[0].id`.
 * The parser is intentionally small and strict: it rejects malformed input early so
 * guards can report a precise error before walking the payload.
 */

/** A single resolved step within a path expression. */
export interface PathSegment {
  /** Property name to read on the current value. */
  key: string;
  /** Index to read on the current value, present only for `[n]` segments. */
  index?: number;
}

/** Raised when a path expression cannot be parsed. */
export class SchemaPathParseError extends Error {
  constructor(
    message: string,
    /** Zero-based character offset where the problem was detected. */
    readonly offset: number,
  ) {
    super(`${message} (at offset ${offset})`);
    this.name = 'SchemaPathParseError';
  }
}

const KEY_START = /[A-Za-z_$]/;
const KEY_PART = /[A-Za-z0-9_$]/;

/** Statistics about the parsing process. */
export interface ParsingStats {
  /** Total number of segments parsed. */
  totalSegments: number;
  /** Number of segments with indices (e.g. `items[0]`). */
  segmentsWithIndex: number;
  /** Number of errors encountered during parsing. */
  parsingErrors: number;
}

/**
 * Parse a path expression such as `user.tags[2].name`.
 *
 * Throws {@link SchemaPathParseError} for empty input, leading/trailing dots,
 * empty bracket indices or non-numeric indices.
 *
 * @returns The structured path segments and parsing statistics.
 */
export function parseSchemaPath(expression: string): { segments: PathSegment[]; stats: ParsingStats } {
  if (expression.length === 0) {
    throw new SchemaPathParseError('Path expression must not be empty', 0);
  }

  let stats: ParsingStats = { totalSegments: 0, segmentsWithIndex: 0, parsingErrors: 0 };

  const segments: PathSegment[] = [];
  let i = 0;

  while (i < expression.length) {
    const keyStart = i;
    if (!KEY_START.test(expression[i]!)) {
      stats.parsingErrors++;
      throw new SchemaPathParseError('Expected property name', i);
    }
    i++;
    while (i < expression.length && KEY_PART.test(expression[i]!)) i++;
    const key = expression.slice(keyStart, i);
    segments.push({ key });
    stats.totalSegments++;

    // Consume any bracket indices attached to this key.
    while (i < expression.length && expression[i] === '[') {
      const open = i;
      i++;
      const numStart = i;
      while (i < expression.length && expression[i]! >= '0' && expression[i]! <= '9') i++;
      if (i === numStart) {
        stats.parsingErrors++;
        throw new SchemaPathParseError('Expected numeric index', open);
      }
      if (expression[i] !== ']') {
        stats.parsingErrors++;
        throw new SchemaPathParseError('Unterminated index', open);
      }
      const index = Number(expression.slice(numStart, i));
      i++;
      segments.push({ key, index });
      stats.totalSegments++;
      stats.segmentsWithIndex++;
    }

    if (i === expression.length) break;
    if (expression[i] !== '.') {
      stats.parsingErrors++;
      throw new SchemaPathParseError(`Unexpected character "${expression[i]}"`, i);
    }
    i++;
    if (i === expression.length) {
      stats.parsingErrors++;
      throw new SchemaPathParseError('Path expression must not end with a dot', i);
    }
    // A bracket index must be followed by a key, not another index.
    if (expression[i] === '[') {
      stats.parsingErrors++;
      throw new SchemaPathParseError('Unexpected index after separator', i);
    }
  }

  return { segments, stats };
}
