"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const SRC_PATH = './files/dialogs.xlsx';
const workbook = xlsx_1.default.readFile(SRC_PATH);
const sheet_name_list = workbook.SheetNames;
const dialogsSheetContent = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
const buttonsSheetContent = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
const getPlContent = () => {
    const res = [];
    for (const dialog of dialogsSheetContent) {
        const button = buttonsSheetContent.find((content) => content.index === dialog.button_index);
        if (button) {
            res.push({
                name: dialog.name,
                title: dialog.title_pl,
                desc: dialog.desc_pl,
                buttons: { confirm: button.confirm_pl, cancel: button.cancel_pl },
            });
        }
    }
    return res;
};
const getEnContent = () => {
    const res = [];
    for (const dialog of dialogsSheetContent) {
        const button = buttonsSheetContent.find((content) => content.index === dialog.button_index);
        if (button) {
            res.push({
                name: dialog.name,
                title: dialog.title_en,
                desc: dialog.desc_en,
                buttons: { confirm: button.confirm_en, cancel: button.cancel_en },
            });
        }
    }
    return res;
};
const getFullContent = () => {
    return { en: getEnContent(), pl: getPlContent() };
};
const content = getFullContent();
fs_1.default.writeFile('files/dialogs.json', JSON.stringify(content), 'utf-8', (err) => {
    if (err) {
        return;
    }
    console.log('Success!');
});
