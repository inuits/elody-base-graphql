export const allKeyboardLayouts: {
  [key: string]: { default: string[]; shift: string[] };
} = {
  // ─────────────────────────────────────────────────────────────────────────────
  // Cyrillic — standard Russian (ЙЦУКЕН)
  // ─────────────────────────────────────────────────────────────────────────────
  Cyrillic: {
    default: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
      "{tab} й ц у к е н г ш щ з х ъ \\",
      "{lock} ф ы в а п р о л д ж э {enter}",
      "{shift} я ч с м и т ь б ю . {shift}",
      ".com @ {space}",
    ],
    shift: [
      '~ ! " № ; % : ? * ( ) _ + {bksp}',
      "{tab} Й Ц У К Е Н Г Ш Щ З Х Ъ \\",
      "{lock} Ф Ы В А П Р О Л Д Ж Э {enter}",
      "{shift} Я Ч С М И Т Ь Б Ю , {shift}",
      ".com @ {space}",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Arabic — standard Arabic (RTL; rendered right-to-left by simple-keyboard)
  // ─────────────────────────────────────────────────────────────────────────────
  Arabic: {
    default: [
      "ذ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ ٠ - = {bksp}",
      "{tab} ض ص ث ق ف غ ع ه خ ح ج د \\",
      "{lock} ش س ي ب ل ا ت ن م ك ط {enter}",
      "{shift} ئ ء ؤ ر لا ى ة و ز ظ {shift}",
      ".com @ {space}",
    ],
    shift: [
      "ّ ! @ # $ % ^ & * ) ( _ + {bksp}",
      "{tab} َ ً ُ ٌ لإ إ ‘ ÷ × ؛ < > |",
      '{lock} ِ ٍ ] [ لأ أ ـ ، / : " {enter}',
      "{shift} ~ ْ } { لآ آ ’ , . ؟ {shift}",
      ".com @ {space}",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Hebrew — standard Israeli keyboard (RTL; shift layer is Latin for bilingual use)
  // ─────────────────────────────────────────────────────────────────────────────
  Hebrew: {
    default: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
      "{tab} / ' ק ר א ט ו ן ם פ [ ] \\",
      "{lock} ש ד ג כ ע י ח ל ך ף , {enter}",
      "{shift} ז ס ב ה נ מ צ ת ץ . {shift}",
      ".com @ {space}",
    ],
    // Shift layer: Latin characters (standard bilingual Israeli keyboard)
    shift: [
      "~ ! @ # $ % ^ & * ) ( _ + {bksp}",
      "{tab} Q W E R T Y U I O P { } |",
      '{lock} A S D F G H J K L : " {enter}',
      "{shift} Z X C V B N M < > ? {shift}",
      ".com @ {space}",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Japanese — hiragana (default) / katakana (shift)
  // Each button press inserts one kana character directly into the input field.
  // ─────────────────────────────────────────────────────────────────────────────
  Japanese: {
    default: [
      "1 2 3 4 5 6 7 8 9 0 ー {bksp}",
      "あ い う え お か き く け こ",
      "さ し す せ そ た ち つ て と {enter}",
      "な に ぬ ね の は ひ ふ へ ほ",
      "ま み む め も や ゆ よ ら り",
      "る れ ろ わ を ん っ {shift} {space}",
    ],
    // Shift: katakana equivalents
    shift: [
      "1 2 3 4 5 6 7 8 9 0 ー {bksp}",
      "ア イ ウ エ オ カ キ ク ケ コ",
      "サ シ ス セ ソ タ チ ツ テ ト {enter}",
      "ナ ニ ヌ ネ ノ ハ ヒ フ ヘ ホ",
      "マ ミ ム メ モ ヤ ユ ヨ ラ リ",
      "ル レ ロ ワ ヲ ン ッ {shift} {space}",
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Korean — standard 두벌식 (2-beol-sik) hangul jamo
  // The browser composes jamo into syllable blocks automatically when inserted
  // into a focused text input. Shift adds the 5 tense consonants (된소리).
  // ─────────────────────────────────────────────────────────────────────────────
  Korean: {
    // 2-beol-sik mapping: q=ㅂ w=ㅈ e=ㄷ r=ㄱ t=ㅅ y=ㅛ u=ㅕ i=ㅑ o=ㅐ p=ㅔ
    //                     a=ㅁ s=ㄴ d=ㅇ f=ㄹ g=ㅎ h=ㅗ j=ㅓ k=ㅏ l=ㅣ
    //                     z=ㅋ x=ㅌ c=ㅊ v=ㅍ b=ㅠ n=ㅜ m=ㅡ
    default: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
      "{tab} ㅂ ㅈ ㄷ ㄱ ㅅ ㅛ ㅕ ㅑ ㅐ ㅔ [ ] \\",
      "{lock} ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ {enter}",
      "{shift} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ , . {shift}",
      ".com @ {space}",
    ],
    // Shift: tense consonants on top row; rows 2–3 unchanged
    shift: [
      "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
      "{tab} ㅃ ㅉ ㄸ ㄲ ㅆ ㅛ ㅕ ㅑ ㅒ ㅖ { } |",
      "{lock} ㅁ ㄴ ㅇ ㄹ ㅎ ㅗ ㅓ ㅏ ㅣ {enter}",
      "{shift} ㅋ ㅌ ㅊ ㅍ ㅠ ㅜ ㅡ < > {shift}",
      ".com @ {space}",
    ],
  },
};

export type KeyboardLayouts = {
  [langCode: string]: { default: string[]; shift: string[] };
};


export const resolveKeyboardLayouts = (
  layoutNames?: string[]
): KeyboardLayouts | undefined => {
  if (!layoutNames?.length) return undefined;

  const resolvedLayouts: KeyboardLayouts = {};
  layoutNames.forEach((layoutName: string) => {
    if (!allKeyboardLayouts[layoutName]) {
      console.error(
        `Keyboard layout with key ${layoutName} not available, check if you are using the correct key or add a layout for '${layoutName}'`
      );
      return;
    }
    resolvedLayouts[layoutName] = allKeyboardLayouts[layoutName];
  });

  return Object.keys(resolvedLayouts).length ? resolvedLayouts : undefined;
};
