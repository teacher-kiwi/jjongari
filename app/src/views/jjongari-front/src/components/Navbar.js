function Navbar({ openSearchModal, openWriteModal, refetch }) {
  return (
    <div className="navbar my-5 shadow-xl rounded-box bg-base-100">
      <div className="navbar">
        <div className="navbar-start">
          <div class="tooltip tooltip-bottom" data-tip="사용순">
            <label
              tabindex="0"
              className="btn btn-ghost btn-circle align-middle"
              onClick={() => refetch({ sort: "usages" })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6 stroke-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 18.75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-4.776 8.45a12.008 12.008 0 00-3.114 4.85L7.5 15.376m3.85-11.54c-.065.21-.1.433-.1.664v0c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v0a2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                />
              </svg>
            </label>
          </div>

          <div className="tooltip tooltip-bottom" data-tip="좋아요순">
            <label tabindex="0" className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6 stroke-2"
                onClick={() => refetch({ sort: "likes" })}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </label>
          </div>
        </div>

        <div className="navbar-center">
          <button
            className="btn btn-ghost normal-case text-3xl md:text-4xl"
            onClick={() => {
              window.location.reload();
            }}
          >
            쫑알e
          </button>
        </div>

        <div className="navbar-end">
          <div className="tooltip tooltip-bottom" data-tip="내꺼">
            <button
              className="btn btn-ghost btn-circle modal-button"
              onClick={() => {
                const id = JSON.parse(window.localStorage.getItem("likes"));
                if (!id || id.length === 0) return;
                refetch({ id });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 stroke-0"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 8v11c0 2.201 1.794 3 3 3h15v-2H6.012C5.55 19.988 5 19.806 5 19s.55-.988 1.012-1H21V4c0-1.103-.897-2-2-2H6c-1.206 0-3 .799-3 3v3zm3-4h13v12H5V5c0-.806.55-.988 1-1z" />
                <path d="m11.997 14 3.35-3.289a2.129 2.129 0 0 0 0-3.069 2.225 2.225 0 0 0-3.126 0l-.224.218-.224-.219a2.224 2.224 0 0 0-3.125 0 2.129 2.129 0 0 0 0 3.069L11.997 14z" />
              </svg>
            </button>
          </div>

          <div className="tooltip tooltip-bottom" data-tip="검색">
            <button
              className="btn btn-ghost btn-circle modal-button"
              onClick={() => {
                openSearchModal(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 stroke-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          <div className="tooltip tooltip-bottom" data-tip="등록">
            <button
              className="btn btn-ghost btn-circle modal-button"
              onClick={() => {
                openWriteModal(true);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />{" "}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
