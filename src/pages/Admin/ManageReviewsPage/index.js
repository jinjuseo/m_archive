import React, { useCallback, useEffect, useState } from 'react';
import {
  AdminLNB,
  CheckBox,
  SearchBox,
  Button,
} from '../../../components';
import styles from './manageReviews.module.scss';
import { getReviews, deleteReviewAdmin } from '../../../api/Reviews';
import { useNavigate } from 'react-router-dom';
import tableStyle from '../tableStyle.module.scss';
import { getReviewsCount } from '../../../api/Reviews';
import Pagination from '../../../components/Common/PageNation';
import dayjs from 'dayjs';
import cx from 'classnames';
//MEMO: modal에 필요한 것들
import useModal from '../../../components/Common/Modal/useModal';
import { Modal } from '../../../components';
import {EditModal,TableMenu} from '../_shared';
import { useLocation } from 'react-router-dom';
import {useMe} from "../../../hooks";
const ManageReviewsPage = () => {
  const me = useMe();
  const path=useLocation();
  const navigate = useNavigate();
  const [modalOption, showModal, onClose] = useModal();

  const [selectedReviews, setSelectedReviews] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isChecked, setIsChecked] = useState(false);
  const [isReversed, setIsReversed] = useState('asc');
  const [isOrderBy, setIsOrderBy] = useState('NAME');
  const [keyword, setKeyword] = useState('');

  const isAllChecked = selectedReviews.length === reviews.length;

  const onClick = () => {
    setIsChecked(!isChecked);
  };
  const onClickLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };
  const handleSubmit = async (event) => {
    const response = await getReviews(1, 10, event.target.value);
    setKeyword(event.target.value);
    if (response.status === 200) {
      const items = [...response.data.data];
      setReviews(items);
      setTotalPages(Math.ceil(response.data.paging.total / pageLimit));
      setCurrentPage(1);
    }
    if (event.target.value === '') {
      // 검색어가 비어있는 경우
      setTotalPages(Math.ceil(response.data.paging.total / pageLimit));
      setCurrentPage(1);
      return;
    }
  };

  const onGetReviews = async () => {
    const response = await getReviews(
      currentPage,
      pageLimit,
      keyword,
      isOrderBy,
      isReversed,
    );

    if (response.status === 200) {
      const items = [...response.data.data];
      setReviews(items);
    }
  };
  const fetchData = async () => {
    const response = await getReviews(
      currentPage,
      pageLimit,
      keyword,
      isOrderBy,
      isReversed,
    );
    const count = await getReviewsCount();
    if (response.status === 200) {
      const items = [...response.data.data];
      setIsChecked(false);
      setSelectedReviews([]);
      setTotalPages(Math.ceil(response.data.paging.total / pageLimit));
      setReviews(items);
    }
  };
  const onCheckReview = (id) => {
    return () => {
      if (selectedReviews.includes(id)) {
        setSelectedReviews(
          selectedReviews.filter((reviewId) => reviewId !== id),
        );
      } else {
        setSelectedReviews([...selectedReviews, id]);
      }
    };
  };

  const onCheckAll = () => {
    if (isChecked) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map((review) => review.id));
    }
  };

  const onDeleteReview = () => {
    const reviewIDs = selectedReviews;
    for (const el of reviewIDs) {
      //deleteReview(el);
      onDelete(el);
    }
    alert("삭제 성공!");
  };

  const onDelete = async (id) => {
    const response = await deleteReviewAdmin(id);
    if (response.status === 204) {
      onGetReviews();
    } else {
      alert('삭제 오류!');
    }
  };

  const onClickOpenModal = useCallback(
    (item, type) => {
      // const item= reviews?.filter((item)=>item.id === id)[0]
      showModal(
        true,
        '',
        null,
        fetchData,
        <EditModal
          item={item}
          type={type}
          onClose={()=>{
            modalOption.onClose();
          }}
        />,
      );
    },
    //NOTE: onGetReviews가 deps에 없으면 초기 state를 가지고 있는 함수만 적용이 됩니다.
    [modalOption, ],
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  

  const orderBy = async (item) => {
    setIsOrderBy(item.id);
    setIsReversed((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  useEffect(() => {
    async function fetchData() {
      const response = await getReviews(
        currentPage,
        pageLimit,
        keyword,
        isOrderBy,
        isReversed,
      );
      setReviews(response.data.data);
      setCurrentPage(currentPage);
    }
    fetchData();
  }, [isOrderBy, isReversed]);

  useEffect(() => {
    onGetReviews();
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageLimit]);
  useEffect(()=>{
    if(me?.userType === "USER"){
      alert("권한 없음");
      onClickLogout();
    }
  },[me]);
  return (
    <main className={styles.wrapper}>
      <AdminLNB path={path.pathname} />
      <section className={styles.allSection}>
        <div className={styles.header}>
          <Button
            color="secondary"
            width="long"
            children={'로그아웃'}
            onClick={onClickLogout}
          />
        </div>
        <div className={styles.topMenu}>
          <span className={styles.menuLeft}>
            <CheckBox
              className={styles.check}
              checked={isChecked}
              onChange={onCheckAll}
              onClick={onClick}
              id="SelectAll"
            />
            전체선택
          </span>
          <span className={styles.menuRight}>
            <Button width={'long'} color={'secondary'} onClick={onDeleteReview}>
              삭제
            </Button>

            <SearchBox
              className={styles.SearchBox}
              placeholder="작성자"
              onChange={handleSubmit}
            />
          </span>
        </div>
        <p className={styles.secondMenu}>
          <TableMenu tableName="reviews" onClick={orderBy} />
        </p>
        <p className={styles.table}>
          <div>
            <table className={tableStyle.table}>
              {reviews.map((review, idx) => {
                const createdAt = review.createdAt;
                return (
                  <li key={idx} className={tableStyle.elements}>
                    <CheckBox
                      className={tableStyle.check}
                      checked={selectedReviews.includes(review.id)}
                      onChange={onCheckReview(review.id)}
                    />
                    <span id="영화">{review.movie.title}</span>
                    <span>{review.user.name}</span>
                    <span>{review.likeCount}</span>
                    <span>
                      {dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                    <span></span>
                    <Button
                      className={styles.ediBtn}
                      children="수정"
                      width={'short'}
                      color={'secondary'}
                      onClick={() => onClickOpenModal(review, 'review')}
                    ></Button>
                  </li>
                );
              })}
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </p>
      </section>
      <Modal modalOption={modalOption} modalSize="small" />
    </main>
  );
};

export default ManageReviewsPage;
