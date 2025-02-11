import Image from "next/image";

export const PunksLogo = ({ className }: { className: string }) => {
  return (
    <>
      <Image
        src={"/hack2.png"}
        alt="logo"
        className={className}
        width={200}
        height={200}
      />
    </>
  );
};
