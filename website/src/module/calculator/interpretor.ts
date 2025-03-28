import { ASTNode, BinOpNode, NumberNode, UnaryOpNode, UnitNode } from './ast';
import { isNil } from './utils';

export class Interpreter {
  visit: (ast: ASTNode) => number = (ast: ASTNode) => {
    if (ast instanceof BinOpNode) {
      return this.visit_BinOp(ast);
    } else if (ast instanceof UnaryOpNode) {
      return this.visit_UnaryOp(ast);
    } else if (ast instanceof UnitNode) {
      return this.visit_Unit(ast);
    } else if (ast instanceof NumberNode) {
      return this.visit_NumberNode(ast);
    }
    throw new Error(`runtime error: the ASTNode '${typeof ast}' is not supported`);
  };

  private visit_BinOp = (node: BinOpNode) => {
    const { left, right } = node;
    switch (node.root.value) {
      case '+':
        return this.visit(left) + this.visit(right);
      case '-':
        return this.visit(left) - this.visit(right);
      case '*':
        return this.visit(left) * this.visit(right);
      case '/':
        return this.visit(left) / this.visit(right);
      default:
        throw new Error(`runtime error: the binary operation '${node.root.value}' is not supported`);
    }
  };

  private visit_UnaryOp = (node: UnaryOpNode) => {
    const root = node.child;
    switch (node.root.value) {
      case '+':
        return this.visit(root);
      case '-':
        return -this.visit(root);
      default:
        throw new Error(`runtime error: the unary operation '${node.root.value}' is not supported`);
    }
  };

  private visit_NumberNode = (node: NumberNode) => {
    const r = Number(node.root.value);
    if (isNaN(r)) {
      throw new Error(`runtime error: '${node.root.value}' is not a number`);
    }
    const unit = node.child;
    if (isNil(unit)) {
      return r;
    } else if (unit instanceof UnitNode) {
      return r * this.visit(unit);
    }
    throw new Error(`runtime error: '${unit}' is not a unit`);
  };

  private visit_Unit = (node: UnitNode) => {
    switch (node.root.value.toLowerCase()) {
      case 'mm':
        return 0.001;
      case 'cm':
        return 0.01;
      case 'dm':
        return 0.1;
      case 'm':
        return 1;
      case 'r':
        return 360;
      case 'inch':
      case 'in':
        return 0.3048;
      case 'feet':
      case 'foot':
      case 'ft':
        return 0.0254;
      default:
        throw new Error(`runtime error: the unit '${node.root.value}' is not supported`);
    }
  };
}
