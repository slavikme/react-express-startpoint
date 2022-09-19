import {wordCapitalize} from "./string";

test('string wordCapitalize function', () => {
    expect(wordCapitalize('hello')).toBe('Hello');
    expect(wordCapitalize('HELLO')).toBe('HELLO');
    expect(wordCapitalize('hEllo')).toBe('HEllo');
    expect(wordCapitalize('.hello')).toBe('.Hello');
    expect(wordCapitalize('12hello')).toBe('12hello');
    expect(wordCapitalize(' hello, world ')).toBe(' Hello, world ');
    expect(wordCapitalize('привет')).toBe('Привет');
    expect(wordCapitalize('!@#$%^&*()±')).toBe('!@#$%^&*()±');
});
