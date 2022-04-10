import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchIdeaOfStaff, dispatchIdeaOfStaff } from '../../../redux/actions/allIdeaOfStaff'
import { format } from 'date-fns'
import { fetchAllIdeaStaff, dispatchGetAllIdeaStaff } from '../../../redux/actions/ideaStaffAction'
import axios from 'axios'
import { fetchAllCategory, dispatchGetAllCategory } from '../../../redux/actions/categoryAction'
import Swal from 'sweetalert2'
import { fetchAllDepartment, dispatchGetAllDepartment } from '../../../redux/actions/departmentAction'
import { errorNotifi } from '../../utils/Notification/Notification'

const formManagerIdea = {
    height: "80px",
    padding: "10px 42px",
    backgroundColor: "#fff",
    boxShadow: "2px 2px 2px 2px rgb(83 90 90 / 26%)",
    borderRadius: "2px",
    display: "flex",
    alignItems: "center",
}
const formSearch = {
    padding: "0",
    backgroundColor: "transparent",
    border: "0",
}
const formatDateUpdate = {
    backgroundColor: "#138496",
    padding: "10px",
    color: "#fff",
}
const dataUpload = {
    title: '',
    description: '',
    error: '',
    success: '',
}
const dataCategory = {
    name: '',
    errorCate: '',
    successCate: '',
}


