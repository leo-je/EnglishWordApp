export interface ImportedData {
  categories: any[];
  words: any[];
  metadata?: {
    version: string;
    importedAt: number;
    source: string;
  };
}
