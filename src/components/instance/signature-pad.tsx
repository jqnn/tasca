"use client";

import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "~/components/ui/button";
import { useTheme } from "next-themes";
import type { TranslationFunction } from "~/types/translation-types";

type PageProps = {
  action?: (value: string | undefined) => void;
  t: TranslationFunction
};

export default function SignaturePad({ action, t }: PageProps) {
  const theme = useTheme();
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const penColor = theme.systemTheme == "dark" ? "white" : "black";

  const clear = () => {
    sigCanvasRef.current?.clear();
  };

  const save = () => {
    if (!action) return;

    const dataUrl = sigCanvasRef.current
      ?.getTrimmedCanvas()
      .toDataURL("image/png");
    action(dataUrl);
  };

  return (
    <div className={"mt-8 flex w-full flex-col"}>
      <h1>{t("common.signature")}</h1>
      <SignatureCanvas
        ref={sigCanvasRef}
        penColor={penColor}
        canvasProps={{
          height: 400,
          className: "w-full border rounded-md",
        }}
      />
      <div className="mt-2 ml-auto space-x-2">
        <Button onClick={clear} variant={"destructive"}>
          {t("common.clear")}
        </Button>
        <Button onClick={save} variant={"default"}>
          {t("common.save")}
        </Button>
      </div>
    </div>
  );
}
