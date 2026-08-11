import { ImageResponse } from "next/og";
import { PwaIcon } from "@/lib/PwaIcon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<PwaIcon size={size.width} />, size);
}
