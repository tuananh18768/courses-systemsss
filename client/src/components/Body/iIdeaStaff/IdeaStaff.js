import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchAllIdeaStaff,
  dispatchGetAllIdeaStaff,
} from "../../../redux/actions/ideaStaffAction";
import Pagination from "../Pagination/Pagination";

const imgIdea = {
  height: "70px",
  width: "70px",
  borderRadius: "50%",
  objectFit: "cover",
};

export default function IdeaStaff({
  currentPost,
  currentPostStaff,
  departmentChange,
}) {
  return (
    <>
      {departmentChange && currentPost && (
        <div style={{ textAlign: "right", padding: "0 30px" }}>
          <span style={{ margin: "0 10px", width: "100%" }}>
            {currentPost[0]?.departmentDeadlineOne[0]?.set_deadline}
          </span>
          -
          <span style={{ margin: "0 10px", width: "100%" }}>
            {currentPost[0]?.departmentDeadlineOne[0]?.set_deadlineSecond}
          </span>
        </div>
      )}
      {departmentChange && currentPost
        ? currentPost.map((idea, index) => {
            const arr = [];
            idea.views.forEach((item) => {
              if (arr.indexOf(item?.toString()) === -1) {
                arr.push(item?.toString());
              }
            });

            return (
              <div key={index} className="idea__home">
                <div className="divimg">
                  {!idea.anonymously ? (
                    <img
                      className="imgIdea"
                      style={imgIdea}
                      src="../img/anonymously.png"
                      width="200px"
                      height="200px"
                      alt="avatar"
                    />
                  ) : (
                    <img
                      className="imgIdea"
                      style={imgIdea}
                      src={idea.user_avatar}
                      width="200px"
                      height="200px"
                      alt="avatar"
                    />
                  )}
                </div>
                <div className="ideaContent" style={{ width: "825px" }}>
                  <h3>
                    <span
                      style={{
                        color: "rgba(49, 12, 11, 0.89)",
                        fontWeight: "bold",
                      }}
                    >
                      Title
                    </span>
                    : {idea.title}
                  </h3>
                  <p>
                    <span
                      style={{
                        color: "rgba(49, 93, 11, 0.89)",
                        fontWeight: "bold",
                      }}
                    >
                      Brief description
                    </span>
                    :{" "}
                    {idea.description.length > 30
                      ? idea.description.slice(0, 100) + "..."
                      : idea.description}
                  </p>
                  <div className="thumbs">
                    <div className="like">
                      <i className="fa-solid fa-thumbs-up" />{" "}
                      {idea.likes.length}
                    </div>
                    <div className="dislike">
                      <i className="fa-solid fa-thumbs-down" />
                      {idea.dislikes.length}
                    </div>
                    <div className="dislike">
                      <i className="fa-solid fa-comment-dots" />
                      {idea.comments.length}
                    </div>
                    <div className="dislike">
                      <i className="fa-solid fa-eye" />
                      {arr.length}
                    </div>
                  </div>
                  {!idea.anonymously ? (
                    <p style={{ margin: "15px 0" }}>
                      <span style={{ color: "darkred", fontWeight: "bold" }}>
                        Author
                      </span>
                      : User Anonymously
                    </p>
                  ) : (
                    <p style={{ margin: "15px 0" }}>
                      <span style={{ color: "darkred", fontWeight: "bold" }}>
                        Author
                      </span>
                      : {idea.name_user}
                    </p>
                  )}
                </div>
                <div className="ideaBtn">
                  <Link
                    to={`detail_idea/${idea._id}`}
                    className="post__detail btn btn-primary"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            );
          })
        : currentPostStaff.map((idea, index) => {
            const arr = [];
            idea.views.forEach((item) => {
              if (arr.indexOf(item?.toString()) === -1) {
                arr.push(item?.toString());
              }
            });
            return (
              <div key={index} className="idea__home">
                <div className="divimg">
                  {!idea.anonymously ? (
                    <img
                      className="imgIdea"
                      style={imgIdea}
                      src="../img/anonymously.png"
                      width="200px"
                      height="200px"
                      alt="avatar"
                    />
                  ) : (
                    <img
                      className="imgIdea"
                      style={imgIdea}
                      src={idea.user_avatar}
                      width="200px"
                      height="200px"
                      alt="avatar"
                    />
                  )}
                </div>
                <div className="ideaContent" style={{ width: "825px" }}>
                  <h3>
                    <span
                      style={{
                        color: "rgba(49, 12, 11, 0.89)",
                        fontWeight: "bold",
                      }}
                    >
                      Title
                    </span>
                    : {idea.title}
                  </h3>
                  <p>
                    <span
                      style={{
                        color: "rgba(49, 93, 11, 0.89)",
                        fontWeight: "bold",
                      }}
                    >
                      Brief description
                    </span>
                    :{" "}
                    {idea.description.length > 30
                      ? idea.description.slice(0, 100) + "..."
                      : idea.description}
                  </p>
                  <div className="thumbs">
                    <div className="like">
                      <i className="fa-solid fa-thumbs-up" />{" "}
                      {idea.likes.length}
                    </div>
                    <div className="dislike">
                      <i className="fa-solid fa-thumbs-down" />
                      {idea.dislikes.length}
                    </div>
                    <div className="dislike">
                      <i className="fa-solid fa-comment-dots" />
                      {idea.comments.length}
                    </div>
                    <div className="dislike">
                      <i className="fa-solid fa-eye" />
                      {arr.length}
                    </div>
                  </div>
                  {!idea.anonymously ? (
                    <p style={{ margin: "15px 0" }}>
                      <span style={{ color: "darkred", fontWeight: "bold" }}>
                        Author
                      </span>
                      : User Anonymously
                    </p>
                  ) : (
                    <p style={{ margin: "15px 0" }}>
                      <span style={{ color: "darkred", fontWeight: "bold" }}>
                        Author
                      </span>
                      : {idea.name_user}
                    </p>
                  )}
                </div>
                <div className="ideaBtn">
                  <Link
                    to={`detail_idea/${idea._id}`}
                    className="post__detail btn btn-primary"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            );
          })}
      {/* <Pagination handleClickPage={handleClickPage}/> */}
    </>
  );
}
