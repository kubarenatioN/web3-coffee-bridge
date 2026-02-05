export const NUMERIC_FORMAT_REGEX = /^[0-9]*(\.|,)*[0-9]*$/;

export class InputHelpers {
  static formatNumericInput(value: string): string | undefined {
    if (!value) {
      return '';
    }

    const matchFormat = NUMERIC_FORMAT_REGEX.test(value);
    if (!matchFormat) {
      return undefined;
    }

    const formatted = value.replace(',', '.');
    return formatted;
  }
}
