import { IOptions } from 'glob';
import { Stats } from 'fs';
export type CrawledFileType = {
    type: 'file' | 'directory' | 'link';
    stat: Stats;
    transformed?: {
        path: string;
        stat: Stats;
    };
};
export declare function determineFileType(filename: string): Promise<CrawledFileType | null>;
export declare function crawl(dir: string, options: IOptions): Promise<readonly [string[], Record<string, CrawledFileType>]>;
