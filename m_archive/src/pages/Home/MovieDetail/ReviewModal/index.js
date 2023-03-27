import { useEffect, useState } from "react";
import styles from "./reviewModal.module.scss";
import { Button } from "../../../../components/Common";
import cx from "classnames";

const ReviewModal = ({ title, content, onClose }) => {
  const [review, setReview] = useState("");
  const [isModified, setIsModified] = useState(false);
  //const [isDeleted, setIsDeleted] = useState(false);

  const onSubmit = async (e) => {
    /**
     * 리뷰 저장 기능
     * api생기면 구현예정
     * const result = await reviewSubmit({
     *    review:form.review;
     * });
     *  */
    //e.preventDefalut();
    const btn_type = e.currentTarget.id;
    if(btn_type ==="save"){
      if (isModified) {
        alert("리뷰가 수정되었습니다.");
      } else {
        alert("리뷰가 작성되었습니다.");
      }
    }
    else{
      alert("리뷰가 삭제되었습니다.");

    }
    onClose();
  };
  const onClickDelete = async (e) => {
    /**
     * 리뷰삭제기능
     *  api생기면 구현예정
     */
    alert("리뷰가 삭제되었습니다.");
    //setIsDeleted(true);
    //return()=>{onClose();}
    
  };

  const onChange = (e) => {
    const { value } = e.currentTarget;
    setReview(value);
  };

  useEffect(() => {
    if (!!content) {
      setReview(content);
      setIsModified(true);
    }
  }, []);
  /*
  useEffect(()=>{
    return()=>{ onClose();}
  },[isDeleted]);*/

  return (
    <section className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <h1>{title}</h1>
      </div>
      <form id="reviewForm" onSubmit={onSubmit} className={styles.formWrapper}>
        <textarea
          //type="text"
          name="review"
          className={cx(styles.reviewContent)}
          value={review}
          onChange={onChange}
        />

        {/* //NOTE: position fixed */}
        <div className={styles.btnWrapper}>
          {isModified && (
            <Button id="delete" color={"gray"} type="submit"  form="reviewForm">
              삭제
            </Button>
          )}

          <Button  id="save" color={"secondary"} type="submit" form="reviewForm" >
            {!isModified ? "저장" : "수정"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ReviewModal;
