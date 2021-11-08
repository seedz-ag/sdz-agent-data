import * as csv from "fast-csv";
import * as fs from "fs";
import { CsvOptionsInterface } from "sdz-agent-types";

class CSV {
  private legacy: boolean;
  constructor(config: boolean) {
    this.legacy = config;
  }
  /**
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
            ...options,
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
    let format = {};
    if (this.legacy === true) {
      format = {
        delimiter: ";",
        escape: '"',
        headers: isAppend ? false : Object.keys(data[0]),
        writeHeaders: true,
      };
    } else {
      format = {
        delimiter: ",",
        escape: '"',
        headers: isAppend ? false : Object.keys(data[0]),
        quoteColumns: true,
        quoteHeaders: true,
        writeHeaders: true,
      };
    }
    return new Promise((resolve): void => {
      const buffer = fs.createWriteStream(path, { flags: "a" });

      if (isAppend) {
        buffer.write("\r\n");
      }

      buffer.on("finish", resolve);

      const stream = csv.format(format);

      stream.pipe(buffer);

      for (const entity of data) {
        stream.write(entity);
      }

      stream.end();
    });
  }
}

export default CSV;
