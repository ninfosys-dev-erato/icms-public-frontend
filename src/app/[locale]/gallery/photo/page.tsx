import React from "react";
import {PhotoPage} from "../../../../domains/media/components/PhotoPage";
import { useLocale } from "next-intl";

const PhotoRoutePage = () => {
  const locale = useLocale() as "en" | "ne";
  return <PhotoPage locale={locale} />;
};

export default PhotoRoutePage;
