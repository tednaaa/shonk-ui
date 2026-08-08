import { createCSVFile } from './create-csv-file';

describe('createCSVFile', () => {
  describe('with object data (headers)', () => {
    it('should create CSV file with headers from object array', () => {
      const file = createCSVFile('test', `
        name,age,city
        John,30,New York
        Jane,25,Los Angeles
      `);

      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe('test.csv');
      expect(file.type).toBe('text/csv');
    });

    it('should add .csv extension if not present', () => {
      const file = createCSVFile('test-file', `
        name,age
        John,30
      `);

      expect(file.name).toBe('test-file.csv');
    });

    it('should not add .csv extension if already present', () => {
      const file = createCSVFile('test-file.csv', `
        name,age
        John,30
      `);

      expect(file.name).toBe('test-file.csv');
    });

    it('should create CSV content that can be read', async () => {
      const file = createCSVFile('test', `name,age
John,30
Jane,25`);
      const content = await file.text();

      expect(content).toContain('name,age');
      expect(content).toContain('John,30');
      expect(content).toContain('Jane,25');
    });
  });

  describe('with primitive data (no headers)', () => {
    it('should create CSV file from string array', () => {
      const file = createCSVFile('fruits', `
        apple
        banana
        cherry
      `);

      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe('fruits.csv');
      expect(file.type).toBe('text/csv');
    });

    it('should create CSV file from number array', () => {
      const file = createCSVFile('numbers', `
        1
        2
        3
        4
        5
      `);

      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe('numbers.csv');
      expect(file.type).toBe('text/csv');
    });

    it('should create CSV content from primitives that can be read', async () => {
      const file = createCSVFile('fruits', `apple
banana
cherry`);
      const content = await file.text();

      expect(content).toContain('apple');
      expect(content).toContain('banana');
      expect(content).toContain('cherry');
    });

    it('should handle mixed string and number primitives', async () => {
      const file = createCSVFile('mixed', `item1
100
item2
200`);
      const content = await file.text();

      expect(content).toContain('item1');
      expect(content).toContain('100');
      expect(content).toContain('item2');
      expect(content).toContain('200');
    });
  });

  describe('error cases', () => {
    it('should throw error when rows array is empty', () => {
      expect(() => {
        createCSVFile('test', '');
      }).toThrow('csv must not be empty');
    });
  });
});
