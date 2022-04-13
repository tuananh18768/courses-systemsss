import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { fetchAvatar, dispatchGetAvatar } from "../../redux/actions/authAction";
import reponsive from "./reponsiveHeader.module.css";

export default function Header() {
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const { user, isLogged, isAdmin, isManager, getAvatar } = auth;
  const handleLogout = async () => {
    try {
      await axios.get("/user/logout");
      localStorage.removeItem("firstLogin");
      window.location.href = "/";
    } catch (error) {
      window.location.href = "/";
    }
  };
  useEffect(() => {
    if (token) {
      fetchAvatar(token).then((res) => dispatch(dispatchGetAvatar(res)));
    }
  }, [token, dispatch]);
  const userLink = () => {
    return (
      <div className="header" style={{ display: "flex" }}>
        <div className="logo">
          <img
            src="https://colorlib.com/polygon/cooladmin/images/icon/logo.png"
            alt="helo"
          />
        </div>
        <div className="wrapsb" style={{ height: 0 }}>
          <div className="header-search">
            <form action>
              <input type="text" placeholder="Enter..." />
              <button className type="submit">
                <i className="fa-solid fa-magnifying-glass" />
              </button>
            </form>
          </div>
          <div className="header-button">
            <div className="header__noti">
              <img
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                src={
                  getAvatar
                    ? `https://courses-systems.herokuapp.com/${getAvatar?.filePath}`
                    : user.avatar
                }
                alt="221"
              />
              <div className="header__noti-item">
                <span>
                  {user.name} <i className="fa-solid fa-chevron-down" />
                </span>
                <div className="noti__dropdown accountDrop">
                  <div className="noti__dropdown-header">
                    <img
                      style={{
                        objectFit: "cover",
                      }}
                      src={
                        getAvatar
                          ? `https://courses-systems.herokuapp.com/${getAvatar?.filePath}`
                          : user.avatar
                      }
                      alt="alo1"
                    />
                    <div>
                      <h3>{user.name}</h3>
                      <p style={{ margin: 0 }}>{user.email}</p>
                    </div>
                  </div>
                  <ul className="noti__dropdown-list">
                    <li className="noti__dropdown-item">
                      <Link
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "blue",
                          padding: 16,
                        }}
                        to={isAdmin ? `/profileAdmin` : `/profile`}
                        className="noti__dropdown-link"
                      >
                        <i className="fa-solid fa-user" />
                        <div className="noti__dropdown-info">
                          <p
                            style={{ margin: 0 }}
                            className="noti__dropdown-name"
                          >
                            Account
                          </p>
                        </div>
                      </Link>
                    </li>
                    {isLogged && !isAdmin && !isManager && (
                      <li className="noti__dropdown-item">
                        <Link
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "blue",
                            padding: 16,
                          }}
                          to="/managerIdea"
                          className="noti__dropdown-link"
                        >
                          <i class="fa-solid fa-folder"></i>
                          <div className="noti__dropdown-info">
                            <p
                              style={{ margin: 0 }}
                              className="noti__dropdown-name"
                            >
                              Manager Idea
                            </p>
                          </div>
                        </Link>
                      </li>
                    )}

                    {isManager && (
                      <li className="noti__dropdown-item">
                        <Link
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "blue",
                            padding: 16,
                          }}
                          to="/managerIdea"
                          className="noti__dropdown-link"
                        >
                          <i className="fa-solid fa-power-off" />
                          <div className="noti__dropdown-info">
                            <p
                              style={{ margin: 0 }}
                              className="noti__dropdown-name"
                            >
                              Manager Category
                            </p>
                          </div>
                        </Link>
                      </li>
                    )}
                    {isAdmin && (
                      <li
                        onClick={() => {
                          handleLogout();
                        }}
                        className="noti__dropdown-item"
                      >
                        <Link
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "blue",
                            padding: 16,
                          }}
                          to="/managerStaff"
                          className="noti__dropdown-link"
                        >
                          <i class="fa-solid fa-users"></i>
                          <div className="noti__dropdown-info">
                            <p
                              style={{ margin: 0 }}
                              className="noti__dropdown-name"
                            >
                              Manager Stafff
                            </p>
                          </div>
                        </Link>
                      </li>
                    )}
                    {isAdmin && (
                      <li
                        onClick={() => {
                          handleLogout();
                        }}
                        className="noti__dropdown-item"
                      >
                        <Link
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "blue",
                            padding: 16,
                          }}
                          to="/managerCoordinator"
                          className="noti__dropdown-link"
                        >
                          <i class="fa-solid fa-user-pen"></i>
                          <div className="noti__dropdown-info">
                            <p
                              style={{ margin: 0 }}
                              className="noti__dropdown-name"
                            >
                              Manager Coordinator
                            </p>
                          </div>
                        </Link>
                      </li>
                    )}
                    {isAdmin && (
                      <li
                        onClick={() => {
                          handleLogout();
                        }}
                        className="noti__dropdown-item"
                      >
                        <Link
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "blue",
                            padding: 16,
                          }}
                          to="/managerManger"
                          className="noti__dropdown-link"
                        >
                          <i class="fa-solid fa-user-tie"></i>
                          <div className="noti__dropdown-info">
                            <p
                              style={{ margin: 0 }}
                              className="noti__dropdown-name"
                            >
                              Manager Manager
                            </p>
                          </div>
                        </Link>
                      </li>
                    )}
                    <li
                      onClick={() => {
                        handleLogout();
                      }}
                      className="noti__dropdown-item"
                    >
                      <Link
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "blue",
                          padding: 16,
                        }}
                        to="/"
                        className="noti__dropdown-link"
                      >
                        <i className="fa-solid fa-power-off" />
                        <div className="noti__dropdown-info">
                          <p
                            style={{ margin: 0 }}
                            className="noti__dropdown-name"
                          >
                            Logout
                          </p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  console.log(getAvatar);
  return (
    <header className="header">
      <div className="header__content">
        <div className="header__logo">
          <Link
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "14px",
              margin: "10px",
            }}
            to="/"
          >
            <img src="../img/logo.jpg" alt="logo" className="header__img" />{" "}
            Courses Sytems{" "}
          </Link>
        </div>
        <div className="header__login">
          <ul style={{ margin: 0 }}>
            {isLogged ? (
              userLink()
            ) : (
              <button className="btn btn-primary">
                <Link to="/login" style={{ color: "white" }}>
                  <i className="fa fa-user"></i> Sign In
                </Link>
              </button>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
