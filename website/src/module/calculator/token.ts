export class Token {
  constructor(public tokenType: TokenType, public value: string) {}

  public toString() {
    return `tokenType= ${this.tokenType}, value= ${this.value}`;
  }
}

export enum TokenType {
  NUMBER = 'NUMBER',
  UNIT = 'STRING',
  PLUS = '+',
  MINUS = '-',
  LPARENTHESIS = '(',
  RPARENTHESIS = ')',
  MUTIPLICATION = '*',
  DIVISION = '/',
  EOF = 'EOF',
}
