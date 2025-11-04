import ImageFallback from "components/common/imageFallback";
import { Fragment, useCallback } from "react";
import Slider from "react-slick";

const ProfileImagesSlider = (props) => {
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
        <div className="profile_photos_wrapper image_upload_profile_wrapper">
          {!arrows && (
            <button
              type="button"
              onClick={prevIcon}
              className="btn btn-outline-secondary btn-rounded btn-icon prev_btn"
            >
              <i className="mdi mdi-chevron-left text-danger"></i>
            </button>
          )}
          <Slider
            ref={(slide) => (slider = slide)}
            {...slider}
            defaultIndex={0}
            autoplay={false}
            arrows={arrows}
          >
            {photos.map((ele, ind) => {
              const imageSrc = imageDomain + ele.imagePath + ele.images.large;
              return <ImageFallback key={ind} src={imageSrc} />;
            })}
          </Slider>
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
      )}

      {photos && photos.length === 1 && (
        <div className="profile_photos_wrapper">
          <ImageFallback
            gender={gender}
            src={imageDomain + photos[0]?.imagePath + photos[0]?.images.large}
          />
          {profile?.isPremium && <i className="fa fa-trophy"></i>}
        </div>
      )}
      {photos && photos.length === 0 && (
        <div className="profile_photos_wrapper">
          <ImageFallback gender={gender} src={imageDomain} />
        </div>
      )}
    </Fragment>
  );
};

export default ProfileImagesSlider;