export default function MangerIdea() {
    const allIdeaOfStaff = useSelector(state => state.allIdeaOfStaff)
    const token = useSelector(state => state.token)
    const categories = useSelector(state => state.category)
    const auth = useSelector((state) => state.auth);
    const department = useSelector(state => state.depatment)


    const { isManager, isUSer } = auth
    const { departmentAlls } = department
    const dispatch = useDispatch()

    const [checkAnonymous, setCheckAnonymous] = useState(false)
    const [anymouserUpdate, setAnymouserUpdate] = useState(false)
    const [modal, setModal] = useState(dataUpload)
    const [modalCate, setModalCate] = useState(dataCategory)
    const [category, setCategory] = useState()
    const [departments, setDepartments] = useState()
    const [objectMessage, setobjectMessage] = useState(false)
    const [file, setFile] = useState([])
    const [id, setId] = useState()
    const [loadData, setLoadData] = useState(0)


    const { title, description, error, success } = modal
    const { name, errorCate, successCate } = modalCate
    useEffect(() => {
        if (token) {
            fetchAllIdeaStaff(token).then(res => dispatch(dispatchGetAllIdeaStaff(res)))
        }
    }, [token, dispatch])
    console.log(loadData)
    useEffect(() => {
        if (token) {
            fetchIdeaOfStaff(token).then(res => dispatch(dispatchIdeaOfStaff(res)))
        }
    }, [token, dispatch, loadData])
    useEffect(() => {
        if (token) {
            fetchAllCategory(token).then(res => (dispatch(dispatchGetAllCategory(res))))
        }
    }, [token, dispatch])
    useEffect(() => {
        if (token) {
            fetchAllDepartment(token).then(res => dispatch(dispatchGetAllDepartment(res)))
        }
    }, [token, dispatch])
    const handleUpdate = (id) => {
        const postItem = allIdeaOfStaff.find(item => item._id === id)
        const findIdByName = categories.find(e => e.name === postItem.category)
        setobjectMessage(false)
        setCategory(findIdByName._id)
        setModal(postItem)
        setAnymouserUpdate(postItem.anonymously)
    }
    const handleChangeFile = (e) => {
        setFile(e.target.files)
    }
    const updateModal = (field, event) => {
        const value = event.target.value
        modal[field] = value
        setModal({ ...modal })
    }
    const handleSubmitUpdate = async (e, id) => {
        e.preventDefault()
        let formData = new FormData();
        formData.append("title", modal.title)
        formData.append("category", category)
        formData.append("description", modal.description)
        formData.append("anonymously", anymouserUpdate)
        for (let i = 0; i < file.length; i++) {
            formData.append("file", file[i])
        }
        console.log(category);
        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.post(`/api/update_idea/${id}`, formData, { headers: { Authorization: token } })
                    setobjectMessage({ status: true, message: res.data.msg })
                    Swal.fire(res.data.msg, '', 'success').then(confirm => {
                        if (confirm.isConfirmed) {
                            setLoadData(Date.now())
                        }
                    })
                } catch (error) {
                    Swal.fire(error.response.data.msg, '', 'error').then(confirm => {
                        if (confirm.isConfirmed) {
                            setLoadData(Date.now())
                        }
                    })
                    setobjectMessage({ status: false, message: error.response.data.msg })
                }

            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setModal({ ...modal, [name]: value, error, success })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        let formData = new FormData();
        formData.append("title", title)
        formData.append("description", description)
        formData.append("category", category)
        formData.append("anonymously", checkAnonymous)
        for (let i = 0; i < file.length; i++) {
            formData.append("file", file[i])
        }
        if (title === '' || description === '' ) {
            errorNotifi('Please enter full !!!')
            return
        }
        if( category === '' || category === 'undefined' || category === undefined){
            errorNotifi('Please choose category!!!')
            return
        }
        try {
            const res = await axios.post('/api/upload_idea/', formData, { headers: { Authorization: token, "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>" } })
            setobjectMessage({ status: true, message: res.data.msg })
            setLoadData(Date.now())
        } catch (error) {
            setobjectMessage({ status: false, message: error.response?.data.msg })
        }
    }

    const handleDelete = async (id) => {
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
                    const res = await axios.delete(`/api/delete_idea/${id}`, { headers: { Authorization: token, "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>" } })
                    Swal.fire(
                        'Deleted!',
                        res.data.msg,
                        'success'
                    ).then(confirm => {
                        if (confirm.isConfirmed) {
                            setLoadData(Date.now())
                        }
                    })
                } catch (error) {
                    setobjectMessage({ status: false, message: error.response.data.msg })
                    Swal.fire({
                        title: 'Error!',
                        html: error.response.data.msg,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    }).then(confirm => {
                        if (confirm.isConfirmed) {
                            setLoadData(Date.now())
                        }
                    })
                }

            }
        })
    }
    const handleDeleteCate = async (id) => {
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
                    const res = await axios.delete(`/user/delete_category/${id}`, { headers: { Authorization: token } })
                    Swal.fire(
                        'Deleted!',
                        `${res.data.msg}`,
                        'success'
                    ).then(confirm => {
                        if (confirm.isConfirmed) {
                            setLoadData(Date.now())
                        }
                    })
                } catch (error) {
                    setobjectMessage({ status: false, message: error.response.data.msg })
                    Swal.fire({
                        title: 'Error!',
                        html: error.response.data.msg,
                        icon: 'error',
                        confirmButtonText: 'OK'
                    }).then(confirm => {
                        if (confirm.isConfirmed) {
                            setLoadData(Date.now())
                        }
                    })
                }

            }
        })


    }
    const handleChangeCate = async (e) => {
        const { name, value } = e.target
        setModalCate({ ...modalCate, [name]: value, errorCate: '', successCate: '' })
    }
    const handleSubmitCate = async (e) => {
        e.preventDefault()
        // let formDataCate = new FormData();
        // console.log(modalCate.name)
        // console.log(departments)
        // formDataCate.append("name", modalCate.name)
        // formDataCate.append("departments",departments)
        if (departments === undefined && modalCate.name === '') {
            errorNotifi('Please enter full !!!')
            return
        }
        if (modalCate.name === '') {
            errorNotifi('Please enter name category!!!')
            return
        }
        if (departments === 'undefined' || departments === undefined) {
            errorNotifi('Please choose department!!!')
            return
        }
        // console.log(formDataCate);
        try {
            const res = await axios.post('/user/add_category/', { name, departments }, { headers: { Authorization: token } })
            Swal.fire({
                title: 'success!',
                html: res.data.msg,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(confirm => {
                if (confirm.isConfirmed) {
                    setLoadData(Date.now())
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
                    setLoadData(Date.now())
                }
            })
        }
    }
    const handleViewUpdateCate = (id) => {
        const postItem = categories.find(item => item._id === id)
        setModalCate(postItem)
    }

    successCate && Swal.fire({
        title: 'success!',
        html: successCate,
        icon: 'success',
        confirmButtonText: 'OK'
    })
    errorCate && errorNotifi(errorCate)
    const handleUpdateCate = async (e, id) => {
        e.preventDefault()
        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.patch(`/user/update_category/${id}`, { name, departments }, { headers: { Authorization: token } })
                    // setModalCate({...modalCate, errorCate: '',successCate: res.data.msg })
                    Swal.fire(res.data.msg, '', 'success').then(confirm => {
                        if (confirm.isConfirmed) {
                            setLoadData(Date.now())
                        }
                    })
                } catch (error) {
                    Swal.fire(error.response.data.msg, '', 'error').then(confirm => {
                        if (confirm.isConfirmed) {
                            setLoadData(Date.now())
                        }
                    })
                    setModalCate({ ...modalCate, errorCate: error.response.data.msg, successCate: '' })
                }
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        })
    }
    // console.log(departments)
    // console.log(allIdeaOfStaff)
    return (
        <div>
            <div>
                {/* accept */}
                <div className="modal fade" style={{ zIndex: '1100' }} id="acceptJoin" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ backgroundColor: '#369598', color: 'white' }}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Đồng ý với các điều khoản</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <ul style={{ listStyle: 'disc inside' }}>
                                    <li>Đồng ý và làm theo nội quy trong hệ thống để mọi người góp ý</li>
                                    <li>Baì viết của bạn sẽ bị ẩn danh người đăng để bảo mật thông tin cho bạn và mọi người</li>
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={handleSubmit}>Accept</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* content */}
                <div className="ct ">
                    <Link to="/profile" className="ct__goProfile"><i className="fa fa-long-arrow-alt-left"></i> Go to profile</Link>
                    <div className="mt-4 justify-content-between border border-info  " style={formManagerIdea}>
                        <form style={formSearch} className="form-inline">
                            <div className="form-group mb-2 ">
                                <input type="text" className="form-control border-info " id="inputPassword2" placeholder="Enter to search..." />
                            </div>
                            <button type="submit" className="btn btn-info mb-2"><i className="fa-solid fa-magnifying-glass" /></button>
                        </form>
                        <button type="button" className="btn btn-info mb-2" data-toggle="modal" data-target="#addIdea" onClick={() => {
                            setCategory('')
                            setModal(dataUpload)
                        }}>Create</button>
                    </div>
                    <div className="mt-4 tbl border border-info">
                        <table className="table table-bordered table-hover ">
                            <thead>
                                {
                                    isManager && <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Create At</th>
                                        <th scope="col">Update</th>
                                        <th scope="col">Delete</th>
                                    </tr>}
                                {isUSer &&
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Title</th>
                                        <th scope="col">Category Name</th>
                                        <th scope="col">Create At</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Update</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                }

                            </thead>
                            <tbody>
                                {isManager && categories.map((current, index) => {
                                    return <tr key={index}>
                                        <td>{index}</td>
                                        <td>{current.name}</td>
                                        <td>{format(new Date(current.createdAt), 'dd/MM/yyyy HH:mm:ss')}</td>
                                        <td>
                                            <button type="button" onClick={() => { handleViewUpdateCate(current._id) }} className="btn btn-outline-info" data-toggle="modal" data-target="#exampleModal">Update</button>
                                        </td>
                                        <td><button type="button" className="btn btn-outline-danger" onClick={() => { handleDeleteCate(current._id) }}><i className="fa-solid fa-trash" />Delete</button></td>
                                    </tr>
                                })}
                                {isUSer && allIdeaOfStaff?.map((current, index) => {
                                    return <tr key={index}>
                                        <td >{index}</td>
                                        <td>{current.title}</td>
                                        <td>{current.category}</td>
                                        <td>{format(new Date(current.createdAt), 'dd/MM/yyyy HH:mm:ss')}</td>
                                        <td>{current.statusDeadline ? <p >Active</p> : <p className="text-danger">Over due schem</p>}</td>
                                        <td>
                                            <button type="button" onClick={() => { handleUpdate(current._id) }} className="btn btn-outline-info" data-toggle="modal" data-target="#exampleModal">Update</button>
                                        </td>
                                        <td><button type="button" className="btn btn-outline-danger" onClick={() => { handleDelete(current._id) }} ><i className="fa-solid fa-trash" />Delete</button></td>
                                    </tr>

                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {isManager && <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" style={{ maxWidth: 1200 }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Information</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <form style={formSearch}>
                                <div className="modal-body">
                                    <div className="update_detail">
                                        <div className="form-group">
                                            <label className="col-12" htmlFor="cat">Name</label>
                                            <input type="text" style={{ width: '100%' }} name="name" onChange={handleChangeCate} defaultValue={modalCate?.name} className="form-control col-12" id="cat" />
                                        </div>
                                        <div className="form-group">
                                            <label className="col-12" htmlFor="category">Department</label>
                                            <select name="departments" className="col-12" id="category" onChange={(p) => setDepartments(p.target.value)}>
                                                {departmentAlls?.map((element, index) => {
                                                    return <option key={index} value={element._id} selected={category === element.name}>{element.name}</option>
                                                })
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cat">First post</label>
                                            <p style={formatDateUpdate}>{modalCate.createdAt ? format(new Date(modalCate?.createdAt), 'dd/MM/yyyy HH:mm:ss') : <p></p>} </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={(e) => { handleUpdateCate(e, modalCate._id) }}>Save changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>}
                {isUSer && <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" style={{ maxWidth: 1200 }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Information update</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <form style={formSearch}>
                                <div className="modal-body">
                                    <div className="update_detail">
                                        <div className="form-group">
                                            <label className="col-12" htmlFor="cat">Title</label>
                                            <input type="text" style={{ width: '100%' }} className="form-control col-12" id="cat" value={modal.title} onChange={(e) => { updateModal("title", e) }} />
                                        </div>
                                        <div className="form-group">
                                            <label className="col-12" htmlFor="category">Category</label>
                                            <select name="category" className="col-12" id="category" onChange={(p) => setCategory(p.target.value)}>
                                                {categories?.map((element, index) => {
                                                    return <option key={index} value={element._id} selected={modal.category === element.name}>{element.name}</option>
                                                })
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cat">Description</label>
                                            <textarea className="col-12" id="textarea" name="description" style={{ height: 200 }} placeholder="Enter text here..." value={modal.description} onChange={(e) => { updateModal("description", e) }} />
                                        </div>
                                        <div className="form-group">
                                            <label className="col-12" htmlFor="file-input">File</label>
                                            <input className="col-12" type="file" id="file-input" name="file" multiple onChange={handleChangeFile} />
                                        </div>
                                        <div className="form-group" style={{ textAlign: 'right', marginRight: 30 }}>
                                            <label className="col-12" htmlFor="file-input">Anonymously</label>
                                            <input className="col-12" type="checkbox" name="check" id="checkAnonymous" onChange={(e) => { setAnymouserUpdate(e.target.checked) }} checked={anymouserUpdate} />
                                        </div>
                                        <div className="form-group">
                                            {
                                                objectMessage ? <textarea disabled className="col-12 my-4" id="textarea" name="description" style={{ height: 50, color: objectMessage.status ? "green" : "red" }} value={objectMessage.message} /> : ""
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cat">First post</label>
                                            <p style={formatDateUpdate}>{modal.createdAt ? format(new Date(modal?.createdAt), 'dd/MM/yyyy HH:mm:ss') : <p></p>} </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={(e) => { handleSubmitUpdate(e, modal._id) }}>Save changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                }

                {/* create */}
                {
                    isManager && <div className="modal fade" id="addIdea" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" style={{ maxWidth: 1200 }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Create</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <form style={formSearch}>
                                    <div className="modal-body">
                                        <div className="update_detail">
                                            <div className="form-group">
                                                <label className="col-12" htmlFor="cat">Name</label>
                                                <input type="text" style={{ width: '100%' }} className="form-control col-12" id="cat" name='name' defaultValue={name} onChange={handleChangeCate} />
                                            </div>
                                            <select className="col-12" name="departments" id="departments" value={departments} onChange={(p) => setDepartments(p.target.value)}>
                                                <option value="undefined">------Choose deparment------</option>
                                                {departmentAlls?.map((element, index) => {
                                                    return <option key={index} value={element._id}>{element.name}</option>
                                                })
                                                }
                                            </select>
                                            <div className="form-group mt-4">
                                                <label htmlFor="cat">First post</label>
                                                {
                                                    <p style={formatDateUpdate}>{modal.createdAt ? format(new Date(modal?.createdAt), 'dd/MM/yyyy HH:mm:ss') : <p></p>} </p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        {/* <Link to="/addIdea" id="btn_idea"  data-toggle="modal" data-target="#acceptJoin">SUBMIT</Link> */}
                                        <button type="button" className="btn btn-primary" onClick={handleSubmitCate}>Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                }
                {isUSer && <div className="modal fade" id="addIdea" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" style={{ maxWidth: 1200 }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Create</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <form style={formSearch}>
                                <div className="modal-body">
                                    <div className="update_detail">
                                        <div className="form-group">
                                            <label className="col-12" htmlFor="cat">Title</label>
                                            <input type="text" style={{ width: '100%' }} className="form-control col-12" id="cat" name='title' value={title} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="col-12" htmlFor="category">Category</label>
                                            <select className="col-12" name="category" id="category" value={category} onChange={(p) => setCategory(p.target.value)}>
                                                <option value="undefined">------Choose category------</option>
                                                {categories?.map((element, index) => {
                                                    return <option key={index} value={element._id}>{element.name}</option>
                                                })
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cat">Description</label>
                                            <textarea className="col-12" id="textarea" name="description" style={{ height: 200 }} placeholder="Enter text here..." value={description} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="col-12" htmlFor="file-input">File</label>
                                            <input className="col-12" type="file" id="file-input" name="file" multiple onChange={handleChangeFile} />
                                        </div>
                                        <div className="form-group" style={{ textAlign: 'right', marginRight: 30 }}>
                                            <label className="col-12" htmlFor="file-input">Anonymously</label>
                                            <input className="col-12" type="checkbox" name="check" id="checkAnonymous" defaultChecked={checkAnonymous} onChange={(e) => {
                                                if (!checkAnonymous) {
                                                    setCheckAnonymous(true)
                                                } else {
                                                    setCheckAnonymous(false)
                                                }
                                            }} />
                                        </div>
                                        <div className="form-group">
                                            {
                                                objectMessage ? <textarea disabled className="col-12 my-4" id="textarea" name="description" style={{ height: 50, color: objectMessage.status ? "green" : "red" }} value={objectMessage.message} /> : ""
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cat">First post</label>
                                            {
                                                <p style={formatDateUpdate}>{modal.createdAt ? format(new Date(modal?.createdAt), 'dd/MM/yyyy HH:mm:ss') : <p></p>} </p>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    {/* <Link to="/addIdea" id="btn_idea"  data-toggle="modal" data-target="#acceptJoin">SUBMIT</Link> */}
                                    <button type="button" className="btn btn-primary"  data-toggle="modal" data-target="#acceptJoin">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                }
                <div className="modal fade" id="addIdea" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" style={{ maxWidth: 1200 }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Create</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <form style={formSearch}>
                                <div className="modal-body">
                                    <div className="update_detail">
                                        <div className="form-group">
                                            <label className="col-12" htmlFor="cat">Title</label>
                                            <input type="text" style={{ width: '100%' }} className="form-control col-12" id="cat" name='title' value={title} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="col-12" htmlFor="category">Category</label>
                                            <select className="col-12" name="category" id="category" value={category} onChange={(p) => setCategory(p.target.value)}>
                                                <option>------Choose category------</option>
                                                {categories?.map((element, index) => {
                                                    return <option key={index} value={element._id}>{element.name}</option>
                                                })
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cat">Description</label>
                                            <textarea className="col-12" id="textarea" name="description" style={{ height: 200 }} placeholder="Enter text here..." value={description} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="col-12" htmlFor="file-input">File</label>
                                            <input className="col-12" type="file" id="file-input" name="file" multiple onChange={handleChangeFile} />
                                        </div>
                                        <div className="form-group">
                                            {
                                                objectMessage ? <textarea disabled className="col-12 my-4" id="textarea" name="description" style={{ height: 50, color: objectMessage.status ? "green" : "red" }} value={objectMessage.message} /> : ""
                                            }
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cat">First post</label>
                                            {
                                                <p style={formatDateUpdate}>{modal.createdAt ? format(new Date(modal?.createdAt), 'dd/MM/yyyy HH:mm:ss') : <p></p>} </p>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    {/* <Link to="/addIdea" id="btn_idea"  data-toggle="modal" data-target="#acceptJoin">SUBMIT</Link> */}
                                    <button type="button" className="btn btn-primary"data-toggle="modal" data-target="#acceptJoin">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
