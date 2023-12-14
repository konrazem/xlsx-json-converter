import XLSX from 'xlsx';
import fs from 'fs';

const SRC_PATH = './files/dialogs.xlsx';
const workbook = XLSX.readFile(SRC_PATH);

const sheet_name_list = workbook.SheetNames;

type MainSheet = {
  name: string;
  title_pl: string;
  title_en: string;
  desc_pl: string;
  desc_en: string;
  button_index: string;
};

type ButtonsSheet = {
  index: string;
  confirm_pl: string;
  confirm_en: string;
  cancel_pl: string;
  cancel_en: string;
};

type Dialog = {
  name: string;
  title: string;
  desc: string;
  buttons: { confirm: string; cancel: string };
};

type Result = Record<'pl' | 'en', Dialog[]>;

const dialogsSheetContent: MainSheet[] = XLSX.utils.sheet_to_json(
  workbook.Sheets[sheet_name_list[0]],
);

const buttonsSheetContent: ButtonsSheet[] = XLSX.utils.sheet_to_json(
  workbook.Sheets[sheet_name_list[1]],
);

const getPlContent = (): Dialog[] => {
  const res: Dialog[] = [];

  for (const dialog of dialogsSheetContent) {
    const button = buttonsSheetContent.find(
      (content) => content.index === dialog.button_index,
    );

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

const getEnContent = (): Dialog[] => {
  const res: Dialog[] = [];

  for (const dialog of dialogsSheetContent) {
    const button = buttonsSheetContent.find(
      (content) => content.index === dialog.button_index,
    );

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

const getFullContent = (): Result => {
  return { en: getEnContent(), pl: getPlContent() };
};

const content = getFullContent();

fs.writeFile('files/dialogs.json', JSON.stringify(content), 'utf-8', (err) => {
  if (err) {
    return;
  }

  console.log('Success!');
});
