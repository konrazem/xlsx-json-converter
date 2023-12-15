"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const SRC_PATH = "./files/dialogs.xlsx";
const workbook = xlsx_1.default.readFile(SRC_PATH);
const sheet_name_list = workbook.SheetNames;
const dialogsSheetContent = xlsx_1.default.utils.sheet_to_json(
  workbook.Sheets[sheet_name_list[0]]
);
const buttonsSheetContent = xlsx_1.default.utils.sheet_to_json(
  workbook.Sheets[sheet_name_list[1]]
);

const getDialogsNames = () => dialogsSheetContent.map((dialog) => dialog.name);

const getDialogProps = (dialogName) => {
  const dialog = dialogsSheetContent.find(
    (dialog) => dialog.name === dialogName
  );

  const button = buttonsSheetContent.find(
    (content) => content.index === dialog.button_index
  );

  return button
    ? {
        pl: {
          title: dialog.title_pl,
          desc: dialog.desc_pl,
          buttons: {
            confirm: button.confirm_pl,
            cancel: button.cancel_pl,
          },
        },
        en: {
          title: dialog.title_en,
          desc: dialog.desc_en,
          buttons: {
            confirm: button.confirm_en,
            cancel: button.cancel_en,
          },
        },
      }
    : undefined;
};

const getFullContent = () => {
  const dialogsNames = getDialogsNames();
  let res = {};

  for (const name of dialogsNames) {
    res = { ...res, [name]: getDialogProps(name) };
  }
  return res;
};

const content = getFullContent();
fs_1.default.writeFile(
  "files/dialogs.json",
  JSON.stringify(content),
  "utf-8",
  (err) => {
    if (err) {
      return;
    }
    console.log("Success!");
  }
);
