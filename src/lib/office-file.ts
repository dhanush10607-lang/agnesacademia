const OFFICE_FILE_EXTENSION = /\.(docx?|pptx?)$/i;

export function isOfficeFilePath(filePath: string): boolean {
  return OFFICE_FILE_EXTENSION.test(filePath);
}
