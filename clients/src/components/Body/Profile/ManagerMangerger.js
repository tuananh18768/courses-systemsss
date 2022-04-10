import React, { useEffect, useState } from 'react'
import { isEmpty, isEmail, isPassword, isCf_pass } from '../../utils/validation/validation'
import { errorNotifi, successNotifi } from '../../utils/Notification/Notification'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllUsers, dispatchGetAllUsers } from '../../../redux/actions/userAction'
import Swal from 'sweetalert2'

const initialState = {
    name: '',
    email: '',
    password: '',
    cf_password: '',
    role: '2',
  }
export default function ManagerMangerger() {
    const allUsers = useSelector(state => state.users)
  const token = useSelector(state => state.token)
  const auth = useSelector(state => state.auth)

  const { isAdmin } = auth
  const [register, setRegister] = useState(initialState)
  const [managers, setManagers] = useState([])
  const [loading, setLoading] = useState(0)

  const { name, email, password, cf_password, role } = register

  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isEmpty(name) || !isEmpty(password)) {
      return errorNotifi('Please fill in all fields!!!')
    }
    if (!isEmail(email)) {
      return errorNotifi('Invalid email.')
    }
    if (!isPassword(password)) {
      return errorNotifi('Password must be at least 6 characters.')
    }
    if (!isCf_pass(password, cf_password)) {
      return errorNotifi('Password is not match!!')
    }
    try {
      const res = await axios.post('http://localhost:5000/user/register', { name, email, password, role })
      successNotifi(res.data.msg)
      setLoading(Date.now())
    } catch (error) {
      errorNotifi(error.response.data.msg)
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setRegister({ ...register, [name]: value })
  }
  useEffect(() => {
    if (token) {
      fetchAllUsers(token).then(res => dispatch(dispatchGetAllUsers(res)))
    }
  }, [token, dispatch, loading])

  const allUserStaff = () => {
    const staffsAll = allUsers.filter(user => user.role === 2)
    setManagers(staffsAll)
  }
  useEffect(() => {
    allUserStaff()
  }, [allUsers, loading])

  const handleUpdate = (id) => {
    const staffObj = allUsers.find(user => user._id === id)
    setRegister(staffObj)
  }
  const updatePassword = (e, id) => {
    e.preventDefault()
    if (!isPassword(password)) {
      return errorNotifi('Password must be at least 6 characters')
    }
    if (!isCf_pass(password, cf_password)) {
      return errorNotifi('Password is not match!!')
    }
    try {
      const res = axios.patch(`/user/update_role/${id}`, { password },
        { headers: { Authorization: token } })
      successNotifi(res.msg)
      setLoading(Date.now())
    } catch (error) {
      errorNotifi(error.response.data.msg)
    }
  }
  const closeUpdate = () => {
    setRegister({ ...register, password: '', cf_password: '' })
  }
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`/user/delete_user/${id}`, { headers: { Authorization: token} })
          Swal.fire(
            'Deleted!',
            res.data.msg,
            'success'
          ).then(confirm => {
            if (confirm.isConfirmed) {
              setLoading(Date.now())
            }
          })
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            html: error.response.data.msg,
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(confirm => {
            if (confirm.isConfirmed) {
              setLoading(Date.now())
            }
          })
        }
      }
    })
  }
  return (
    <div>
        <div>
        <div className="admnStaff">
          <div className="admnStaff__header">
            <h2 style={{ fontFamily: '"Handlee", cursive' }}>Manager</h2>
            <button style={{ minWidth: 200}} className="admnStaff__header__button" data-toggle="modal" data-target="#exampleModal"><i className="fa-solid fa-circle-plus" /> Add New Manager</button>
          </div>
          <div className="admnStaff__content">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Avatar</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((current, index) => {
                  return <tr key={index}>
                    <th >{index + 1}</th>
                    <td ><img className="anhdd" src={current.avatar} alt="anh" /></td>
                    <td>{current.name}</td>
                    <td>{current.email}</td>
                    {/* <td></td> */}
                    <td className="table__td"><i data-toggle="modal" data-target="#updateStaffs" className="fa-solid fa-pen admns__icon1" onClick={() => { handleUpdate(current._id) }} /> <i className="admns__icon2 fa-solid fa-trash" onClick={()=>{handleDelete(current._id)}} /> </td>
                  </tr>
                })}


              </tbody>
            </table>
          </div>
        </div>
        {/* Modal */}
        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" style={{ maxWidth: 1200 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Register</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form action>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="col-12" htmlFor="cat">Name</label>
                    <input type="text" style={{ width: '100%' }} onChange={handleChange} name="name" className="form-control col-12" id="cat" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="age">Email</label>
                    <input type="text" style={{ width: '100%' }} name="email" onChange={handleChange} className="form-control" id="age" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Password</label>
                    <input type="text" style={{ width: '100%' }} name="password" onChange={handleChange} className="form-control" id="address" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Confirm Password</label>
                    <input type="text" style={{ width: '100%' }} name="cf_password" onChange={handleChange} className="form-control" id="address" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Role</label>
                    <input type="text" style={{ width: '100%' }} name="role" onChange={handleChange} defaultValue="Manager" disabled className="form-control" id="address" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-success" onClick={handleSubmit}>Register</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Update */}
        <div className="modal fade" id="updateStaffs" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" style={{ maxWidth: 1200 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Information</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form action>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="col-12" htmlFor="cat">Name</label>
                    <input type="text" style={{ width: '100%' }} defaultValue={name} onChange={handleChange} name="name" className="form-control col-12" id="cat" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="age">Email</label>
                    <input type="text" style={{ width: '100%' }} defaultValue={email} name="email" onChange={handleChange} className="form-control" id="age" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Password</label>
                    <input type="text" style={{ width: '100%' }} value={password} name="password" onChange={handleChange} className="form-control" id="address" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Confirm Password</label>
                    <input type="text" style={{ width: '100%' }} value={cf_password} name="cf_password" onChange={handleChange} className="form-control" id="address" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Role</label>
                    <input type="text" style={{ width: '100%' }} name="role" onChange={handleChange} defaultValue="Manager" disabled className="form-control" id="address" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closeUpdate}>Close</button>
                  <button type="submit" className="btn btn-success" onClick={(e) => { updatePassword(e, register._id) }}>Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
