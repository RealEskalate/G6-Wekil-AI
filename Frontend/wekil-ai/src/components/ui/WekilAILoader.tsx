import Image from "next/image";

export default function WeKilAILoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Image
        src="/loader.gif"
        alt="Loading..."
        width={200}
        height={200}
        className="object-contain"
        unoptimized
      />
    </div>
  );
}
