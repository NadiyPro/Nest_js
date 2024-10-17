export class TransformHelper {
  public static toLowerCase({ value }: { value: string }): string {
    return value ? value.toString().toLowerCase() : value;
  } // Приводить переданий рядок до нижнього регістру
  // {value}: {value: string} - Це деструктуризація об'єкта з властивістю value
  // *якщо value не існує або дорівнює null/undefined,
  // повертається саме це значення (тобто ніякого перетворення не відбувається)

  public static trim({ value }: { value: string }): string {
    return value ? value.toString().trim() : value;
  } // Видаляє пробіли з початку та кінця рядка
}
