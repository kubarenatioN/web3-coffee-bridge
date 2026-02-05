export const NUMERIC_FORMAT_REGEX = /^[0-9]*[.]?[0-9]*$/;

export class InputHelpers {
  static formatNumericInput(value: string): string | undefined {
    if (!value) {
      return '';
    }
    const formatted = value.replace(',', '.');

    const matchFormat = NUMERIC_FORMAT_REGEX.test(formatted);
    if (!matchFormat) {
      return undefined;
    }

    return formatted;
  }
}
