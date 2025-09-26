import { getDisplayString } from './i18n';

const testMultilangString = {
  en: 'English',
  ja: '日本語',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
};

describe('getDisplayString', () => {
  it('should return the string itself when input is a string', () => {
    const inputText = 'Hello, world!';
    expect(getDisplayString(inputText)).toBe('Hello, world!');
  });

  it('should return an empty string when input is undefined', () => {
    expect(getDisplayString(undefined)).toBe('');
  });

  describe('language fallback', () => {
    it('should use exact language match when available', () => {
      expect(getDisplayString(testMultilangString, 'en')).toBe('English');
      expect(getDisplayString(testMultilangString, 'ja')).toBe('日本語');
      expect(getDisplayString(testMultilangString, 'zh-CN')).toBe('简体中文');
      expect(getDisplayString(testMultilangString, 'zh-TW')).toBe('繁體中文');
    });

    it('should fallback to base language when exact match not available', () => {
      expect(getDisplayString(testMultilangString, 'en-US')).toBe('English');
      expect(getDisplayString(testMultilangString, 'ja-JP')).toBe('日本語');
    });

    it('should fallback to "en" when neither exact nor base language available', () => {
      expect(getDisplayString(testMultilangString, 'fr')).toBe('English');
      expect(getDisplayString(testMultilangString, 'zh-HK')).toBe('English');
    });

    it('should prioritize exact match over base language fallback', () => {
      const inputText = { en: 'Base English', 'en-US': 'US English', 'en-GB': 'UK English' };
      expect(getDisplayString(inputText, 'en-US')).toBe('US English');
      expect(getDisplayString(inputText, 'en-GB')).toBe('UK English');
      expect(getDisplayString(inputText, 'en-CA')).toBe('Base English');
    });
  });

  describe('translation keys with @ prefix', () => {
    it('should resolve @Settings key to correct language', () => {
      expect(getDisplayString('@Settings', 'en')).toBe('Settings');
      expect(getDisplayString('@Settings', 'ja')).toBe('設定');
    });

    it('should apply language fallback for translation keys', () => {
      expect(getDisplayString('@Settings', 'en-US')).toBe('Settings');
      expect(getDisplayString('@Settings', 'ja-JP')).toBe('設定');
    });

    it('should fallback to en for unsupported languages with translation keys', () => {
      expect(getDisplayString('@Settings', 'fr')).toBe('Settings');
      expect(getDisplayString('@Settings', 'de')).toBe('Settings');
    });

    it('should return string as-is if not a translation key', () => {
      expect(getDisplayString('@Unknown')).toBe('@Unknown');
    });
  });
});
