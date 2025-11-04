import ImageFallback from "components/common/imageFallback";
import { Fragment, useCallback } from "react";
import Slider from "react-slick";

const ProfileImagesViewSlider = (props) => {
  const imageDomain = process.env.REACT_APP_IMAGE_PATH;
  const { gender, photos, profile, arrows } = props;

  let slider = {
    fade: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
  };

  const nextIcon = useCallback(() => {
    slider.slickNext();
  }, [slider]);

  const prevIcon = useCallback(() => {
    slider.slickPrev();
  }, [slider]);
  {
    profile?.isPremium && <i className="fa fa-trophy"></i>;
  }

  return (
    <Fragment>
      {photos && photos.length > 1 && (
        <div className="">
          <Slider
            ref={(slide) => (slider = slide)}
            {...slider}
            defaultIndex={0}
            autoplay={false}
            arrows={arrows}
          >
            {photos.map((ele, ind) => {
              const imageSrc = imageDomain + ele.imagePath + ele.images.large;
              return <ImageFallback key={ind} src={imageSrc} gender={gender} />;
            })}
          </Slider>
          <div className="d-flex justify-content-end">
            {!arrows && (
              <button
                type="button"
                onClick={prevIcon}
                className="btn btn-outline-secondary btn-rounded btn-icon prev_btn"
              >
                <i className="mdi mdi-chevron-left text-danger"></i>
              </button>
            )}
            {!arrows && (
              <button
                type="button"
                onClick={nextIcon}
                className="btn btn-outline-secondary btn-rounded btn-icon mx-2 next_btn"
              >
                <i className="mdi mdi-chevron-right text-danger"></i>
              </button>
            )}
          </div>
        </div>
      )}

      {photos && photos.length === 1 && (
        <Fragment>
          <ImageFallback
            gender={gender}
            src={imageDomain + photos[0]?.imagePath + photos[0]?.images.large}
          />
          {profile?.isPremium && <i className="fa fa-trophy"></i>}
        </Fragment>
      )}
      {photos && photos.length === 0 && (
        <ImageFallback gender={gender} src={imageDomain} />
      )}
    </Fragment>
  );
};

export default ProfileImagesViewSlider;
