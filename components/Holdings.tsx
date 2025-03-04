import Image from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useContext, useEffect } from "react";
import { isFirefox } from "react-device-detect";

import { ModalContext } from "@/lib/context";
import { getUSFormattedNumber } from "@/utils";

type Props = {
  glo: number;
  setGlo: React.Dispatch<React.SetStateAction<number>>;
  yearlyYield: number;
};

export default function Holdings({ glo, setGlo, yearlyYield }: Props) {
  const { closeModal } = useContext(ModalContext);

  const gloOnInputChange = (e: { target: { value: any } }) => {
    let newGloQuantity = e.target.value;

    if (newGloQuantity) {
      newGloQuantity = newGloQuantity.replaceAll(",", "");
      newGloQuantity = parseInt(newGloQuantity);
    }
    if (!newGloQuantity) {
      newGloQuantity = 0;
    }
    setGlo(newGloQuantity);
  };

  const gloOnSliderChange = (newGloQuantity: number | number[]) => {
    if (typeof newGloQuantity == "number") {
      setGlo(newGloQuantity);
    }
  };

  const formattedGlo = getUSFormattedNumber(glo);
  const formattedYearlyYield = getUSFormattedNumber(yearlyYield);

  const getTextWidth: any = (el: HTMLInputElement): number => {
    // TODO: fix function type signature
    // Refer: https://stackoverflow.com/a/50360743/1851428

    // uses a cached canvas if available
    const canvas: HTMLCanvasElement =
      getTextWidth.canvas ||
      (getTextWidth.canvas = document.createElement("canvas"));
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");

    // get the full font style property
    // getting them all separately because the shorthand for getPropertyValue is unstable
    const computedStyles = window.getComputedStyle(el, null);
    const fontFamily = computedStyles.getPropertyValue("font-family");
    const fontSize = computedStyles.getPropertyValue("font-size");
    const fontWeight = computedStyles.getPropertyValue("font-weight");
    const text = el.value;

    // set the font attr for the canvas text
    if (context) {
      context.font = `${fontWeight} ${fontSize} ${fontFamily}`;
      const textMeasurement = context.measureText(text);
      return textMeasurement.width;
    }
    console.error("Unable to calculate input width");
    // Fallback value enough for 4 digits
    return 116;
  };

  useEffect(() => {
    const gloInput = document.getElementById("gloInput");
    if (gloInput) {
      let width = Math.floor(getTextWidth(gloInput as HTMLInputElement));
      if (isFirefox) {
        width += 16; // 1em offset
      }
      gloInput.style.width = width + 4 + "px";
    }
  }, [formattedGlo, getTextWidth]);

  return (
    <>
      <div className="flex flex-col space-y-2 px-4 pt-4">
        <div className="flex flex-row justify-between">
          <div>Buy</div>
          <button className="right-0" onClick={() => closeModal()}>
            <Image alt="x" src="/x.svg" height={16} width={16} />
          </button>
        </div>
        <div className="flex flex-row font-semibold justify-between">
          <div className="flex flex-row text-[2.625rem] items-baseline">
            <div>$</div>
            <input
              id="gloInput"
              className="impact-input"
              value={formattedGlo}
              type="text"
              inputMode="numeric"
              onChange={gloOnInputChange}
            />
            <div className="text-base ml-1">Glo Dollars</div>
          </div>
          <div
            className="bg-pine-900/[0.1] min-h-fit min-w-fit px-2.5 py-2.5 rounded-full self-center cursor-pointer"
            onClick={() => document.getElementById("gloInput")?.focus()}
          >
            <Image width={14} height={14} src="/edit.svg" alt="edit-icon" />
          </div>
        </div>
        <div className="py-4 px-2">
          <Slider
            min={0}
            max={20000}
            step={100}
            onChange={gloOnSliderChange}
            defaultValue={1000}
            value={glo}
            railStyle={{
              backgroundColor: "#EAF2F1",
            }}
            trackStyle={{
              backgroundColor: "#133d38",
            }}
            handleStyle={{
              height: "28px",
              width: "28px",
              backgroundColor: "white",
              borderColor: "#133d38",
              border: "8px solid",
              opacity: 1,
              marginTop: "-13px",
            }}
          />
        </div>
      </div>
      <div className="flex flex-col bg-cyan-600 mb-1 px-6 py-6 pt-0">
        <div className="overflow-hidden inline-block">
          <div className="h-2.5 w-2.5 bg-white -rotate-45 transform origin-top-left translate-x-36"></div>
        </div>
        <div className="flex flex-col pt-2 space-y-2">
          <div className="font-normal text-base">
            To generate charitable donations up to
          </div>
          <div className="flex flex-row space-x-1 font-semibold items-baseline">
            <div
              data-testid="basic-income-created"
              className="text-[2.625rem] leading-[2.625rem] break-all font-neuehaasgrotesk"
            >
              {yearlyYield === 0 ? "$0" : `$${formattedYearlyYield}`}
            </div>
            <div className="text-base">/ year</div>
          </div>
          <div className="text-xs text-[11px] pt-2">
            Current impact on the lower end of this range because Glo Dollar{" "}
            <a
              className="underline"
              href="https://www.glodollar.org/articles/from-bootstrap-to-high-impact"
              target="_blank"
              rel="noreferrer"
            >
              is bootstrapping
            </a>
            . Adoption helps grow impact.
          </div>
        </div>
      </div>
    </>
  );
}
