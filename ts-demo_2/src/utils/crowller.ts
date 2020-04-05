//ts直接引用js会出问题
//ts --> .d.ts 翻译文件 --> js
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import CheeliuAnalyzer from "../cheeliuAnalyzer";

interface Analyzer {
    anylyze: (html: string, filePath: string) => string
}


class Crowller {
    private secret = '';
    private filePath = path.resolve(__dirname, "../../data/data.json");

    private async getRawHtml() {
        const result = await superagent.get(this.url);
        return result.text;
    }

    private writeFile(content: string) {
        fs.writeFileSync(this.filePath, content);
    }
    private async initSpiderProcess() {
        const html = await this.getRawHtml();
        const result = this.analyzer.anylyze(html, this.filePath);
        this.writeFile(result);
    }
    constructor(private url: string, private analyzer: Analyzer) {
        this.initSpiderProcess();
    }
}
export default Crowller;
const url = 'https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&page_limit=50&page_start=0';
const analyzer = CheeliuAnalyzer.getInstance();
new Crowller(url, analyzer);
console.log(1111);
export {
    Analyzer
}
