import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";

const GET_ACHIEVEMENTS = gql`
  query Achievements($grade: String, $subject: String) {
    achievements(grade: $grade, subject: $subject) {
      id
      text
    }
  }
`;

const POST_JJONG = gql`
  mutation PostJjong($input: postJjongInput!) {
    postJjong(input: $input) {
      id
      subject
      grade
      semester
      text
      achievementId
      achievement {
        id
        subject
        grade
        text
      }
      usages
      likes
      reports
    }
  }
`;

const subjectValue12 = ["국어", "수학", "바른생활", "즐거운 생활", "슬기로운 생활"];
const subjectValue34 = ["국어", "도덕", "사회", "수학", "과학", "체육", "음악", "미술", "영어"];
const subjectValue56 = ["국어", "도덕", "사회", "수학", "과학", "실과", "체육", "음악", "미술", "영어"];

function SubjectSelect({ state, setState, valueList }) {
  return (
    <select className="select select-borderd w-full mb-2" value={state} onChange={(e) => setState(e.target.value)}>
      <option value="default" disabled>
        과목(필수)
      </option>
      {valueList.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
}

function AchievementInput({ data, achievement, setAchievement }) {
  const [text, setText] = useState();
  return (
    <div className="form-control w-full mb-3">
      <select
        className="select select-borderd w-full"
        defaultValue={achievement}
        onChange={(e) => {
          const selectedAchievement = e.target.value;
          setAchievement(selectedAchievement);
          setText("* " + data.find((achievement) => (achievement.id === selectedAchievement ? true : false)).text);
        }}
      >
        <option value="default">성취기준(선택)</option>
        {data?.map((achievement) => (
          <option key={achievement.id} value={achievement.id}>
            {achievement.id}
          </option>
        ))}
      </select>
      <label className="label mx-4">
        <span className="label-text-alt">{text}</span>
      </label>
    </div>
  );
}

function WriteModal({ isOpen, openModal, refetch }) {
  const [selectedGrade, setGrade] = useState("0");
  const [selectedSemester, setSemester] = useState("0");
  const [selectedSubject, setSubject] = useState("default");
  const [selectedAchievement, setAchievement] = useState("default");
  const [showSelect, setShow] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  const alertRef = useRef();
  const textRef = useRef();

  const [achievements, { data }] = useLazyQuery(GET_ACHIEVEMENTS);
  const [postJjong] = useMutation(POST_JJONG);

  useEffect(() => {
    achievements({
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      variables: {
        grade: selectedGrade,
        subject: selectedSubject,
      },
      onCompleted: (data) => {
        setShow(data.achievements.length !== 0);
      },
    });
  }, [achievements, selectedGrade, selectedSubject]);

  const handleClose = () => {
    setGrade("0");
    setSemester("0");
    setSubject("default");
    setAchievement("default");
    setShow(false);
    const input = textRef.current;
    if (input) input.value = "";
    openModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      grade: selectedGrade,
      subject: selectedSubject,
    };
    if (selectedSemester !== "0") data.semester = selectedSemester;
    if (selectedAchievement !== "default") data.achievementId = selectedAchievement;
    if (textRef.current) data.text = textRef.current.value.trim();

    const msg =
      data.grade === "0"
        ? "학년을 선택해주세요."
        : data.subject === "default"
        ? "과목을 선택해주세요."
        : !data.text
        ? "쫑아리를 입력해주세요."
        : null;
    if (msg) popupAlert(msg);
    else
      postJjong({
        variables: { input: data },
        onCompleted: ({ postJjong }) => {
          const ownedJjong = JSON.parse(localStorage.getItem("owned"));
          if (ownedJjong) {
            ownedJjong.push(postJjong.id);
            localStorage.setItem("owned", JSON.stringify(ownedJjong));
          } else localStorage.setItem("owned", `[${postJjong.id}]`);

          openModal(false);
          refetch();
          handleClose();
        },
      });
  };

  const popupAlert = (msg) => {
    if (msg) setErrMsg(msg);

    alertRef.current.classList.toggle("hidden");
    alertRef.current.classList.toggle("opacity-0");

    setTimeout(() => {
      alertRef.current.classList.toggle("opacity-0");
      setTimeout(() => {
        alertRef.current.classList.toggle("hidden");
      }, 300);
    }, 500);
  };

  return (
    <div>
      <input type="checkbox" className="modal-toggle" checked={isOpen} readOnly />
      <div
        className="modal cursor-pointer"
        onClick={(e) => {
          if (e.target === e.currentTarget) openModal(false);
        }}
      >
        <div className="modal-box relative">
          <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={handleClose}>
            ✕
          </button>

          <select
            className="select select-borderd w-full mb-2 mt-5"
            value={selectedGrade}
            onChange={(e) => {
              setSubject("default");
              setAchievement("default");
              setGrade(e.target.value);
            }}
          >
            <option value={"0"} disabled>
              학년(필수)
            </option>
            <option value={"1"}>1학년</option>
            <option value={"2"}>2학년</option>
            <option value={"3"}>3학년</option>
            <option value={"4"}>4학년</option>
            <option value={"5"}>5학년</option>
            <option value={"6"}>6학년</option>
          </select>

          <select
            className="select select-borderd w-full mb-2"
            value={selectedSemester}
            onChange={(e) => {
              setSemester(e.target.value);
            }}
          >
            <option value={"0"}>학기(선택)</option>
            <option value={"1"}>1학기</option>
            <option value={"2"}>2학기</option>
          </select>

          {["1", "2"].includes(selectedGrade) && (
            <SubjectSelect state={selectedSubject} setState={setSubject} valueList={subjectValue12} />
          )}
          {["3", "4"].includes(selectedGrade) && (
            <SubjectSelect state={selectedSubject} setState={setSubject} valueList={subjectValue34} />
          )}
          {["5", "6"].includes(selectedGrade) && (
            <SubjectSelect state={selectedSubject} setState={setSubject} valueList={subjectValue56} />
          )}
          {showSelect && (
            <AchievementInput
              data={data?.achievements}
              achievement={selectedAchievement}
              setAchievement={setAchievement}
            ></AchievementInput>
          )}

          <form>
            {selectedSubject !== "default" && (
              <input
                ref={textRef}
                type="text"
                required={true}
                minLength={4}
                placeholder="쫑아리를 써주세요!"
                className="input input-bordered w-full mb-4"
              />
            )}

            <button type="submit" className="btn btn-block" onClick={handleSubmit}>
              등록
            </button>
          </form>
        </div>

        {/* 경고창 */}
        <div
          className="alert alert-error shadow-lg absolute w-auto hidden opacity-0 transition ease-in-out duration-500"
          ref={alertRef}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errMsg}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WriteModal;
