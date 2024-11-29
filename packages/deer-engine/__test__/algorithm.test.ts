import { quickSort } from '../src/util/sort';

const testSortFunction = (sortFunc: (src: number[]) => void) => {
  {
    const input = [3, 7, 3, 23, 1, 5, 8, 9, 43, 32, 12];
    const expected = [1, 3, 3, 5, 7, 8, 9, 12, 23, 32, 43];
    sortFunc(input);

    expect(input).toStrictEqual(expected);
  }
  {
    const input = [9, 8, 7, 6, 5, 4, 3, 2, 1];
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    sortFunc(input);

    expect(input).toStrictEqual(expected);
  }
  {
    const input = [1];
    const expected = [1];
    sortFunc(input);

    expect(input).toStrictEqual(expected);
  }
};

test('quick sort', () => {
  testSortFunction((src) => quickSort(src, 0, src.length, (a, b) => a - b));
});
