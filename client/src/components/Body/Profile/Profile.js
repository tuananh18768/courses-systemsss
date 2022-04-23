import React, { useEffect, useState } from "react";
// import style from './profile.module.css'
import {
  fetchAllUsers,
  dispatchGetAllUsers,
} from "../../../redux/actions/userAction";
import axios from "axios";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../utils/Notification/Notification";
import { isPassword, isCf_pass } from "../../utils/validation/validation";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchAvatar,
  dispatchGetAvatar,
} from "../../../redux/actions/authAction";

const initialState = {
  name: "",
  password: "",
  cf_password: "",
  err: "",
  success: "",
};

export default function Profile() {
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);
  const users = useSelector((state) => state.users);

  const { user, isAdmin, isManager, getAvatar } = auth;
  const [data, setData] = useState(initialState);
  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);
  const [date, setDate] = useState(Date.now());

  const dispatch = useDispatch();

  const { name, password, cf_password, err, success } = data;
  useEffect(() => {
    if (token) {
      fetchAvatar(token).then((res) => dispatch(dispatchGetAvatar(res)));
    }
  }, [token, dispatch, callback, date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };
  const updateInfor = () => {
    try {
      axios.patch(
        "/user/update_infor",
        {
          name: name ? name : user.name,
        },
        {
          headers: { Authorization: token },
        }
      );
      setData({ ...data, err: "", success: "Update success" });
    } catch (error) {
      setData({ ...data, err: error.response.data.msg, success: "" });
    }
  };
  const updatePassword = () => {
    if (!isPassword(password)) {
      return setData({
        ...data,
        err: "Password must be at least 6 characters",
        success: "",
      });
    }
    if (!isCf_pass(password, cf_password)) {
      return setData({ ...data, err: "Password is not match!!", success: "" });
    }
    try {
      axios.post(
        "/user/reset",
        { password },
        { headers: { Authorization: token } }
      );
      setData({ ...data, err: "", success: "Update success" });
    } catch (error) {
      setData({ ...data, err: error.response.data.msg, success: "" });
    }
  };
  const handleUpdate = () => {
    if (name) updateInfor();
    if (password) updatePassword();
  };
  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      console.log(file);
      if (!file)
        return setData({ ...data, err: "not file upload", success: "" });
      if (file.size > 1024 * 1024) {
        return setData({ ...data, err: "Size to large", success: "" });
      }
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        return setData({ ...data, err: "file is not format", success: "" });
      }
      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post("/api/avater_upload", formData, {
        headers: {
          "contetn-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setAvatar(res.data.url);
      setDate(Date.now());
    } catch (error) {
      setData({ ...data, err: error.response.data.msg, success: "" });
    }
  };
  const linkImage = getAvatar
    ? `https://app-courses-project.herokuapp.com/${getAvatar?.filePath}`
    : user.avatar;

  console.log(getAvatar);
  return (
    <>
      <div style={{ marginTop: "75px" }}>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        {loading && <h3>Loadding ....</h3>}
      </div>
      <div className="body">
        <div className="wraper_profile">
          <div className="wraper_profile_left">
            <div className="wraper_profile_left_all">
              <h2>{isAdmin ? "Admin Profile" : "User Profile"}</h2>
              <div
                className="parent__file"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "50%",
                }}
              >
                <img
                  className="img_profile"
                  // src={avatar ? avatar : user.avatar}
                  src={linkImage}
                  width="200px"
                  height="200px"
                  alt="helo"
                />
                <div className="span__chooseFile">
                  <i className="fa fa-camera-retro"></i>
                  <p style={{ margin: 0 }}>Change</p>
                  <input
                    type="file"
                    name="file"
                    id="file_up"
                    onChange={changeAvatar}
                  />
                </div>
              </div>
              <div>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
            </div>
          </div>
          <div className="wraper_profile_middle">
            <h1 className="wraper_profile_heading">Basic Information</h1>
            <hr />
            <div className="form-group container-fluid">
              <div className="row flex-column flex-lg-row">
                <div className="col-2">
                  <label htmlFor="name">Name</label>
                </div>
                <div className="col-12 col-lg-10">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your name"
                    defaultValue={user.name}
                    onChange={handleChange}
                    className="w-100"
                  />
                </div>
              </div>
            </div>
            <div className="form-group container-fluid">
              <div className="row flex-column flex-lg-row">
                <div className="col-2">
                  <label htmlFor="email">Email</label>
                </div>
                <div className="col-12 col-lg-10">
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Email address"
                    defaultValue={user.email}
                    disabled
                    className="w-100"
                  />
                </div>
              </div>
            </div>
            <div className="form-group container-fluid">
              <div className="row flex-column flex-lg-row">
                <div className="col-2">
                  <label htmlFor="password">New password</label>
                </div>
                <div className="col-12 col-lg-10">
                  <input
                    type="pass"
                    name="password"
                    id="password"
                    placeholder="New password address"
                    value={password}
                    onChange={handleChange}
                    className="w-100"
                  />
                </div>
              </div>
            </div>
            <div className="form-group container-fluid">
              <div className="row flex-column flex-lg-row">
                <div className="col-2">
                  <label htmlFor="password">Confirm password</label>
                </div>
                <div className="col-12 col-lg-10">
                  <input
                    type="pass"
                    name="password"
                    id="password"
                    placeholder="New password address"
                    value={cf_password}
                    onChange={handleChange}
                    className="w-100"
                  />
                </div>
              </div>
            </div>
            <button
              style={{ color: "#fff" }}
              disabled={loading}
              onClick={handleUpdate}
              className="wraper_profile_submit"
            >
              Update
            </button>
          </div>

          <div className="wraper_profile_right">
            <button>
              <Link to="/">Go view home</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
