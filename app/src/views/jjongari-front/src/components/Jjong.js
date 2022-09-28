import { useEffect, useRef, useState } from "react";
import { gql, useMutation } from "@apollo/client";

const ADD_POINT = gql`
  mutation EditJjong($editJjongId: Int!, $point: Point) {
    editJjong(id: $editJjongId, point: $point) {
      usages
      likes
    }
  }
`;

const DEL_JJONG = gql`
  mutation DeleteJjong($deleteJjongId: Int!) {
    deleteJjong(id: $deleteJjongId) {
      id
    }
  }
`;

function Jjong({ id, grade, semester, subject, achievementId, achievement, text, usages, likes, refetch }) {
  const [btnLoading, setBtnLoading] = useState(false);
  const [usagesNum, setUsages] = useState(usages);
  const [likesNum, setLikes] = useState(likes);
  const [like, setLike] = useState(false);

  const alertRef = useRef();
  const textRef = useRef();

  useEffect(() => {
    const likes = JSON.parse(localStorage.getItem("likes"));
    const likesList = likes ? likes : [];
    setLike(likesList.includes(id));
  }, [id, likesNum]);

  const [addPoint] = useMutation(ADD_POINT);
  const [delJjong] = useMutation(DEL_JJONG);

  const handleClickUse = () => {
    if (btnLoading) return;
    setBtnLoading(true);

    // 사용량 1 올려주는 뮤테이션
    addPoint({
      variables: {
        editJjongId: id,
        point: "usages",
      },
      onCompleted: ({ editJjong }) => {
        setUsages(editJjong.usages);
      },
    });

    // 쫑아리 복사
    navigator.clipboard.writeText(textRef.current.innerText).then(() => {
      alertRef.current.classList.toggle("hidden");
      alertRef.current.classList.toggle("opacity-0");

      setTimeout(() => {
        alertRef.current.classList.toggle("opacity-0");
        setTimeout(() => {
          alertRef.current.classList.toggle("hidden");
          setBtnLoading(false);
        }, 300);
      }, 500);
    });
  };

  const handleClickLike = () => {
    if (btnLoading) return;
    setBtnLoading(true);

    const variables = { editJjongId: id };
    const likes = JSON.parse(localStorage.getItem("likes"));
    const likesList = likes ? likes : [];
    variables.point = likesList.includes(id) ? "unlikes" : "likes";

    // 좋아요 뮤테이션
    addPoint({
      variables,
      onCompleted: ({ editJjong }) => {
        setLikes(editJjong.likes);
        const temp = new Set(likesList);
        if (!temp.delete(id)) temp.add(id);
        localStorage.setItem("likes", JSON.stringify([...temp]));
        setBtnLoading(false);
      },
    });
  };

  const handleDelBtn = () => {
    const check = window.confirm("삭제하시겠습니까?");
    if (check) {
      delJjong({
        variables: { deleteJjongId: id },
        onCompleted: ({ deleteJjong }) => {
          const id = deleteJjong?.id;
          if (id) {
            const ownedJjong = JSON.parse(localStorage.getItem("owned"));
            localStorage.setItem("owned", JSON.stringify(ownedJjong.filter((own) => own !== id)));
          }
          refetch();
        },
      });
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-3 grid grid-cols-1 md:grid-cols-[minmax(500px,_auto)_150px] hover:bg-white">
      <div className="card-body p-4 pb-2">
        <p
          className="truncate"
          onClick={(e) => {
            e.target.classList.toggle("truncate");
          }}
        >
          {grade}학년
          {semester && ` > ${semester}학기`} &gt; {subject}
          {achievementId && ` > [${achievementId}]${achievement.text}`}
        </p>
        <p className="text-xl flex items-center" ref={textRef}>
          {text}
          {JSON.parse(localStorage.getItem("owned"))?.includes(id) && (
            <button className="btn btn-xs btn-circle btn-outline btn-error mx-2" onClick={handleDelBtn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </p>
      </div>

      <div className="card-actions flex md:flex-col justify-center content-center mx-4 my-2">
        <div className="border-2 p-1 rounded-full border-neutral flex mx-auto">
          <button className="btn btn-circle btn-xs" onClick={handleClickUse}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-4 h-4 stroke-1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 18.75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-4.776 8.45a12.008 12.008 0 00-3.114 4.85L7.5 15.376m3.85-11.54c-.065.21-.1.433-.1.664v0c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v0a2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
              />
            </svg>
          </button>
          <p className="text-md font-bold mx-2">{usagesNum ? usagesNum : 0}</p>
        </div>

        <div className={`border-2 p-1 rounded-full border-neutral${like ? "-content" : ""} flex mx-auto`}>
          <button className="btn btn-circle btn-xs" onClick={handleClickLike}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className={`w-4 h-4 stroke-1 ${like ? "fill-current" : null}`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
          <p className="text-md font-bold mx-2">{likesNum}</p>
        </div>
      </div>

      <div
        className="alert shadow-lg absolute w-52 top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 hidden opacity-0 transition ease-in-out duration-500"
        ref={alertRef}
      >
        <div className="mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info flex-shrink-0 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>복사되었습니다!</span>
        </div>
      </div>
    </div>
  );
}

export default Jjong;
