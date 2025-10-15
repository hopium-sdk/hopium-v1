import { AvatarImage, type T_AvatarImage } from "./avatar";

export const EtfImage = ({ address, iconVariant, withBox, boxClassName, iconClassName }: T_AvatarImage) => {
  return <AvatarImage address={address} iconVariant={iconVariant ?? "coin"} withBox={withBox} boxClassName={boxClassName} iconClassName={iconClassName} />;
};
