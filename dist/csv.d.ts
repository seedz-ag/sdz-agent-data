import { CsvOptionsInterface } from "sdz-agent-types";
declare class CSV {
    private fileNameCache;
    private fileSize;
    private legacy;
    private pad;
    constructor(config: boolean, fileSize?: number, pad?: string);
    /**
     * Generate a file name based at actual count.
     *
     * @param {string} path
     * @return {string}
     */
    private generateName;
    /**
     * Search for a file with available size.
     *
     * @param {string} path
     * @returns {string}
     */
    private getFile;
    /**
     * Build CsvFormatterOptions.
     *
     * @return {CsvFormatterOptions}
     */
    private getFormat;
    /**
     * Read a CSV file.
     *
     * @param {string} path
     * @param {CsvOptionsInterface} options
     * @returns {Promise<any>}
     */
    read(path: string, options: CsvOptionsInterface): Promise<unknown>;
    /**
     * Write a file.
     *
     * @param {string} path
     * @param {array} data
     * @returns {Promise<void>}
     */
    write(path: string, data: any[]): Promise<unknown>;
}
export default CSV;
