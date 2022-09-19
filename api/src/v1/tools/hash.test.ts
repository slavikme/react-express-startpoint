import {sha1} from "./hash";

test('sha1', () => {
    expect(sha1('hello')).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
    expect(sha1('')).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');
});
