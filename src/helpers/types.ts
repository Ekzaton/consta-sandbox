export type Item = {
  id: number;
  label: string;
}

export type Preview = {
  id: string;
  url: string;
};

export type FieldsData = {
  city: Item[];
  color: Item;
  number: string;
  comment: string;
  date: Date,
  users: Item[];
  files: File[],
}

export type FieldsDataKey = keyof FieldsData;

export type FieldsDataValue = FieldsData[keyof FieldsData];
