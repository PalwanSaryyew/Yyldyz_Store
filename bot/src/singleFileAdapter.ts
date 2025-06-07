// singleFileAdapter.ts
import { StorageAdapter } from "grammy";
import * as fs from "fs/promises"; // Async dosya işlemleri için
import * as path from "path";

// Tüm session verilerini tutacak ana obje yapısı
// Key'ler chat ID veya user ID olacak
interface AllSessionData {
  [key: string]: any; // Her anahtar için BotSessionData (veya uygun tipiniz)
}

export class SingleFileAdapter implements StorageAdapter<any> { // <any> yerine <BotSessionData> da olabilir
  private filePath: string;
  private allSessionData: AllSessionData = {}; // Tüm oturum verilerini bellekte tutar

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  // Dosyayı yükler ve belleğe alır
  async read(key: string): Promise<any | undefined> {
    if (Object.keys(this.allSessionData).length === 0) { // İlk okuma veya cache boşsa
      try {
        const fileContent = await fs.readFile(this.filePath, { encoding: 'utf-8' });
        if (fileContent.trim().length === 0) {
          this.allSessionData = {};
        } else {
          this.allSessionData = JSON.parse(fileContent);
        }
      } catch (error: any) {
        if (error.code === 'ENOENT') { // Dosya yoksa, boş bir obje ile başla
          this.allSessionData = {};
        } else {
          console.error("SingleFileAdapter: Dosya okuma hatası:", error);
          // throw error; // Hatanın yayılmasını istemiyorsanız bu satırı kaldırın
        }
      }
    }
    return this.allSessionData[key];
  }

  // Veriyi belleğe yazar ve dosyaya kaydeder
  async write(key: string, data: any): Promise<void> {
    this.allSessionData[key] = data;
    await this.saveToFile();
  }

  // Veriyi bellekteki objeden siler ve dosyaya kaydeder
  async delete(key: string): Promise<void> {
    delete this.allSessionData[key];
    await this.saveToFile();
  }

  // Bellekteki veriyi dosyaya kaydeder
  private async saveToFile(): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.allSessionData, null, 2), { encoding: 'utf-8' });
    } catch (error) {
      console.error("SingleFileAdapter: Dosya yazma hatası:", error);
    }
  }
}