import { getDisplayString } from './i18n';

describe('getDisplayString', () => {
  it('should return the string itself when input is a string', () => {
    const inputText = 'Hello, world!';
    expect(getDisplayString(inputText)).toBe('Hello, world!');
  });

  it('should return the "en" property value when input is an object with "en" key', () => {
    const inputText = { en: 'Hello in English' };
    expect(getDisplayString(inputText)).toBe('Hello in English');
  });

  it('should return an empty string when input is undefined', () => {
    expect(getDisplayString(undefined)).toBe('');
  });
});
