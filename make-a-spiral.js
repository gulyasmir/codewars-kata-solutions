function spiralize(n) {
  return Array(n)
    .fill(Array(n).fill())
    .map((x, row) =>
      x.map((_, col) => {
        return +(
          (row < n / 2 &&
            row % 2 === 0 &&
            row - 2 <= col &&
            col <= n - row - 1) ||
          (col > (n - 2) / 2 &&
            (n - col) % 2 === 1 &&
            n - col - 2 < row &&
            row <= n - (n - col)) ||
          (row > n / 2 &&
            (n - row) % 2 === 1 &&
            n - row - 2 < col &&
            col < n - (n - row)) ||
          (col < (n - 2) / 2 && col % 2 === 0 && row > col + 1 && row < n - col)
        );
      })
    );
}
