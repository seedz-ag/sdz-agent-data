import * as csv from "fast-csv";
import * as fs from "fs";
import { CsvOptionsInterface } from "sdz-agent-types";

class CSV {
  /**
   * 
   * @param {string} path 
   * @param {CsvOptionsInterface} options 
   * @returns {Promise<any>}
   */
  read(path: string, options: CsvOptionsInterface) {
    return new Promise((resolve): any => {
      let result: Array<string> = [];
      fs.createReadStream(path)
        .on("error", (error) => {
          console.error(error);
        })
        .pipe(
          csv.parse({
            headers: true,
            skipRows: options.skipRows,
            maxRows: options.maxRows,
            delimiter: options.delimiter,
          })
        )
        .on("data", (row) => result.push(row))
        .on("end", () => resolve(result));
    });
  }

  /**
   * 
   * @param {string} path 
   * @param {array} data 
   * @returns {Promise<void>}
   */
  async write(path: string, data: any[]) {
    const isAppend = fs.existsSync(path);
    return new Promise((resolve): void => {
      const buffer = fs.createWriteStream(path, { flags: 'a' });

      if (isAppend) {
        buffer.write("\r\n");
      }

      buffer.on('finish', resolve);

      const stream = csv.format({
        delimiter: ",",
        escape: '"',
        headers: isAppend ? false : Object.keys(data[0]),
        quoteColumns: true,
        quoteHeaders: true,
        writeHeaders: true,
      });

      stream.pipe(buffer);

      for (const entity of data) {
        stream.write(entity);
      }

      stream.end();
    });
  }
}

export default CSV;
