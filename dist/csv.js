"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv = __importStar(require("fast-csv"));
const fs = __importStar(require("fs"));
class CSV {
    constructor(config, fileSize, pad = "000") {
        this.fileNameCache = {};
        this.legacy = config;
        this.fileSize = fileSize;
        this.pad = pad;
    }
    /**
     * Generate a file name based at actual count.
     *
     * @param {string} path
     * @return {string}
     */
    generateName(path) {
        if (!this.fileNameCache[path]) {
            this.fileNameCache[path] = 0;
        }
        const file = path.split(/\.(?=[^\.]+$)/);
        const pad = `${this.pad}${this.fileNameCache[path]}`.slice(-this.pad.length);
        return [file[0], pad, file[1]].join(".");
    }
    /**
     * Search for a file with available size.
     *
     * @param {string} path
     * @returns {string}
     */
    getFile(path) {
        if (!this.fileSize) {
            return path;
        }
        while (true) {
            const name = this.generateName(path);
            if (!fs.existsSync(name)) {
                return name;
            }
            const size = fs.statSync(name).size / (1024 * 1024);
            if (size < this.fileSize) {
                return name;
            }
            else {
                this.fileNameCache[path]++;
            }
        }
    }
    /**
     * Build CsvFormatterOptions.
     *
     * @return {CsvFormatterOptions}
     */
    getFormat() {
        return {
            ...(this.legacy
                ? {
                    delimiter: ";",
                    writeHeaders: true,
                }
                : {
                    delimiter: ",",
                    quoteColumns: true,
                    quoteHeaders: true,
                }),
            escape: '"',
            writeHeaders: true,
        };
    }
    /**
     * Read a CSV file.
     *
     * @param {string} path
     * @param {CsvOptionsInterface} options
     * @returns {Promise<any>}
     */
    read(path, options) {
        return new Promise((resolve) => {
            let result = [];
            fs.createReadStream(path)
                .on("error", (error) => {
                console.error(error);
            })
                .pipe(csv.parse({
                headers: true,
                ...options,
            }))
                .on("data", (row) => result.push(row))
                .on("end", () => resolve(result));
        });
    }
    /**
     * Write a file.
     *
     * @param {string} path
     * @param {array} data
     * @returns {Promise<void>}
     */
    async write(path, data) {
        const file = this.getFile(path);
        const isAppend = fs.existsSync(file);
        !isAppend && fs.writeFileSync(file, "");
        return new Promise((resolve) => {
            const buffer = fs.createWriteStream(file, { flags: "a" });
            if (isAppend) {
                buffer.write("\r\n");
            }
            buffer.on("finish", resolve);
            const stream = csv.format({
                ...this.getFormat(),
                headers: isAppend ? false : Object.keys(data[0]),
            });
            stream.pipe(buffer);
            for (const entity of data) {
                stream.write(entity);
            }
            stream.end();
        });
    }
}
exports.default = CSV;
