import { Token } from './token';

export abstract class ASTNode {}

// binary operator
export class BinOpNode extends ASTNode {
  constructor(
    public root: Token,
    public left: ASTNode,
    public right: ASTNode
  ) {
    super();
  }
}

// unary operator
export class UnaryOpNode extends ASTNode {
  constructor(
    public root: Token,
    public child: ASTNode
  ) {
    super();
  }
}
export class NumberNode extends ASTNode {
  constructor(
    public root: Token,
    public child: ASTNode | null
  ) {
    super();
  }
}

export class UnitNode extends ASTNode {
  constructor(public root: Token) {
    super();
  }
}
