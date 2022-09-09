import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";

const GET_ACHIEVEMENTS = gql`
  query Achievements($grade: String, $subject: String) {
    achievements(grade: $grade, subject: $subject) {
      id
      text
    }
  }
`;

const subjectValue12 = ["국어", "수학", "바른생활", "즐거운 생활", "슬기로운 생활"];
const subjectValue34 = ["국어", "도덕", "사회", "수학", "과학", "체육", "음악", "미술", "영어"];
const subjectValue56 = ["국어", "도덕", "사회", "수학", "과학", "실과", "체육", "음악", "미술", "영어"];
const subjectValueAll = [
  "국어",
  "바른생활",
  "즐거운 생활",
  "슬기로운 생활",
  "도덕",
  "사회",
  "수학",
  "과학",
  "실과",
  "체육",
  "음악",
  "미술",
  "영어",
];

function SubjectSelect({ state, setState, valueList }) {
  return (
    <select className="select select-borderd w-full mb-2" value={state} onChange={(e) => setState(e.target.value)}>
      <option value="default">과목</option>
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
  useEffect(() => {
    setText();
  }, [data]);
  return (
    <div className="form-control w-full mb-3">
      <select
        className="select select-borderd w-full"
        defaultValue={achievement}
        onChange={(e) => {
          const selectedAchievement = e.target.value;
          setAchievement(selectedAchievement);
          if (selectedAchievement !== "default")
            setText("* " + data.find((achievement) => (achievement.id === selectedAchievement ? true : false)).text);
          else setText();
        }}
      >
        <option value="default">성취기준</option>
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

function SearchModal({ isOpen, openModal, refetch }) {
  const [selectedGrade, setGrade] = useState("0");
  const [selectedSemester, setSemester] = useState("0");
  const [selectedSubject, setSubject] = useState("default");
  const [selectedAchievement, setAchievement] = useState("default");

  const [achievements, { data }] = useLazyQuery(GET_ACHIEVEMENTS);

  useEffect(() => {
    const variables = {};
    if (selectedGrade !== "0") variables.grade = selectedGrade;
    if (selectedSubject !== "default") variables.subject = selectedSubject;
    achievements({
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      variables,
    });
  }, [achievements, selectedGrade, selectedSubject]);

  const handleClose = () => {
    openModal(false);
  };

  const handleSubmit = () => {
    const variables = {};
    variables.grade = selectedGrade !== "0" ? selectedGrade : null;
    variables.semester = selectedSemester !== "0" ? selectedSemester : null;
    variables.subject = selectedSubject !== "default" ? selectedSubject : null;
    variables.achievementId = selectedAchievement !== "default" ? selectedAchievement : null;
    refetch(variables);
    openModal(false);
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
            <option value={"0"}>학년</option>
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
            <option value={"0"}>학기</option>
            <option value={"1"}>1학기</option>
            <option value={"2"}>2학기</option>
          </select>

          {selectedGrade === "0" && (
            <SubjectSelect state={selectedSubject} setState={setSubject} valueList={subjectValueAll} />
          )}
          {["1", "2"].includes(selectedGrade) && (
            <SubjectSelect state={selectedSubject} setState={setSubject} valueList={subjectValue12} />
          )}
          {["3", "4"].includes(selectedGrade) && (
            <SubjectSelect state={selectedSubject} setState={setSubject} valueList={subjectValue34} />
          )}
          {["5", "6"].includes(selectedGrade) && (
            <SubjectSelect state={selectedSubject} setState={setSubject} valueList={subjectValue56} />
          )}

          <AchievementInput
            data={data?.achievements}
            achievement={selectedAchievement}
            setAchievement={setAchievement}
          ></AchievementInput>

          <button className="btn btn-block" onClick={handleSubmit}>
            검색
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
