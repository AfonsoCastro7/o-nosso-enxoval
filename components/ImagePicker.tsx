"use client";
import { Camera, ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import { ConfirmDialog } from "@/components/ConfirmDialog";

async function compress(file: File): Promise<string> {
  const source = await createImageBitmap(file);
  const scale = Math.min(1, 1000 / Math.max(source.width, source.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(source.width * scale);
  canvas.height = Math.round(source.height * scale);
  canvas.getContext("2d")?.drawImage(source, 0, 0, canvas.width, canvas.height);
  source.close();
  return canvas.toDataURL("image/webp", 0.76);
}
export function ImagePicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value?: string) => void;
}) {
  const gallery = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const pick = async (file?: File) => {
    if (file) onChange(await compress(file));
  };
  return (
    <div>
      <span className="label">Foto</span>
      {value ? (
        <div className="relative h-48 overflow-hidden rounded-3xl bg-slate-100">
          <Image
            src={value}
            alt="Pré-visualização"
            fill
            unoptimized
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => setRemoveDialogOpen(true)}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow"
            aria-label="Remover foto"
          >
            <X size={19} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="image-option"
            onClick={() => gallery.current?.click()}
          >
            <ImagePlus />
            Galeria
          </button>
          <button
            type="button"
            className="image-option"
            onClick={() => camera.current?.click()}
          >
            <Camera />
            Câmara
          </button>
        </div>
      )}
      <input
        ref={gallery}
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => void pick(e.target.files?.[0])}
      />
      <input
        ref={camera}
        hidden
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => void pick(e.target.files?.[0])}
      />
      <ConfirmDialog
        open={removeDialogOpen}
        title="Remover fotografia?"
        description="A fotografia deixará de estar associada ao produto quando guardares as alterações."
        confirmLabel="Remover"
        destructive
        onCancel={() => setRemoveDialogOpen(false)}
        onConfirm={() => {
          onChange(undefined);
          setRemoveDialogOpen(false);
        }}
      />
    </div>
  );
}
