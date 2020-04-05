import cheerio from "cheerio";
import fs from "fs";
import {Analyzer} from "./utils/crowller";
interface MovieMsg {
    title: string,
    rate: number,
    id: number
}
interface JsonResult {
    time: number,
    data: MovieMsg[]

}

interface Content {
    [propName: number]: MovieMsg[]
}
export default class CheeliuAnalyzer implements Analyzer{
    private static instance:CheeliuAnalyzer;
    static getInstance(){
        if(!CheeliuAnalyzer.instance){
            CheeliuAnalyzer.instance=new CheeliuAnalyzer();
        }
        return CheeliuAnalyzer.instance
    }
    private getJsonInfo(html: string) {
        const $ = cheerio.load(html);
        const jsoncontent = JSON.parse(html);
        let data = jsoncontent.subjects;
        const JsonInfo: MovieMsg[] = [];
        data.map((item: any, index: number) => {
            const title = item.title;
            const rate: number = parseFloat(item.rate);
            const id: number = parseFloat(item.id);
            JsonInfo.push({
                title, rate, id
            })
        });
        return {
            time: (new Date()).getTime(),
            data: JsonInfo
        };

    }
    private generateJsonContent(result: JsonResult,filePath:string) {
        let fileContent: Content = {};
        if (fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        fileContent[result.time] = result.data;
        return JSON.stringify(fileContent);



    }
    public anylyze(html:string,filePath:string){
        const JsonInfo=this.getJsonInfo(html);
        return this.generateJsonContent(JsonInfo,filePath);
    }
    private constructor() {

    }
}
