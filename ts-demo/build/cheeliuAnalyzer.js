"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var fs_1 = __importDefault(require("fs"));
var CheeliuAnalyzer = /** @class */ (function () {
    function CheeliuAnalyzer() {
    }
    CheeliuAnalyzer.getInstance = function () {
        if (!CheeliuAnalyzer.instance) {
            CheeliuAnalyzer.instance = new CheeliuAnalyzer();
        }
        return CheeliuAnalyzer.instance;
    };
    CheeliuAnalyzer.prototype.getJsonInfo = function (html) {
        var $ = cheerio_1.default.load(html);
        var jsoncontent = JSON.parse(html);
        var data = jsoncontent.subjects;
        var JsonInfo = [];
        data.map(function (item, index) {
            var title = item.title;
            var rate = parseFloat(item.rate);
            var id = parseFloat(item.id);
            JsonInfo.push({
                title: title, rate: rate, id: id
            });
        });
        return {
            time: (new Date()).getTime(),
            data: JsonInfo
        };
    };
    CheeliuAnalyzer.prototype.generateJsonContent = function (result, filePath) {
        var fileContent = {};
        if (fs_1.default.existsSync(filePath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        fileContent[result.time] = result.data;
        return JSON.stringify(fileContent);
    };
    CheeliuAnalyzer.prototype.anylyze = function (html, filePath) {
        var JsonInfo = this.getJsonInfo(html);
        return this.generateJsonContent(JsonInfo, filePath);
    };
    return CheeliuAnalyzer;
}());
exports.default = CheeliuAnalyzer;
