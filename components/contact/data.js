// ===================== ثوابت + منطق الفورم الخالص =====================
// كل حاجة هنا pure functions / plain data، من غير أي علاقة بالرندر —
// نفس فكرة data.js في Projects (PROJECTS + buildSlides).

import { tr } from "./utils";

export const PATH_D =
  "M50,0 C50,90 15,150 15,255 C15,360 85,395 85,555 C85,715 18,750 18,855 C18,930 50,960 50,1000";

export const FIELD_KEYS = ["name", "contact", "message"];
export const MAX_TERMINAL_LINES = 5;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateField(t, key, rawVal) {
  const val = (rawVal ?? "").trim();
  if (key === "name") {
    if (!val) return tr(t, "contact.errors.nameRequired", "> name: required");
    if (val.length < 2)
      return tr(
        t,
        "contact.errors.nameTooShort",
        "> name: too short (min 2 chars)",
      );
    return undefined;
  }
  if (key === "contact") {
    if (!val)
      return tr(t, "contact.errors.contactRequired", "> contact: required");
    const digitsOnly = val.replace(/[\s\-()]/g, "");
    const isEmail = EMAIL_RE.test(val);
    const isPhone = /^\+?\d{7,15}$/.test(digitsOnly);
    if (!isEmail && !isPhone)
      return tr(
        t,
        "contact.errors.contactInvalid",
        "> contact: invalid format",
      );
    return undefined;
  }
  if (key === "message") {
    if (!val)
      return tr(t, "contact.errors.messageRequired", "> message: required");
    if (val.length < 10)
      return tr(
        t,
        "contact.errors.messageTooShort",
        "> message: too short (min 10 chars)",
      );
    return undefined;
  }
  return undefined;
}

export const initialFormState = {
  values: { name: "", contact: "", message: "" },
  errors: {},
  touched: {},
  status: "idle", // idle | sending | sent
  log: [],
  shakeKeys: {}, // {fieldKey: true} — لحظي، بيتشال بعد الأنيميشن
};

export function formReducer(state, action) {
  switch (action.type) {
    case "CHANGE": {
      const nextValues = { ...state.values, [action.key]: action.value };
      // من غير ما نعيد الفاليديشن الكاملة وإحنا بنكتب — لو الحقل
      // كان فيه خطأ قبل كده بس، نحدّثه (يمسح لو بقى سليم)
      if (!state.errors[action.key]) return { ...state, values: nextValues };
      return {
        ...state,
        values: nextValues,
        errors: { ...state.errors, [action.key]: action.error },
      };
    }
    case "BLUR":
      return {
        ...state,
        touched: { ...state.touched, [action.key]: true },
        errors: { ...state.errors, [action.key]: action.error },
      };
    case "SUBMIT_INVALID":
      return {
        ...state,
        errors: action.errors,
        touched: { name: true, contact: true, message: true },
        shakeKeys: action.shakeKeys,
      };
    case "CLEAR_SHAKE": {
      if (!state.shakeKeys[action.key]) return state;
      const nextShake = { ...state.shakeKeys };
      delete nextShake[action.key];
      return { ...state, shakeKeys: nextShake };
    }
    case "START_SENDING":
      return { ...state, status: "sending", log: [] };
    case "APPEND_LOG":
      return { ...state, log: [...state.log, action.line] };
    case "SET_SENT":
      return { ...state, status: "sent" };
    case "SEND_FAILED":
      // فشل السيرفر (باك رفض الفاليديشن، أو مشكلة نتورك). بنرجّع
      // الحالة لـ idle عشان الزرار يرجع قابل للضغط تاني، وبنعرض
      // الخطأ في نفس لوحة التشخيص (sig-terminal) اللي بتعرض
      // أخطاء الفاليديشن العادية — نفس مكان واحد للمستخدم يبص عليه.
      return {
        ...state,
        status: "idle",
        log: [],
        errors: { ...state.errors, ...action.errors },
        touched: {
          ...state.touched,
          ...Object.fromEntries(
            Object.keys(action.errors).map((k) => [k, true]),
          ),
        },
        shakeKeys: action.shakeKeys,
      };
    default:
      return state;
  }
}
