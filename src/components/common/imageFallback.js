import { useEffect, useState } from "react";
import MaleImage from "../../assets/images/male.jpg";
import FemaleImage from "../../assets/images/female.jpg";

export default function ImageFallback({ src, gender, className, fallbackSrc, makeDefault, alt, ...rest}) {
    const isMaleImage = gender === 10;
    const imageSrc = isMaleImage ? MaleImage : FemaleImage;
    const [imgSrc, set_imgSrc] = useState(src);

    useEffect(() => {
        set_imgSrc(src);
    }, [src]);

    return (
        <img
            {...rest}
            src={imgSrc}
            // makeDefault={true}
            onLoadingComplete={(result) => {
                if (result.naturalWidth === 0) {
                    const loadImageSrc = fallbackSrc !== undefined ? fallbackSrc : imageSrc;
                    set_imgSrc(loadImageSrc);
                }
            }}
            onError={() => {
                const loadImageSrc = fallbackSrc !== undefined ? fallbackSrc : imageSrc;
                set_imgSrc(loadImageSrc);
            }}
            // className="w-100 h-100"
            className={className}
            alt={alt}
        />
    );
}