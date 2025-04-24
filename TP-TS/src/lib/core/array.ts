/**
 * Finds duplicate elements in an array based on the provided identifier function.
 *
 * ```js
 * const items = [
 *   { id: 1, name: 'item1' },
 *   { id: 2, name: 'item2' },
 *   { id: 1, name: 'item3' },
 *   { id: 4, name: 'item4' },
 *   { id: 2, name: 'item5' }
 * ];
 * const duplicates = getDuplicates(items, item => item.id);
 * console.log(duplicates);
 * // Output: [{ id: 1, name: 'item3' }, { id: 2, name: 'item5' }]
 * ```
 *
 * @template T
 * @param array - The array to search for duplicates.
 * @param identifier - A function that returns a unique identifier for each element.
 * @returns An array of duplicate elements.
 */
export function getDuplicates<T>(array: T[], identifier: (value: T) => any): T[] {
  if (array.length < 2) {
    return [];
  }

  const seen: Record<string, boolean> = {};
  return array.filter(function (currentObject) {
    return (
      seen.hasOwnProperty(String(identifier(currentObject))) ||
      (seen[String(identifier(currentObject))] = false)
    );
  });
}

/**
 * Returns a new array of unique elements based on the provided identifier function.
 *
 * ```js
 * const items = [
 *   { id: 1, name: 'item1' },
 *   { id: 2, name: 'item2' },
 *   { id: 1, name: 'item3' },
 *   { id: 4, name: 'item4' },
 *   { id: 2, name: 'item5' }
 * ];
 * const uniqueItems = uniqueBy(items, item => item.id);
 * console.log(uniqueItems);
 * // Output: [{ id: 1, name: 'item3' }, { id: 2, name: 'item5' }, { id: 4, name: 'item4' }]
 * ```
 *
 * @template T
 * @export
 * @param array - The array to filter for unique elements.
 * @param identifier - A function that returns a unique identifier for each element.
 * @returns An array of unique elements.
 */
export function uniqueBy<T>(array: T[], identifier: (data: T) => any): T[] {
  const uniques: Record<string, T> = {};
  array.forEach((a) => (uniques[String(identifier(a))] = a));
  return Object.values(uniques);
}

/**
 * Returns a new array of unique values created by applying the provided identifier function to each element.
 *
 * ```js
 * const items = [
 *   { id: 1, name: 'item1' },
 *   { id: 2, name: 'item2' },
 *   { id: 1, name: 'item3' },
 *   { id: 4, name: 'item4' },
 *   { id: 2, name: 'item5' }
 * ];
 * const uniqueValues = uniqueValuesBy(items, item => item.id);
 * console.log(uniqueValues);
 * // Output: [1, 2, 4]
 * ```
 *
 * @template T
 * @template G
 * @export
 * @param array - The array to filter for unique values.
 * @param identifier - A function that returns a transformed value for each element.
 * @returns An array of unique values.
 */
export function uniqueValuesBy<T, G>(array: T[], identifier: (data: T) => G): G[] {
  const uniques = uniqueBy(array, identifier);
  return uniques.map((unique) => identifier(unique));
}
