import {addMonths, format, eachDayOfInterval, endOfMonth} from "date-fns";
import {useEffect, useRef, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {Button} from "@consta/uikit/Button";
import {Card} from "@consta/uikit/Card";
import {Combobox, ComboboxProps, DefaultGroup as ComboboxDefaultGroup} from "@consta/uikit/Combobox";
import {DatePicker, DatePickerProps} from "@consta/uikit/DatePickerCanary";
import {DateTime} from "@consta/uikit/DateTimeCanary";
import {IconCalendar} from "@consta/uikit/IconCalendar";
import {Popover} from "@consta/uikit/Popover";
import {Select, SelectProps, DefaultGroup as SelectDefaultGroup} from "@consta/uikit/Select";
import {TextField, TextFieldProps} from "@consta/uikit/TextField";
import {UserSelect, UserSelectProps, DefaultGroup as UserSelectDefaultGroup} from "@consta/uikit/UserSelect";

import {cities, colors, users} from "../../helpers/data";
import {FieldsData, FieldsDataKey, FieldsDataValue, Item} from "../../helpers/types";
import withToggle from "../../hoc/withToggle";
import withValidation from "../../hoc/withValidation";

import Files from "./components/Files/Files";
import styles from './Form.module.css';


const ComboboxWithValidation = withValidation<ComboboxProps<Item, ComboboxDefaultGroup, true>, FieldsData>(Combobox);
const DatePickerWithValidation = withValidation<DatePickerProps, FieldsData>(DatePicker);
const SelectWithValidation = withValidation<SelectProps<Item, SelectDefaultGroup>, FieldsData>(Select);
const TextFieldWithValidation = withValidation<TextFieldProps<string>, FieldsData>(TextField);
const TextFieldWithValidationAndToggle = withToggle(TextFieldWithValidation);
const UserSelectWithValidation = withValidation<UserSelectProps<Item, UserSelectDefaultGroup, true>, FieldsData>(UserSelect);

export default function Form() {
  const form = useForm<FieldsData>({
    mode: "onTouched",
    reValidateMode: "onSubmit",
  });
  const {setValue, handleSubmit, formState, reset, clearErrors, watch} = form;
  const {isSubmitSuccessful} = formState;

  const [days, setDays] = useState<Date[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);


  const fieldChangeHandler = (key: FieldsDataKey, value: FieldsDataValue) => {
    setValue(key, value);
    clearErrors([key]);
  }

  const formSubmitHandler = (data: FieldsData) => console.log(data);

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful]);

  console.log(watch("date"));
  console.log(days);

  return (
      <FormProvider {...form} >
        <Card className={styles.formWrap}>
          <form className={styles.form} onSubmit={handleSubmit(formSubmitHandler)} noValidate>
            <ComboboxWithValidation
                className={styles.formItem}
                size="l"
                label="Город"
                placeholder="Не менее 3 городов"
                multiple
                items={cities}
                onChange={({value}) => fieldChangeHandler("city", value)}
                fieldName="city"
                required
                requiredMessage="Выберите города"
                validation={(value: Item[]) => value.length >= 3 || "Не менее 3 городов"}
            />
            <SelectWithValidation
                className={styles.formItem}
                size="l"
                label="Цвет"
                items={colors}
                onChange={({value}) => fieldChangeHandler("color", value)}
                fieldName="color"
                required
                requiredMessage="Выберите цвет"
            />
            <TextFieldWithValidationAndToggle
                className={styles.formItem}
                type="number"
                size="l"
                label="Номер"
                width="full"
                onChange={({value}) => fieldChangeHandler("number", value)}
                fieldName="number"
                required
                requiredMessage="Укажите номер"
                validation={(value: string) => +value > 0 || "Только положительное число"}
                checkboxLabel="Есть номер?"
                checkboxClassName={styles.formItem}
            />
            <TextFieldWithValidation
                className={styles.formItem}
                type="textarea"
                size="l"
                label="Комментарий"
                placeholder="От 30 до 100 сиволов"
                width="full"
                onChange={({value}) => fieldChangeHandler("comment", value)}
                fieldName="comment"
                required
                requiredMessage="Укажите комментарий"
                validation={(value: string) => (value.length >= 30 && value.length <= 100) || "Не менее 30 и не более 100 символов"}
            />
            <TextField
                inputContainerRef={ref}
                className={styles.formItem}
                size="l"
                label="Дата"
                placeholder="ДД.ММ.ГГГГ"
                value={watch("date") ? format(watch("date"), 'dd.MM.yyyy') : ''}
                onChange={({value}) => fieldChangeHandler("date", value)}
                rightSide={() => <IconCalendar size="m" view="ghost" style={{cursor: 'pointer'}}/>}
                onFocus={() => {
                  setIsOpen(true)
                }}
            />
            {isOpen && (
                <Popover
                    anchorRef={ref}
                    className={styles.popover}
                    direction="downCenter"
                >
                  <DateTime
                      className={styles.popoverCalendar}
                      events={days}
                      onChange={({value}) => {
                        fieldChangeHandler("date", value);
                        setIsOpen(false);
                      }}
                      onChangeCurrentVisibleDate={(date) => {
                        const from = (format(date, 'yyyy-MM-dd'));
                        console.log(from);
                        const to = (format(addMonths(date, 1), 'yyyy-MM-dd'));
                        console.log(to);
                        const allDays = eachDayOfInterval({start: date, end: endOfMonth(date)});
                        const resolvedDays = allDays.filter((day) => Date.parse(day.toDateString()) >= Date.parse(new Date().toDateString()));
                        setDays(resolvedDays);
                      }}
                  />
                </Popover>
            )}
            <DatePickerWithValidation
                className={styles.formItem}
                size="l"
                label="Дата"
                placeholder="ДД.ММ.ГГГГ"
                format="dd.MM.yyyy"
                rightSide={() => <IconCalendar size="m" view="ghost" style={{cursor: 'pointer'}}/>}
                onChange={({value}) => fieldChangeHandler("date", value)}
                onChangeCurrentVisibleDate={(date) => {
                  console.log(format(date, 'yyyy-MM-dd'));
                  console.log(format(addMonths(date, 1), 'yyyy-MM-dd'));
                }}
                fieldName="date"
                required
                requiredMessage="Выберите дату"
                validation={(value: Date) => (Date.parse(value.toDateString()) >= Date.parse(new Date().toDateString())) || "Выберите дату не меньше текущей"}
            />
            <UserSelectWithValidation
                className={styles.formItem}
                size="l"
                label="Пользователи"
                multiple
                items={users}
                onChange={({value}) => fieldChangeHandler("users", value)}
                fieldName="users"
                required
                requiredMessage="Выберите пользователей"
                validation={(value: Item[]) => value.length >= 3 || "Не менее 3 пользователей"}
            />
            <Files
                className={styles.formItem}
                id="files"
                fieldName="files"
                required
                requiredMessage="Необходимо загрузить изображения"
                validation={(value: File[]) => (value.length >= 5 && value.length <= 10) || "Не менее 5 и не более 10 изображений"}
            />
            <Button className={styles.submit} width="full" type="submit" label="Отправить"/>
          </form>
        </Card>
      </FormProvider>
  );
}

