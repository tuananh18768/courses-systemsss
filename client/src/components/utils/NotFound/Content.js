import React, { useEffect, useState } from "react";
import HeaderBottom from "../../Header/HeaderBottom";
import IdeaStaff from "../../Body/iIdeaStaff/IdeaStaff";
import Pagination from "../../Body/Pagination/Pagination";
import { saveAs } from "file-saver";
import Footer from "../../Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCategory,
  dispatchGetAllCategory,
} from "../../../redux/actions/categoryAction";
import { Link } from "react-router-dom";
import Category from "../../Body/Categories/Categories";
import { dispatchSort } from "../../../redux/actions/ideaStaffAction";
import { dispatchGetAllIdeaStaff } from "../../../redux/actions/ideaStaffAction";
import { fetchAllIdeaStaff } from "../../../redux/actions/ideaStaffAction";
import axios from "axios";
import { showErrMsg } from "../Notification/Notification";
import {
  fetchAllDepartment,
  dispatchGetAllDepartment,
  fetchOneDepartment,
  dispatchGetOneDepartment,
} from "../../../redux/actions/departmentAction";

const radio = {
  width: "auto",
};
export default function Content() {
  const token = useSelector((state) => state.token);
  //const auth = useSelector(state => state.auth)
  const category = useSelector((state) => state.category);
  const auth = useSelector((state) => state.auth);
  const departmetAll = useSelector((state) => state.depatment);
  const ideaStaffs = useSelector((state) => state.ideaStaff);
  const dispatch = useDispatch();
  const [sort, setSort] = useState(false);
  const [chooses, setChooses] = useState();
  const [error, setError] = useState();
  const [departmentChange, setDepartmentChange] = useState(false);
  const [chooseDepart, setChooseDepart] = useState();

  const { isManager } = auth;
  const { departmentAlls, departmentOne } = departmetAll;

  const [currentPage, setCurrentpage] = useState(1);
  const [postPerpage] = useState(5);
  const [dateDepartment, setDateDepartment] = useState();

  const indexOfLastPost = currentPage * postPerpage;
  const indexFisrtOfPost = indexOfLastPost - postPerpage;
  const currentPost = departmentOne.slice(indexFisrtOfPost, indexOfLastPost);
  const currentPostStaff = ideaStaffs.slice(indexFisrtOfPost, indexOfLastPost);

  useEffect(() => {
    if (token) {
      fetchAllIdeaStaff(token).then((res) =>
        dispatch(dispatchGetAllIdeaStaff(res))
      );
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (token) {
      fetchAllCategory(token).then((res) =>
        dispatch(dispatchGetAllCategory(res))
      );
    }
  }, [token, dispatch]);
  useEffect(() => {
    if (token) {
      fetchAllDepartment(token).then((res) =>
        dispatch(dispatchGetAllDepartment(res))
      );
      fetchOneDepartment(chooseDepart, token).then((res) =>
        dispatch(dispatchGetOneDepartment(res))
      );
    }
  }, [token, dispatch, chooseDepart]);
  const sortAscending = (data, field) => {
    const [...arrPost] = data;
    const obj = {
      data: arrPost,
    };
    obj.data.sort((a, b) => {
      return a[field].length - b[field].length;
    });
    return obj;
  };
  const handleChangeSelect = (sort, chooses) => {
    switch (chooses) {
      case "likes":
        const [...arrPost] = ideaStaffs;
        const obj = sortAscending(arrPost, "likes");
        if (sort) {
          obj.data.reverse();
        }
        dispatch(dispatchGetAllIdeaStaff(obj));

        break;
      case "comments":
        {
          const [...arrPost] = ideaStaffs;
          const obj = sortAscending(arrPost, "comments");
          if (sort) obj.data.reverse();
          dispatch(dispatchGetAllIdeaStaff(obj));
        }
        break;
      case "views":
        {
          const [...arrPost] = ideaStaffs;
          const obj = sortAscending(arrPost, "views");
          if (sort) obj.data.reverse();
          dispatch(dispatchGetAllIdeaStaff(obj));
        }
        break;
      case "times":
        {
          console.log(sort);
          const [...arrPost] = ideaStaffs;
          const arrNew = arrPost.map((e) => ({ ...e }));
          arrNew.sort((a, b) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });
          if (sort) arrNew.reverse();
          dispatch(
            dispatchGetAllIdeaStaff({
              data: arrNew,
            })
          );
        }
        break;

      default: {
      }
    }
  };
  useEffect(() => {
    handleChangeSelect(sort, chooses);
  }, [sort, chooses]);

  const handleClickPage = (number, totalPage) => {
    if (number >= 1 && number <= totalPage) {
      setCurrentpage(number);
    }
  };
  const handleDownloadZip = async () => {
    try {
      const res = await axios.get("/api/downloadZip", {
        headers: { Authorization: token },
        responseType: "blob",
      });
      const str = res.headers["content-disposition"];
      const startSlice = str.indexOf('=');
      const endSlice = str.lastIndexOf('');
      const fileName = str.slice(startSlice + 1, endSlice + 1);
      console.log(fileName)

      saveAs(res.data, fileName);
      res.data();
    } catch (error) {
      setError(error.response.data.msg);
    }
  };
  const handleDownloadCsv = async () => {
    try {
      const res = await axios.get("/api/downloadCsv", {
        headers: { Authorization: token },
        responseType: "blob",
      });
      const str = res.headers["content-disposition"];
      const startSlice = str.indexOf('"');
      const endSlice = str.lastIndexOf('"');
      const fileName = str.slice(startSlice + 1, endSlice);
      saveAs(res.data, fileName);
    } catch (error) {
      setError(error.response.data.msg);
    }
  };
  return (
    <>
      {error && showErrMsg(error)}
      <div
        className="content_main"
        style={{ display: "flex", alignItems: "stretch", marginTop: "75px" }}
      >
        <div className="main__left">
          <section className="categories">
            <Category />
          </section>
          <div></div>
        </div>
        <div className="wrapIdeas">
          <div className="wrapIdeas__header" style={{ border: 0 }}>
            <p>{ideaStaffs.length} items found</p>
            <div
              className="dropdown"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginRight: 10,
                }}
              >
                <input
                  style={radio}
                  onClick={() => {
                    setSort(true);
                  }}
                  type="radio"
                  name="sort"
                />
                Descending
                <input
                  style={radio}
                  onClick={() => {
                    setSort(false);
                  }}
                  type="radio"
                  name="sort"
                  checked={!sort}
                />
                Ascending
              </div>
              <select
                className=" btnVI"
                onChange={(e) => {
                  setChooses(e.target.value);
                }}
              >
                <option value="null">---choose option---</option>
                <option value="likes">Most Like</option>
                <option value="views">Most Views</option>
                <option value="comments">Most Comments</option>
                <option value="times">Most News</option>
              </select>
            </div>
          </div>
          {isManager && (
            <>
              <div
                className="wrapIdeas__header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "0",
                }}
              >
                {!departmentChange ? (
                  <div>
                    <button
                      disabled
                      style={{ cursor: "auto" }}
                      id="downloadZip"
                      onClick={handleDownloadZip}
                      to=""
                    >
                      Download all zip
                    </button>
                    <button
                      disabled
                      style={{ cursor: "auto" }}
                      id="downloadCsv"
                      onClick={handleDownloadCsv}
                      to=""
                    >
                      Download all csv
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      id="downloadZip"
                      style={{ cursor: "pointer" }}
                      onClick={handleDownloadZip}
                      to=""
                    >
                      Download all zip
                    </button>
                    <button
                      id="downloadCsv"
                      style={{ cursor: "pointer" }}
                      onClick={handleDownloadCsv}
                      to=""
                    >
                      Download all csv
                    </button>
                  </div>
                )}

                <select
                  style={{ width: 300 }}
                  className=" btnVI"
                  name="changeDepart"
                  onChange={(e) => {
                    setChooseDepart(e.target.value);
                    setDepartmentChange(true);
                    if (e.target.value === "") {
                      setDepartmentChange(false);
                    }
                  }}
                >
                  <option value="">---choose department---</option>;
                  {departmentAlls.map((current, index) => {
                    return (
                      <option key={index} value={current._id}>
                        {current.name}
                        {current.departmentAll?.set_deadline}
                      </option>
                    );
                  })}
                </select>
              </div>
            </>
          )}

          <div className="wrapIdeas__content" style={{ minHeight: "650px" }}>
            <IdeaStaff
              currentPost={currentPost}
              currentPostStaff={currentPostStaff}
              departmentChange={departmentChange}
            />
          </div>
          <div>
            <Pagination
              currentPage={currentPage}
              postPerpage={postPerpage}
              handleClickPage={handleClickPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
