//FRAGMENT ******************** TYPING *********************************
type TypingSettingsSubtypeMoney = {
  symbol_less?: "<=" | "<";
  symbol_greater?: ">=" | ">";
  value_less?: number;
  value_greater?: number;
};

//FRAGMENT ******************** FUNCTIONS *******************************
export const makeMoneyFormatter = (fractionDigits: number) => {
  return Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  });
};
export const formatMoney = makeMoneyFormatter(2);

export const subtypeMoney = (
  value_: string,
  setting_: TypingSettingsSubtypeMoney
): [string, number, string, string] => {
  const msg_invalid = "";
  let msg_validity = "";
  const value = (value_.match(/\d/g) ?? []).join("");
  const value_return = value !== "" ? parseInt(value) : 0;
  const value_see =
    value_return !== 0 ? formatMoney.format(value_return) : "$ ";

  if (setting_?.value_less) {
    const symbol_less_: "<=" | "<" = setting_?.symbol_less
      ? setting_?.symbol_less
      : "<=";
    if (symbol_less_ === "<=") {
      if (value_return < setting_?.value_less) {
        msg_validity = `El valor debe ser mayor o igual
        a ${formatMoney.format(setting_?.value_less)}`;
      }
    } else if (symbol_less_ === "<") {
      if (value_return <= setting_?.value_less) {
        msg_validity = `El valor debe ser mayor
        a ${formatMoney.format(setting_?.value_less)}`;
      }
    }
  }
  if (setting_?.value_greater) {
    const symbol_greater_: ">=" | ">" = setting_?.symbol_greater
      ? setting_?.symbol_greater
      : ">=";
    if (symbol_greater_ === ">=") {
      if (value_return > setting_?.value_greater) {
        msg_validity = `El valor debe ser menor o igual
          a ${formatMoney.format(setting_?.value_greater)}`;
      }
    } else if (symbol_greater_ === ">") {
      if (value_return >= setting_?.value_greater) {
        msg_validity = `El valor debe ser menor
          a ${formatMoney.format(setting_?.value_greater)}`;
      }
    }
  }

  return [value_see, value_return, msg_invalid, msg_validity];
};
