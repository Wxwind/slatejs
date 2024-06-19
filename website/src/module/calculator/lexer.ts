import { Token, TokenType } from './token';
import { isLetterChar, isNil, isNumberChar } from './utils';

export class Lexer {
  nextIndex = -1;

  nextChar: string | null = '';

  tokenMap: { [key: string]: TokenType } = {};

  constructor(private text: string) {
    Object.values(TokenType).forEach((k) => {
      this.tokenMap[k as string] = k;
    });
    this.moveNext();
  }

  getNextToken = () => {
    this.skipWhitespace();
    if (isNil(this.nextChar)) return new Token(TokenType.EOF, TokenType.EOF);
    // char is number
    if (isNumberChar(this.nextChar)) {
      const start = this.nextIndex;
      // get full number
      while (isNumberChar(this.nextChar)) {
        this.moveNext();
        if (this.nextChar === '.') {
          this.moveNext();
          while (isNumberChar(this.nextChar)) {
            this.moveNext();
          }
        }
        if (this.nextChar === 'e' || this.nextChar === 'E') {
          this.moveNext();
          if (!(isNumberChar(this.nextChar) || (this.nextChar as string) === '-')) {
            throw new Error(`lexer: missing exponent after 'e', find ${this.nextChar}`);
          }
          this.moveNext();

          while (isNumberChar(this.nextChar)) {
            this.moveNext();
          }
        }
      }
      const end = this.nextIndex;
      const res = this.text.substring(start, end);
      return new Token(TokenType.NUMBER, res);
    } else if (isLetterChar(this.nextChar)) {
      let res = '';
      // get unit
      while (isLetterChar(this.nextChar)) {
        res += this.nextChar;
        this.moveNext();
      }
      return new Token(TokenType.UNIT, res);
    } else {
      const t = this.tokenMap[this.nextChar];
      if (!isNil(t)) {
        this.moveNext();
        return new Token(t, t);
      }

      throw new Error(`lexer: unresolved symbol '${this.nextChar}'`);
    }
  };

  private moveNext() {
    this.nextIndex++;
    if (this.nextIndex >= this.text.length) {
      this.nextChar = null;
      return;
    }
    this.nextChar = this.text[this.nextIndex];
  }

  private skipWhitespace = () => {
    while (
      this.nextChar === ' ' ||
      this.nextChar === '\t' ||
      this.nextChar === '\n' ||
      this.nextChar === '\r'
    ) {
      this.moveNext();
    }
  };
}
