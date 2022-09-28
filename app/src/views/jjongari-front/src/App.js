import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Jjong from "./components/Jjong";
import SearchModal from "./components/SearchModal";
import WriteModal from "./components/WriteModal";
import { gql, useMutation, useQuery } from "@apollo/client";

const JJONGS = gql`
  query Jjongs(
    $id: [Int]
    $subject: String
    $grade: String
    $semester: String
    $achievementId: String
    $text: String
    $sort: Point
  ) {
    jjongs(
      id: $id
      subject: $subject
      grade: $grade
      semester: $semester
      achievementId: $achievementId
      text: $text
      sort: $sort
    ) {
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

const AUTH = gql`
  mutation Auth($token: String) {
    auth(token: $token)
  }
`;

function App() {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isWriteOpen, setWriteOpen] = useState(false);

  const { data, refetch } = useQuery(JJONGS);
  const [auth] = useMutation(AUTH);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    auth({
      variables: { token },
      onCompleted: ({ auth }) => {
        localStorage.setItem("token", auth);
      },
    });
  }, [auth]);

  return (
    <div className="container font-dodum">
      <button
        onClick={() => {
          window.location.replace("/");
        }}
      ></button>
      <Navbar openSearchModal={setSearchOpen} openWriteModal={setWriteOpen} refetch={refetch} />

      {data?.jjongs?.map(({ id, grade, semester, subject, achievementId, achievement, text, usages, likes }) => (
        <Jjong
          key={id}
          id={id}
          grade={grade}
          semester={semester}
          subject={subject}
          achievementId={achievementId}
          achievement={achievement}
          text={text}
          usages={usages}
          likes={likes}
          refetch={refetch}
        />
      ))}

      <SearchModal isOpen={isSearchOpen} openModal={setSearchOpen} refetch={refetch} />

      <WriteModal isOpen={isWriteOpen} openModal={setWriteOpen} refetch={refetch} />
    </div>
  );
}

export default App;
