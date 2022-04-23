import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
export default function Pagination({
    postPerpage,
    handleClickPage,
    currentPage,
}) {
    const ideaStaffs = useSelector((state) => state.ideaStaff);

    const totalPage = [];
    for (let i = 1; i <= Math.ceil(ideaStaffs.length / postPerpage); i++) {
        totalPage.push(i);
    }

    return (
        <div className="post__pagination">
            <button
                style={{ background: "transparent" }}
                disabled={currentPage <= 1}
                className="post__pagination--left"
            >
                <i
                    style={{ cursor: "pointer" }}
                    className="fa fa-angle-left"
                    onClick={() => {
                        handleClickPage(currentPage - 1, totalPage.length);
                    }}
                />
            </button>
            <div className="post__pagination--center">
                {totalPage.map((current, index, arr) => {
                    return (
                        <Link
                            to=""
                            onClick={() => {
                                handleClickPage(current, arr.length);
                            }}
                            key={index}
                            className="btn btn-primary"
                        >
                            {current}
                        </Link>
                    );
                })}
            </div>
            <button
                id="nextPage"
                disabled={currentPage >= totalPage.length}
                className="post__pagination--right"
            >
                <i
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        handleClickPage(currentPage + 1, totalPage.length);
                    }}
                    className="fa fa-angle-right"
                />
            </button>
        </div>
    );
}
