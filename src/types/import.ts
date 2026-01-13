export interface ImportSource {
  type: 'local' | 'api' | 'excel' | 'cloud';
  name: string;
  description: string;
  icon: string;
}

export interface ImportedData {
  categories: any[];
  words: any[];
  metadata: {
    version: string;
    importedAt: number;
    source: string;
  };
}
