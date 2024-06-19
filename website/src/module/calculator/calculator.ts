import { isNil } from '@/util';
import { ASTNode, BinOpNode, NumberNode, UnaryOpNode, UnitNode } from './ast';
import { Interpreter } from './interpretor';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { Token } from './token';

export const calc = (expr: string) => {
  if (isNil(expr) || expr === '') {
    return 0;
  }
  const l = new Lexer(expr);
  const p = new Parser(l);
  const root = p.parse();

  const interpreter = new Interpreter();
  const res = interpreter.visit(root);
  return res;
};

function astToString(ast: ASTNode, prefix = '', isLeaf = true): string {
  if (ast instanceof BinOpNode) {
    return printASTNode(ast.root, [ast.left, ast.right], prefix, isLeaf);
  } else if (ast instanceof UnaryOpNode) {
    return printASTNode(ast.root, [ast.child], prefix, isLeaf);
  } else if (ast instanceof UnitNode) {
    return printASTNode(ast.root, [], prefix, isLeaf);
  } else if (ast instanceof NumberNode) {
    if (ast.child) {
      return printASTNode(ast.root, [ast.child], prefix, isLeaf);
    }
    return printASTNode(ast.root, [], prefix, isLeaf);
  }
  throw new Error(`runtime error: the ASTNode '${typeof ast}' is not supported`);
}

function printASTNode(root: Token, children: ASTNode[], prefix: string, isLeaf: boolean) {
  const s = `${prefix + (isLeaf ? '└─ ' : '├─ ') + root.value}\n`;
  const newPrefix = prefix + (isLeaf ? '   ' : '|  ');
  const childrenInfo = children
    .map((a, i) => {
      if (i === children.length - 1) {
        return astToString(a, newPrefix, true);
      }
      return astToString(a, newPrefix, false);
    })
    .join('');
  return s + childrenInfo;
}

export const printAST = (root: ASTNode) => {
  console.log(astToString(root));
};
