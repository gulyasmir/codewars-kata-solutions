function toPostfix(expression) {
  var stack = [];
  var post = [];
  
  expression = expression.replace(/\s+/g, "");
  expression = expression.replace(/--/g, "+");
  expression = expression.replace(/\+-/g, "-");
  expression = expression.replace(/(\*|\/)-([0-9.]+)/g, "$1(0-$2)");
  expression = expression.replace(/(\*|\/)-\((.+?)\)/g, "$1(0-($2))");
  expression = expression.replace(/\(-/g, "(0-");

  for (var i = 0; i < expression.length; i++) {
    var symbol = "" + expression[i];
    var element = null;

    if (symbol in operators) {
      while (
        stack.length > 0 &&
        operators[symbol] <= operators[stack[stack.length - 1]]
      )
        post.push(stack.pop());
      stack.push(symbol);
    } else if (symbol === "(") {
      stack.push(symbol);
    } else if (symbol === ")") {
      while ((element = stack.pop()) !== "(") post.push(element);
    } else if (symbol === " ") {
    } else if (symbol === "=") {
      stack.push("=");
    } else if (/[0-9]/.test(symbol)) {
      while (i < expression.length - 1 && /^[0-9.]$/.test(expression[i + 1]))
      symbol += expression[++i];
      post.push(+symbol);
    } else if (/[a-z]/i.test(symbol)) {
      while (i < expression.length - 1 && /[a-z]/i.test(expression[i + 1]))
      symbol += expression[++i];
      post.push(symbol);
    }
  }

  return post.concat(stack.reverse());
}

var operators = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "^": 2,
  "%": 2,
};

function Interpreter() {
  this.vars = {};
}

Interpreter.prototype.eval = function (value) {
  if (/^[a-z]/i.test(value)) {
    if (!(value in this.vars)) throw new Error(value + " is not defined");
    return this.vars[value];
  } else return value;
};

Interpreter.prototype.input = function (expression) {
  var postfix = toPostfix(expression);
  var stack = [];
  for (var i = 0; i < postfix.length; i++) {
    var symbol = postfix[i];
    if (symbol == +symbol) {
      stack.push(+symbol);
    } else if (symbol in operators) {
      var a = this.eval(stack.pop()),
        b = this.eval(stack.pop());
      switch (symbol) {
        case "+":
          stack.push(a + b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          stack.push(b / a);
          break;
        case "-":
          stack.push((b || 0) - a);
          break;
        case "%":
          stack.push(b % a);
          break;
      }
    } else if (symbol === "=") {
      var value = stack.pop(),
        name = stack.pop();
      this.vars[name] = value;
      stack.push(value);
    } else {
      stack.push(symbol);
    }
  }
  var string = stack.pop();
  return string ? this.eval(string) : "";
};
// run
var interpreter = new Interpreter();
interpreter.input("x = 2");
interpreter.input("y = x + 2 - (x * 8)");
interpreter.input("z = y * x");

console.log(i.input("x"));
console.log(i.input("y"));
console.log(i.input("z"));