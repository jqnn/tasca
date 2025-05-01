"use client";

import React, { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "~/components/ui/button";
import { useTheme } from "next-themes";
import type { TranslationFunction } from "~/types/translation-types";

type PageProps = {
  defaultValue?: string | null;
  action?: (value: string | undefined) => void;
  t: TranslationFunction;
  disabled: boolean;
};

export default function SignaturePad({
  defaultValue,
  action,
  t,
  disabled,
}: PageProps) {
  const theme = useTheme();
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const penColor = theme.systemTheme == "dark" ? "white" : "black";

  useEffect(() => {
    if (defaultValue && sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      sigCanvasRef.current.fromDataURL(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (!disabled) return;
    if (!sigCanvasRef.current) return;
    const canvas = sigCanvasRef.current.getCanvas();
    canvas.style.pointerEvents = "none";
  }, [disabled]);

  const clear = () => {
    sigCanvasRef.current?.clear();
  };

  const save = () => {
    if (!action) return;

    const dataUrl = sigCanvasRef.current?.getCanvas().toDataURL("image/png");
    action(dataUrl);
  };

  return (
    <div className={"mt-8 flex w-full flex-col"}>
      <h1 className={"font-semibold"}>{t("signature.text")}</h1>
      <SignatureCanvas
        ref={sigCanvasRef}
        penColor={penColor}
        canvasProps={{
          height: 400,
          className: "w-full border rounded-md",
        }}
      />
      {!disabled && (
        <div className="mt-2 ml-auto space-x-2">
          <Button onClick={clear} variant={"destructive"}>
            {t("signature.clear")}
          </Button>
          <Button onClick={save} variant={"default"}>
            {t("common.save")}
          </Button>
        </div>
      )}
    </div>
  );
}
