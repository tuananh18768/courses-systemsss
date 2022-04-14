import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDetailPost,
  dispatchGetDetailPost,
} from "../../../redux/actions/detailPostAction";
import {
  fetchAllIdeaStaff,
  dispatchGetAllIdeaStaff,
} from "../../../redux/actions/ideaStaffAction";
import {
  fetchAllDepartment,
  dispatchGetAllDepartment,
} from "../../../redux/actions/departmentAction";
import {
  fetchAllCategory,
  dispatchGetAllCategory,
} from "../../../redux/actions/categoryAction";
import axios from "axios";
import { format } from "date-fns";

const formComment = {
  padding: "0",
  borderRadius: "0",
  border: "0",
  display: "flex",
  alignItems: "center",
};
const formatComentInput = {
  padding: "0 30px",
  fontSize: "14px",
};
export default function DetailPost() {
  const [textComment, setTextComment] = useState("");
  const [dataComment, setDataComment] = useState();

  const [like, setLike] = useState();
  const token = useSelector((state) => state.token);
  const ideaStaff = useSelector((state) => state.ideaStaff);
  const auth = useSelector((state) => state.auth);
  const departments = useSelector((state) => state.depatment);
  const cateAll = useSelector((state) => state.category);

  const { user } = auth;
  const [userInteract, setUserInteract] = useState(false);
  const [userInteractDis, setUserInteractDis] = useState(false);
  const [checkAnonymous, setCheckAnonymous] = useState(false);
  const [objPost, setObjPost] = useState({});
  const { id } = useParams();
  const [dateComment, setDateComment] = useState(Date.now());
  const dispatch = useDispatch();
  useEffect(() => {
    if (token) {
      fetchAllIdeaStaff(token).then((res) =>
        dispatch(dispatchGetAllIdeaStaff(res))
      );
    }
  }, [token, dispatch, dateComment]);
  useEffect(() => {
    if (token) {
      fetchAllDepartment(token).then((res) =>
        dispatch(dispatchGetAllDepartment(res))
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
  const setNewPost = async () => {
    const dataPost = await axios.get(`/api/get_idea/${id}`, {
      headers: { Authorization: token },
    });
    setObjPost(dataPost.data);
    setColorLike(dataPost.data);
  };
  const setColorLike = (obj) => {
    if (obj.likes.find((e) => e.users === user._id) !== undefined) {
      setUserInteract(true);
    } else {
      setUserInteract(false);
    }
    if (obj.dislikes.find((e) => e.users === user._id) !== undefined) {
      setUserInteractDis(true);
    } else {
      setUserInteractDis(false);
    }
  };
  useEffect(() => {
    setNewPost();
  }, [user, id]);
  useEffect(() => {
    if (token) {
      fetchDetailPost(id, token).then((res) =>
        dispatch(dispatchGetDetailPost(res))
      );
    }
  }, [id, token, dispatch]);
  useEffect(() => {
    if (token) {
      fetchDetailPost(id, token).then((res) =>
        dispatch(dispatchGetDetailPost(res))
      );
    }
  }, [id, token, dispatch]);
  const handleChangeComment = (e) => {
    const { value } = e.target;
    setTextComment(value);
  };
  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `/api/get_idea_comment/${objPost._id}`,
        { text: textComment, checkUser: checkAnonymous },
        { headers: { Authorization: token } }
      );
      setDataComment(res.data);
      setTextComment("");
      setNewPost();
      setDateComment(Date.now());
    } catch (error) {
      console.log(error);
    }
  };
  const handleClikLike = async () => {
    try {
      await axios.put(
        `/api/get_idea_like/${objPost._id}`,
        {},
        { headers: { Authorization: token } }
      );
      setNewPost();
    } catch (error) {
      console.log(error);
    }
  };
  const handleClikDisLike = async () => {
    try {
      await axios.put(
        `/api/get_idea_dislike/${objPost._id}`,
        {},
        { headers: { Authorization: token } }
      );
      setNewPost();
    } catch (error) {
      console.log(error);
    }
  };
  const arr = [];
  objPost?.views?.forEach((item) => {
    if (arr.indexOf(item?.toString()) === -1) {
      arr.push(item?.toString());
    }
  });

  return (
    <div className="wrapic" style={{ marginTop: 75 }}>
      <div className="cm__col1">
        <div className="idea">
          <div className="infowrap">
            <div className="info">
              <p style={{ color: "red" }}>Author:</p>
              {objPost.anonymously ? (
                <p>{objPost.staff_id}</p>
              ) : (
                <p>User Anonymously</p>
              )}
            </div>
          </div>
          <div className="idea__dm">
            <span style={{ fontSize: "22px", fontWeight: "bold" }}>
              Danh muc
            </span>
            : {objPost.category}
          </div>
          <div className="idea__tt">
            <span style={{ fontSize: "22px", fontWeight: "bold" }}>Title</span>:{" "}
            {objPost?.title}
          </div>
          <div>
            <p
              className="idea_desc"
              style={{ fontSize: "22px", fontWeight: "bold" }}
            >
              Description
            </p>
            <p>{objPost?.description}</p>
          </div>
          <div className="cm__btns">
            <div>
              <span>{arr?.length} views</span>
            </div>
            <div>
              {objPost?.createdAt}
              <p style={{ color: "white" }}>{like}</p>
            </div>
            <div className="thumbss">
              {userInteract ? (
                <i
                  className="fa-regular fa-thumbs-up"
                  onClick={handleClikLike}
                />
              ) : (
                <i
                  className="fa-regular fa-thumbs-up"
                  style={{ color: "black" }}
                  onClick={handleClikLike}
                />
              )}
              <span>{objPost?.likes?.length}</span>
            </div>
            <div className="thumbss">
              {userInteractDis ? (
                <i
                  className="fa-regular fa-thumbs-down"
                  onClick={handleClikDisLike}
                />
              ) : (
                <i
                  className="fa-regular fa-thumbs-down"
                  style={{ color: "black" }}
                  onClick={handleClikDisLike}
                />
              )}
              <span>{objPost?.dislikes?.length}</span>
            </div>
          </div>
        </div>
        <div className="comment">
          <div className="comment__header">
            <p>{objPost?.comments?.length} Comments</p>
          </div>
          <div className="cm__form">
            {!objPost?.statusDeadline ? (
              <form
                onSubmit={handleComment}
                className="content_three"
                style={formComment}
              >
                <input
                  disabled
                  style={{ padding: "10px", width: "100%" }}
                  type="text"
                  placeholder="Type a comment..."
                  name="textComment"
                  value={textComment}
                  onChange={handleChangeComment}
                />
                <Link
                  onClick={handleComment}
                  style={formatComentInput}
                  className="comment__btn"
                  to={`/detail_idea/${objPost?._id}`}
                >
                  <i className="fa fa-paper-plane"></i> Send
                </Link>
              </form>
            ) : (
              <form
                onSubmit={handleComment}
                className="content_three"
                style={formComment}
              >
                <input
                  style={{ padding: "10px", width: "100%" }}
                  type="text"
                  placeholder="Type a comment..."
                  name="textComment"
                  value={textComment}
                  onChange={handleChangeComment}
                />
                <Link
                  onClick={handleComment}
                  style={formatComentInput}
                  className="comment__btn"
                  to={`/detail_idea/${objPost?._id}`}
                >
                  <i className="fa fa-paper-plane"></i> Send
                </Link>
              </form>
            )}
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                name="checkUser"
                defaultChecked={checkAnonymous}
                style={{ margin: "0 10px", width: "24px" }}
                onChange={(e) => {
                  if (!checkAnonymous) {
                    setCheckAnonymous(true);
                  } else {
                    setCheckAnonymous(false);
                  }
                }}
              />
              <span style={{ color: "#e44e4e", fontWeight: "bold" }}>
                Anonymously
              </span>
            </div>
          </div>
          <div className="comment__others">
            {objPost?.comments?.map((comment, index) => {
              return (
                <div className="other" key={index}>
                  <div className="other__img">
                    <img
                      src={
                        comment.statusComment
                          ? "../img/anonymously.png"
                          : comment.avatar
                      }
                      alt="1"
                    />
                  </div>
                  <div className="other__info">
                    <div>
                      <p className="other__name">
                        {comment.statusComment
                          ? "User Anonymously"
                          : comment.name}
                      </p>
                    </div>
                    <div>
                      <p>{comment.text}</p>
                    </div>
                    <div className="item__date">
                      Date:{" "}
                      {format(new Date(comment.date), "dd/MM/yyyy HH:mm:ss")}
                    </div>
                    {/* <div className="other__btns">
                                        <div><span className="colorR">Reply</span></div>
                                    </div> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="cm__col2">
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-ride="carousel"
        >
          <ol className="carousel-indicators">
            <li
              data-target="#carouselExampleIndicators"
              data-slide-to={0}
              className="active"
            />
            <li data-target="#carouselExampleIndicators" data-slide-to={1} />
            <li data-target="#carouselExampleIndicators" data-slide-to={2} />
          </ol>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                style={{ height: "300px", objectFit: "cover" }}
                src="../img/exprerence.jpg"
                className="d-block w-100"
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                style={{ height: "300px", objectFit: "cover" }}
                src="../img/learning.jpg"
                className="d-block w-100"
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                style={{ height: "300px", objectFit: "cover" }}
                src="../img/bachground.jpg"
                className="d-block w-100"
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-target="#carouselExampleIndicators"
            data-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="sr-only">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-target="#carouselExampleIndicators"
            data-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="sr-only">Next</span>
          </button>
        </div>
        <div style={{ margin: 20 }}>
          <h3>Other ideas</h3>
        </div>
        {ideaStaff?.map((current, index) => {
          const arr = [];
          current.views.forEach((item) => {
            if (arr.indexOf(item?.toString()) === -1) {
              arr.push(item?.toString());
            }
          });
          return (
            <div className="idea__other" key={index}>
              <Link to={`/detail_idea/${current._id}`}>
                <div style={{ width: "100%", padding: "0 30px" }}>
                  <p style={{ color: "blue" }} className="cm__title">
                    title:{" "}
                    {current.title > 14
                      ? current.title.slice(0, 100) + "..."
                      : current.title}
                  </p>
                  <div className="cm__time">
                    <span>{arr.length} views</span>
                    <span>{current.likes.length} Like</span>
                    <span>{current.dislikes.length} Dislike</span>
                    <p style={{ margin: "3px 0" }}>
                      <span style={{ color: "green" }}>Post</span>:{" "}
                      {format(
                        new Date(current.createdAt),
                        "dd/MM/yyyy HH:mm:ss"
                      )}
                    </p>
                    <p>
                      <span style={{ color: "red" }}>Author</span>:{" "}
                      {current.anonymously
                        ? current.name_user
                        : "User Anonymously"}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
