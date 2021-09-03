import { CsvOptionsInterface } from "sdz-agent-types";
declare class CSV {
    /**
     *
     * @param {string} path
     * @param {CsvOptionsInterface} options
     * @returns {Promise<any>}
     */
    read(path: string, options: CsvOptionsInterface): Promise<unknown>;
    /**
     *
     * @param {string} path
     * @param {array} data
     * @returns {Promise<void>}
     */
    write(path: string, data: any[]): Promise<unknown>;
}
export default CSV;
