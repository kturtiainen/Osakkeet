/**
 * Reusable utility functions for importing and exporting data
 */

/**
 * Export data as a JSON file download
 * @param data - Data to export
 * @param filename - Name of the file to download
 */
export const exportData = (data: unknown, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

/**
 * Import data from a JSON file
 * @param accept - File types to accept (default: '.json')
 * @returns Promise that resolves to parsed JSON data or null if cancelled/error
 */
export const importData = async <T = unknown>(accept: string = '.json'): Promise<T | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string) as T;
          resolve(data);
        } catch {
          resolve(null);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
};
