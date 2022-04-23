import React, { useEffect, useState } from "react";
import {
  fetchAllDepartment,
  dispatchGetAllDepartment,
} from "../../../redux/actions/departmentAction";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { errorNotifi } from "../../utils/Notification/Notification";

const data = {
  name: "",
  set_deadline: "",
  set_deadlineSecond: "",
  error: "",
  success: "",
};

export default function AdminManagerDepartment() {
  const token = useSelector((state) => state.token);
  const department = useSelector((state) => state.depatment);

  const [dataDepartment, setDataDepartment] = useState(data);
  const { departmentAlls } = department;
  const [loading, setLoading] = useState(0);
  const { name, set_deadline, set_deadlineSecond } = dataDepartment;

  const dispatch = useDispatch();
  useEffect(() => {
    if (token) {
      fetchAllDepartment(token).then((res) =>
        dispatch(dispatchGetAllDepartment(res))
      );
    }
  }, [token, dispatch, loading]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataDepartment({
      ...dataDepartment,
      [name]: value,
      error: "",
      success: "",
    });
  };
  const handleAddDepartment = async () => {
    try {
      if (name === "" && set_deadline === "" && set_deadlineSecond === "") {
        errorNotifi("Please enter fullfild!!!");
        return;
      }
      if (name === "") {
        errorNotifi("Please enter name!!!");
        return;
      }
      if (set_deadline === "") {
        errorNotifi("Please enter first time!!!");
        return;
      }
      if (set_deadlineSecond === "") {
        errorNotifi("Please enter final time!!!");
        return;
      }
      const res = await axios.post(
        "/user/add_department/",
        { name, set_deadline, set_deadlineSecond },
        { headers: { Authorization: token } }
      );
      Swal.fire({
        title: "success!",
        html: res.data.msg,
        icon: "success",
        confirmButtonText: "OK",
      }).then((confirm) => {
        if (confirm.isConfirmed) {
          setLoading(Date.now());
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        html: error.response.data.msg,
        icon: "error",
        confirmButtonText: "OK",
      }).then((confirm) => {
        if (confirm.isConfirmed) {
          setLoading(Date.now());
        }
      });
    }
  };
  const handleUpdateDepartment = async (id) => {
    try {
      const res = await axios.put(
        `/user/update_department/${id}`,
        { name, set_deadline, set_deadlineSecond },
        { headers: { Authorization: token } }
      );
      Swal.fire({
        title: "success!",
        html: res.data.msg,
        icon: "success",
        confirmButtonText: "OK",
      }).then((confirm) => {
        if (confirm.isConfirmed) {
          setLoading(Date.now());
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        html: error.response.data.msg,
        icon: "error",
        confirmButtonText: "OK",
      }).then((confirm) => {
        if (confirm.isConfirmed) {
          setLoading(Date.now());
        }
      });
    }
  };
  const handleUpdate = (id) => {
    const objDepart = departmentAlls.find((item) => item._id === id);
    console.log(id);
    setDataDepartment(objDepart);
  };

  const handleDeleteDepartment = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`/user/delete_department/${id}`, {
            headers: { Authorization: token },
          });
          Swal.fire("Deleted!", res.data.msg, "success").then((confirm) => {
            if (confirm.isConfirmed) {
              setLoading(Date.now());
            }
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            html: error.response.data.msg,
            icon: "error",
            confirmButtonText: "OK",
          }).then((confirm) => {
            if (confirm.isConfirmed) {
              setLoading(Date.now());
            }
          });
        }
      }
    });
  };
  return (
    <div id="departmentManager" style={{ marginTop: 110 }}>
      <div className="ct ">
        <Link to="/profileAdmin" className="ct__goProfile">
          <i className="fa fa-long-arrow-alt-left"></i> Go to profile
        </Link>
        <div
          className="mt-4 justify-content-between border border-info "
          style={{ display: "flex", alignItems: "center", padding: 20 }}
        >
          <form className="form-inline">
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control border-info "
                id="inputPassword2"
                placeholder="Enter to search..."
              />
            </div>
            <button type="submit" className="btn btn-info mb-2">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </form>
          <button
            type="button"
            className="btn btn-info mb-2"
            data-toggle="modal"
            data-target="#exampleModal"
          >
            Create
          </button>
        </div>
        <div className="mt-4 tbl border border-info">
          <table className="table table-responsive table-bordered table-hover ">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Department Name</th>
                <th scope="col">First closure date</th>
                <th scope="col">Final closure date</th>
                <th scope="col">Create At</th>
                <th scope="col">Update</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {departmentAlls?.map((current, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{current.name}</td>
                    <td>{current.set_deadline}</td>
                    <td>{current.set_deadlineSecond}</td>
                    <td>{current.createdAt}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-info"
                        onClick={() => {
                          handleUpdate(current._id);
                        }}
                        data-toggle="modal"
                        data-target="#UpdateDepartment"
                      >
                        <i className="fa-solid fa-pen-to-square" />
                        Update
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => {
                          handleDeleteDepartment(current._id);
                        }}
                      >
                        <i className="fa-solid fa-trash" />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ maxWidth: 800 }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Department
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form action>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="cat">Name deparment</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    className="form-control"
                    id="cat"
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <div className="form-group">
                    <label htmlFor="cat">First closure date</label>
                    <input
                      type="date"
                      name="set_deadline"
                      value={set_deadline}
                      onChange={handleChange}
                      className="form-control"
                      id="cat"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cat">Final closure date</label>
                    <input
                      type="date"
                      name="set_deadlineSecond"
                      value={set_deadlineSecond}
                      onChange={handleChange}
                      className="form-control"
                      id="cat"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={() => {
                    setDataDepartment({
                      name: '',
                      set_deadline: "",
                      set_deadlineSecond: "",
                    });
                  }}
                >
                  Close
                </button>
                <Link
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleAddDepartment}
                >
                  Save changes
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Update */}
      <div
        className="modal fade"
        id="UpdateDepartment"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ maxWidth: 800 }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Information
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <form action>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="cat">Name deparment</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={dataDepartment.name}
                    onChange={handleChange}
                    className="form-control col-12"
                    id="cat"
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <div className="form-group">
                    <label htmlFor="cat">First closure date</label>
                    <input
                      type="date"
                      name="set_deadline"
                      defaultValue={dataDepartment.set_deadline}
                      onChange={handleChange}
                      className="form-control"
                      id="cat"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cat">Final closure date</label>
                    <input
                      type="date"
                      name="set_deadlineSecond"
                      defaultValue={dataDepartment.set_deadlineSecond}
                      onChange={handleChange}
                      className="form-control"
                      id="cat"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={() => {
                    setDataDepartment({
                      name: '',
                      set_deadline: "",
                      set_deadlineSecond: "",
                    });
                  }}
                >
                  Close
                </button>
                <Link
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => {
                    handleUpdateDepartment(dataDepartment._id);
                  }}
                >
                  Save changes
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
