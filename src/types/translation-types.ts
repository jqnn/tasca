/* eslint-disable */

export type TranslationFunction = {
  <TargetKey extends string>(
    key: TargetKey,
    ...args: TranslateArgs<NestedValueOf<Record<string, any>, TargetKey>, never>
  ): string;
  rich<TargetKey extends string>(
    key: TargetKey,
    ...args: TranslateArgs<
      any /* Fülle hier den korrekten Typ ein */,
      any /* Fülle hier den korrekten Typ ein */
    >
  ): React.ReactNode;
};

// Angenommen, NestedValueOf und TranslateArgs sind wie folgt definiert (Platzhalter)
// Du musst diese Typen basierend auf deiner tatsächlichen Implementierung anpassen
type NestedValueOf<T, K extends string> = K extends keyof T
  ? T[K]
  : K extends `${infer Head}.${infer Tail}`
    ? Head extends keyof T
      ? NestedValueOf<T[Head], Tail>
      : never
    : never;

type TranslateArgs<Value, ArgTypes> = any[];
