import React, { useEffect, useState } from 'react';
import styles from './reviewCarousel.module.scss';
import { ChevronArrow } from '../../../../assets/icon';
import { useNavigate } from 'react-router-dom';
//import ReviewCard from "../../../../components/Common/ReviewCard";
import Review from './Review';
import { EclipseIcon } from '../../../../assets/icon';
import cx from 'classnames';
/**
 * items - 캐러셀 안에 들어갈 아이템배열
 *
 */

//NOTE: hook -> state -> 함수 -> useEffect

const ReviewCarousel = ({ reviews }) => {
  const navigate = useNavigate();
  //ReviewCardWrapper크기알아야함!!
  const [slidePx, setSlidePx] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [movePx, setMovePx] = useState(1920);

  //
  const onNavigateDetail = (id) => {
    return () => {
      //MEMO: navigate를 할 때는 /가 있어야 함
      //navigate(`/movies/detail/${id}/reviews`);
    };
  };

  const toPrev = () => {
    //card width - 1712 , homepage padding-48
    if (slidePx < 0) setSlidePx(slidePx + movePx);
  };

  const toNext = () => {
    //card width - 1712 , homepage padding-48 , li gap - 8
    console.log(movePx * moveCount);
    if (slidePx > -(movePx * moveCount)) setSlidePx(slidePx - movePx);
  };

  useEffect(() => {
    setMoveCount(Math.round(reviews.length / 2) - 1);
  }, [reviews]);

  if (!reviews) return;
  return (
    <section className={styles.wrapper}>
      <ChevronArrow className={styles.prevBtn} onClick={toPrev} />
      <ul className={styles.ulWrapper}>
        {reviews.map((review, idx) => {
          return (
            <Review
              slide={slidePx}
              key={`Review-${review.id}`}
              review={review}
              idx={idx}
              //onClick={onNavigateDetail(review.id)}
              //type={type}
            />
          );
        })}
      </ul>
      <ChevronArrow className={styles.nextBtn} onClick={toNext} />
    </section>
  );
};

export default ReviewCarousel;
