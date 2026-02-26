import { ParsedWniosek } from './types'

export abstract class ApplicationParser {
    abstract parse(text: string): Promise<ParsedWniosek>
}
