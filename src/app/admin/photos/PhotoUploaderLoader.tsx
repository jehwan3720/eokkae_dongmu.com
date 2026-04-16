"use client";

import dynamic from "next/dynamic";

const PhotoUploader = dynamic(() => import("./PhotoUploader"), { ssr: false });

export default function PhotoUploaderLoader() {
  return <PhotoUploader />;
}
