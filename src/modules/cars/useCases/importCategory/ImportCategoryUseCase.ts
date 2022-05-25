import fs from "fs";
import { parse as csvParse } from "csv-parse";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

interface IImportCategory {
  name: string;
  description: string;
}

class ImportCategoryUseCase {
  constructor(private categoryRepository: ICategoriesRepository) {}

  loadCategories(file: Express.Multer.File) {
    const categories: IImportCategory[] = [];
    const stream = fs.createReadStream(file.path);
    const parseFile = csvParse();

    stream.pipe(parseFile);

    parseFile.on("data", (line) => {
      const [name, description] = line;
      categories.push({
        name,
        description,
      });
    });
  }

  execute(file: Express.Multer.File): void {
    const categories = this.loadCategories(file);
    console.log(categories);
  }
}

export { ImportCategoryUseCase };
